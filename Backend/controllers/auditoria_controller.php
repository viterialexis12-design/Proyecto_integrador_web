<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

// Guardián de sesión unificado
if (!isset($_SESSION['id'])) {
    ob_clean();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Acceso denegado. Sesión inválida o expirada."]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/auditoria.php';

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $auditoriaModel = new Auditoria($conexion);

    // ==========================================================================
    // 📁 CONSULTAR HISTORIAL DE AUDITORÍA (GET)
    // ==========================================================================
    if ($metodo === 'GET') {
        $tabla        = $_GET['tabla'] ?? null;
        $fecha_inicio = $_GET['fecha_inicio'] ?? null;
        $fecha_fin    = $_GET['fecha_fin'] ?? null;

        $datos = $auditoriaModel->obtenerTodos($tabla, $fecha_inicio, $fecha_fin);

        ob_clean();
        echo json_encode([
            "status" => "success",
            "data"   => $datos
        ]);
        exit;
    }

    // Bloqueo de otros métodos no permitidos
    ob_clean();
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método no permitido."]);
    exit;

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Fallo del servidor de auditoría: " . $e->getMessage()
    ]);
    exit;
}
?>