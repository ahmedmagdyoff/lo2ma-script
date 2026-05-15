<?php
include "../config/db.php";
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';
$category = $_POST['category'] ?? '';
if (empty($name) || empty($description) || $price === '' || empty($category)) die(json_encode(["success" => false, "message" => "All fields are required"]));
$stmt = $conn->prepare("INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, '')");
$stmt->bind_param("ssds", $name, $description, $price, $category);
if ($stmt->execute()) echo json_encode(["success" => true, "message" => "Product created successfully", "product_id" => $conn->insert_id]);
else die(json_encode(["success" => false, "message" => "Something went wrong"]));
