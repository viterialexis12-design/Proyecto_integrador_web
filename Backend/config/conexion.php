<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host     = 'localhost';
$db_name  = 'Proyecto_pw'; 
$username = 'root';        
$password = 'adminadmin'; 

try {
    $conexion = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    if (isset($_SESSION['id'])) {
        $userId = (int)$_SESSION['id'];
        $conexion->exec("SET @usuario_actual_id = {$userId}");
    }

} catch (PDOException $e) {
    die("Error de conexión a la base de datos: " . $e->getMessage());
}
?>
