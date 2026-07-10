<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Si NO existe la sesión, mandamos un código 401 y cortamos la ejecución
if (!isset($_SESSION['id_usuario'])) {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Sesión expirada o inexistente."
    ]);
    exit;
}

// 🚫 ELIMINAMOS EL ECHO DE ÉXITO QUE ESTABA AQUÍ
// De esta manera, cualquier controlador puede hacer un "require_once" de este archivo
// para proteger la ruta sin que se ensucie o se duplique la salida JSON.
?>