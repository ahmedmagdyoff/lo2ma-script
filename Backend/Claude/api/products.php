<?php
// ============================================================
//  GET /api/products
//  GET /api/products?category=burgers
// ============================================================

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$db       = getDB();
$category = isset($_GET['category']) ? sanitize($_GET['category']) : '';

if ($category && $category !== 'all') {
    $stmt = $db->prepare('SELECT * FROM products WHERE category = ? ORDER BY id');
    $stmt->execute([$category]);
} else {
    $stmt = $db->query('SELECT * FROM products ORDER BY id');
}

$products = $stmt->fetchAll();

// Cast types so JSON matches the original products.json shape
foreach ($products as &$p) {
    $p['id']    = (int)   $p['id'];
    $p['price'] = (float) $p['price'];
}

jsonResponse($products);
