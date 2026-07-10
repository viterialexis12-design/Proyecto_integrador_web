<?php
header('Content-Type: application/json');

try {
    
    require_once 'conexion.php';
    
    
    echo json_encode([
        "status" => "success",
        "message" => "Conectado correctamente"
    ]);
} catch (Exception $e) {
    // Si falla, capturamos el error
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error de conexión"
    ]);
}
?>