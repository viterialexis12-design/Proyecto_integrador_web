<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

// Validación de sesión de tu arquitectura
if (!isset($_SESSION['id'])) {
    ob_clean();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Acceso denegado. Sesión inválida."]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/puntoEmision.php'; 

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $puntoModel = new PuntoEmision($conexion);

    // --- PROCESAR PETICIÓN DE LECTURA (GET) ---
    if ($metodo === 'GET') {
        if (isset($_GET['id'])) {
            $datosPunto = $puntoModel->obtenerPorId($_GET['id']);
            ob_clean();
            if ($datosPunto) {
                echo json_encode(["status" => "success", "data" => $datosPunto]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Punto de emisión no encontrado."]);
            }
            exit;
        } 
        
        // Si no viene ID, retornamos el listado completo
        $listaPuntos = $puntoModel->obtenerTodos();
        ob_clean();
        echo json_encode(["status" => "success", "data" => $listaPuntos]);
        exit;
    }

    // --- PROCESAR PETICIÓN DE CREACIÓN (REGISTRAR) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'REGISTRAR') {
        
        $nombre      = $_POST['nombre'] ?? null;
        $codigoSRI   = $_POST['codigoSRI'] ?? null;
        $secuencial  = $_POST['secuencial'] ?? 1;
        $estado      = $_POST['estado'] ?? 1;
        $id_empresa  = $_POST['id_empresa'] ?? null;
        $id_usuario  = $_POST['id_usuario'] ?? null;

        // Validación estricta de campos obligatorios NOT NULL
        if (!$nombre || !$codigoSRI || !$id_empresa) {
            ob_clean();
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios (nombre, código SRI o Empresa)."]);
            exit;
        }

        $puntoModel->nombre      = $nombre;
        $puntoModel->codigoSRI   = $codigoSRI;
        $puntoModel->secuencial  = $secuencial;
        $puntoModel->estado      = $estado;
        $puntoModel->id_empresa  = $id_empresa;
        $puntoModel->id_usuario  = $id_usuario;

        if ($puntoModel->crear()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Punto de emisión registrado exitosamente."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudo registrar el punto de emisión."]);
        }
        exit;
    }

    // --- PROCESAR ACTUALIZACIÓN (EDITAR) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'EDITAR') {
        
        $id = $_POST['id'] ?? null;
        if (!$id) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "ID requerido para la actualización."]);
            exit;
        }

        $puntoActual = $puntoModel->obtenerPorId($id);
        if (!$puntoActual) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "El punto de emisión que intenta editar no existe."]);
            exit;
        }
        
        $puntoModel->id          = $id;
        $puntoModel->nombre      = $_POST['nombre'] ?? $puntoActual['nombre'];
        $puntoModel->codigoSRI   = $_POST['codigoSRI'] ?? $puntoActual['codigoSRI'];
        $puntoModel->secuencial  = $_POST['secuencial'] ?? $puntoActual['secuencial'];
        $puntoModel->estado      = $_POST['estado'] ?? $puntoActual['estado'];
        $puntoModel->id_empresa  = $_POST['id_empresa'] ?? $puntoActual['id_empresa'];
        $puntoModel->id_usuario  = $_POST['id_usuario'] ?? $puntoActual['id_usuario'];

        if ($puntoModel->actualizar()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Punto de emisión actualizado correctamente."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudieron guardar los cambios del punto de emisión."]);
        }
        exit;
    }

    // --- PROCESAR ELIMINACIÓN (ELIMINAR) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'ELIMINAR') {
        $id = $_POST['id'] ?? null;

        if (!$id) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "ID de punto de emisión inválido."]);
            exit;
        }

        if ($puntoModel->eliminar($id)) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Punto de emisión eliminado del sistema."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "Error al intentar eliminar el punto de emisión."]);
        }
        exit;
    }

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error interno en el controlador de puntos de emisión: " . $e->getMessage()
    ]);
    exit;
}
?>