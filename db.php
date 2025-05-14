<?php
// db.php - Database connection using MySQLi (with prepared statements)
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'niit_school';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Database connection failed: ' . $conn->connect_error);
}
?>
