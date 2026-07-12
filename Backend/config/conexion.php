<?php
$host     = 'localhost';
$db_name  = 'Proyecto_pw1'; 
$username = 'root';        
$password = 'adminadmin'; // <-- Tu contraseña real de AppServ

try {
    // La variable DEBE llamarse $conexion en minúsculas y estar suelta aquí
    $conexion = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error de conexión a la base de datos: " . $e->getMessage());
}
?>