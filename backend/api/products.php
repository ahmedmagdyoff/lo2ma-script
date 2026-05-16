<?php
require_once __DIR__ . '/../db.php';
setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);
$db = getDB();
$category = isset($_GET['category']) ? sanitize($_GET['category']) : '';
if ($category && $category !== 'all') {
    $stmt = $db->prepare('SELECT * FROM products WHERE category = ? ORDER BY id');
    $stmt->execute([$category]);
} else $stmt = $db->query('SELECT * FROM products ORDER BY id');
$products = $stmt->fetchAll();
foreach ($products as &$p) {
    $p['id'] = (int) $p['id'];
    $p['price'] = (float) $p['price'];
    $p['image'] = 'images/' . $p['image'];
}
jsonResponse($products);
