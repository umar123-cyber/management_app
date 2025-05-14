<?php
// login.php - User login
session_start();
require 'db.php';
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    if (!$email || !$password) {
        $message = 'All fields are required.';
    } else {
        $stmt = $conn->prepare('SELECT id, username, password FROM users WHERE email = ?');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows === 1) {
            $stmt->bind_result($id, $username, $hash);
            $stmt->fetch();
            if (password_verify($password, $hash)) {
                $_SESSION['user_id'] = $id;
                $_SESSION['username'] = $username;
                header('Location: dashboard.php');
                exit;
            } else {
                $message = 'Incorrect password.';
            }
        } else {
            $message = 'No user found with that email.';
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
  <title>Login - NIIT School</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="mb-4 text-center">Login</h3>
            <?php if ($message): ?>
              <div class="alert alert-danger"> <?= $message ?> </div>
            <?php endif; ?>
            <form method="post" autocomplete="off">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" required>
              </div>
              <button type="submit" class="btn btn-success w-100">Login</button>
            </form>
            <div class="mt-3 text-center">
              Don't have an account? <a href="signup.php">Sign Up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
