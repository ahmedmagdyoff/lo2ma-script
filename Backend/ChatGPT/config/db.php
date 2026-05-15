<?php

$host = "localhost";
$user = "lo2mascript";
$password = "Lo2mascript_2026";
$database = "lo2mascript";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Database Connection Failed"
    ]));
}

$conn->set_charset("utf8mb4");
