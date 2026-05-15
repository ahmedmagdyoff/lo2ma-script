<?php
// ============================================================
//  POST /api/orders   — place a new order
//  GET  /api/orders   — list all orders  (optional / admin use)
// ============================================================

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

match ($method) {
    'POST' => handlePlaceOrder(),
    'GET'  => handleGetOrders(),
    default => jsonResponse(['error' => 'Method not allowed'], 405),
};


// ============================================================
//  POST — place order
// ============================================================
function handlePlaceOrder(): void
{
    $body = getJsonBody();

    // ---------- Validate customer fields ----------
    $required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    $errors   = [];

    foreach ($required as $field) {
        if (empty(trim((string)($body[$field] ?? '')))) {
            $errors[$field] = 'This field is required';
        }
    }

    if (!empty($body['email']) && !filter_var($body['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Please enter a valid email';
    }

    if (!empty($errors)) {
        jsonResponse(['success' => false, 'errors' => $errors], 422);
    }

    // ---------- Validate items ----------
    $items = $body['items'] ?? [];

    if (empty($items) || !is_array($items)) {
        jsonResponse(['success' => false, 'error' => 'Order must contain at least one item'], 400);
    }

    $db = getDB();

    // ---------- Verify products exist & recalculate prices ----------
    $productIds  = array_unique(array_column($items, 'id'));
    $placeholders = implode(',', array_fill(0, count($productIds), '?'));

    $stmt = $db->prepare("SELECT * FROM products WHERE id IN ($placeholders)");
    $stmt->execute($productIds);
    $dbProducts = $stmt->fetchAll(PDO::FETCH_UNIQUE); // keyed by id

    $totalPrice = 0.0;
    $validItems = [];

    foreach ($items as $item) {
        $pid = (int)($item['id'] ?? 0);
        $qty = (int)($item['quantity'] ?? 1);

        if (!isset($dbProducts[$pid]) || $qty < 1) continue;

        $product   = $dbProducts[$pid];
        $subtotal  = round((float)$product['price'] * $qty, 2);
        $totalPrice += $subtotal;

        $validItems[] = [
            'product_id' => $pid,
            'name'       => $product['name'],
            'price'      => (float)$product['price'],
            'quantity'   => $qty,
            'subtotal'   => $subtotal,
        ];
    }

    if (empty($validItems)) {
        jsonResponse(['success' => false, 'error' => 'No valid items found'], 400);
    }

    // ---------- Generate order code ----------
    $orderCode = 'LS-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));

    // ---------- Insert order + items in a transaction ----------
    $db->beginTransaction();

    try {
        $stmt = $db->prepare('
            INSERT INTO orders
              (order_code, first_name, last_name, email, phone, address, city, notes, total_price)
            VALUES
              (:order_code, :first_name, :last_name, :email, :phone, :address, :city, :notes, :total_price)
        ');

        $stmt->execute([
            ':order_code'  => $orderCode,
            ':first_name'  => sanitize($body['firstName']),
            ':last_name'   => sanitize($body['lastName']),
            ':email'       => sanitize($body['email']),
            ':phone'       => sanitize($body['phone']),
            ':address'     => sanitize($body['address']),
            ':city'        => sanitize($body['city']),
            ':notes'       => sanitize($body['notes'] ?? ''),
            ':total_price' => $totalPrice,
        ]);

        $orderId = (int)$db->lastInsertId();

        $itemStmt = $db->prepare('
            INSERT INTO order_items (order_id, product_id, name, price, quantity, subtotal)
            VALUES (:order_id, :product_id, :name, :price, :quantity, :subtotal)
        ');

        foreach ($validItems as $item) {
            $itemStmt->execute([
                ':order_id'   => $orderId,
                ':product_id' => $item['product_id'],
                ':name'       => $item['name'],
                ':price'      => $item['price'],
                ':quantity'   => $item['quantity'],
                ':subtotal'   => $item['subtotal'],
            ]);
        }

        $db->commit();

        jsonResponse([
            'success'    => true,
            'order_code' => $orderCode,
            'order_id'   => $orderId,
            'total'      => $totalPrice,
        ], 201);
    } catch (Throwable $e) {
        $db->rollBack();
        jsonResponse(['success' => false, 'error' => 'Failed to place order'], 500);
    }
}


// ============================================================
//  GET — list orders (admin / debugging)
// ============================================================
function handleGetOrders(): void
{
    $db = getDB();

    $orders = $db->query('
        SELECT o.*,
               COUNT(oi.id)   AS item_count,
               SUM(oi.quantity) AS total_qty
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT 100
    ')->fetchAll();

    foreach ($orders as &$o) {
        $o['id']         = (int)   $o['id'];
        $o['total_price'] = (float) $o['total_price'];
        $o['item_count'] = (int)   $o['item_count'];
        $o['total_qty']  = (int)   $o['total_qty'];
    }

    jsonResponse($orders);
}
