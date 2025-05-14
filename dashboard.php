<?php
// dashboard.php - Protected dashboard for logged-in users
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
$username = $_SESSION['username'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - NIIT School</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
  <nav class="navbar navbar-expand-lg navbar-dark bg-success">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">NIIT School</a>
      <div class="d-flex">
        <span class="navbar-text me-3">Welcome, <?= htmlspecialchars($username) ?></span>
        <a href="logout.php" class="btn btn-outline-light">Logout</a>
      </div>
    </div>
  </nav>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h2 class="mb-4">Dashboard</h2>
            <p class="lead">You are logged in as <b><?= htmlspecialchars($username) ?></b>.</p>
            <a href="logout.php" class="btn btn-danger mt-3">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
