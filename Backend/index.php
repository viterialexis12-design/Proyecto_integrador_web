<?php
// Backend/index.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config/conexion.php';
require_once 'controllers/AuthController.php';

// Capturar la acción que envía el frontend (ej: index.php?action=login)
$action = $_GET['action'] ?? '';

$authController = new AuthController();

switch ($action) {
    case 'login':
        $authController->login();
        break;
    case 'logout':
        $authController->logout();
        break;
    default:
        http_response_code(404);
        echo json_encode(["message" => "Ruta no encontrada."]);
        break;
}