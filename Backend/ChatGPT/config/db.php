<?php
header("Content-Type: application/json");
$conn = new mysqli('localhost', 'lo2mascript', 'Lo2mascript_2026', 'lo2mascript');
if ($conn->connect_error) die(json_encode(["success" => false, "message" => "Database Connection Failed"]));
$conn->set_charset("utf8mb4");
