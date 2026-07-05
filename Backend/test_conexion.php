<?php
// Backend/test_conexion.php

// Permitir que el Frontend acceda si levantas los servidores en puertos distintos
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Forzar que mysqli lance excepciones en vez de errores silenciosos
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

require_once __DIR__ . '/config/conexion.php';

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    // Si llegamos aquí, la base de datos respondió bien
    echo json_encode([
        "status" => "success",
        "message" => "Conexión exitosa a la Base de Datos.",
        "server" => $conn->host_info
    ]);

} catch (Exception $e) {
    // Si algo falla (credenciales, servicio apagado, etc.)
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error de conexión: " . $e->getMessage()
    ]);
}