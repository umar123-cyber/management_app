<?php
// signup.php - User registration
session_start();
require 'db.php';
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm = $_POST['confirm'] ?? '';
    if (!$username || !$email || !$password || !$confirm) {
        $message = 'All fields are required.';
    } elseif ($password !== $confirm) {
        $message = 'Passwords do not match.';
    } else {
        $stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $message = 'Email already registered.';
        } else {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $conn->prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
            $stmt->bind_param('sss', $username, $email, $hash);
            if ($stmt->execute()) {
                $message = 'Sign-up successful! You can now <a href="login.php">login</a>.';
            } else {
                $message = 'Registration failed. Try again.';
            }
        }
        $stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign Up - NIIT School</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="mb-4 text-center">Sign Up</h3>
            <?php if ($message): ?>
              <div class="alert alert-info"> <?= $message ?> </div>
            <?php endif; ?>
            <form method="post" autocomplete="off">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" name="username" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Confirm Password</label>
                <input type="password" name="confirm" class="form-control" required>
              </div>
              <button type="submit" class="btn btn-success w-100">Sign Up</button>
            </form>
            <div class="mt-3 text-center">
              Already have an account? <a href="login.php">Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
