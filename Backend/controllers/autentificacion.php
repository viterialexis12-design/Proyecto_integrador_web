<?php
// Forzar a PHP a mostrar errores en el Preview de F12 en caso de fallo
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

// Incluir la conexión PDO a la base de datos
require_once '../config/conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

// LEER Y DECODIFICAR EL JSON (Versión limpia y corregida)
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Por favor, llene todos los campos"]);
    exit;
}

try {
    // Buscar al usuario en la base de datos
    $stmt = $conexion->prepare("SELECT id, username, clave, estado, id_rol FROM usuario WHERE username = :username LIMIT 1");
    $stmt->execute([':username' => $username]);
    $usuario = $stmt->fetch();

    if ($usuario) {
        if ((int)$usuario['estado'] !== 1) {
            echo json_encode(["status" => "error", "message" => "El usuario se encuentra inactivo."]);
            exit;
        }

        // Verificar la contraseña con Bcrypt
        if (password_verify($password, $usuario['clave'])) {
            
            $_SESSION['id'] = $usuario['id'];
            $_SESSION['username']   = $usuario['username'];
            $_SESSION['id_rol']     = $usuario['id_rol'];
            
            echo json_encode([
                "status" => "success", 
                "message" => "¡Autenticación exitosa! Redirigiendo...",
                "redirect" => "principal" 
            ]);
            exit;
        }
    }

    echo json_encode(["status" => "error", "message" => "Usuario o contraseña incorrectos."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error en el servidor: " . $e->getMessage()]);
}
?>