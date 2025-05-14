<?php
// logout.php - Log out user and destroy session
session_start();
session_unset();
session_destroy();
header('Location: login.php');
exit;
?>
