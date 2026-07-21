<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

// Verificación de sesión de la SPA
if (!isset($_SESSION['id'])) {
    ob_clean();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Acceso denegado. Sesión no válida."]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/clientes.php';

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $clienteModel = new Clientes($conexion);

    // --- ACCIÓN DE LECTURA (GET) ---
    if ($metodo === 'GET') {
        if (isset($_GET['id'])) {
            $dataCliente = $clienteModel->obtenerPorId($_GET['id']);
            ob_clean();
            if ($dataCliente) {
                echo json_encode(["status" => "success", "data" => $dataCliente]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Cliente no encontrado."]);
            }
            exit;
        }

        $listaClientes = $clienteModel->obtenerTodos();
        ob_clean();
        echo json_encode(["status" => "success", "data" => $listaClientes]);
        exit;
    }

    // --- ACCIÓN DE CREACIÓN (REGISTRAR) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'REGISTRAR') {
        
        $nombre1            = $_POST['nombre1'] ?? null;
        $apellido1          = $_POST['apellido1'] ?? null;
        $identificacion     = $_POST['identificacion'] ?? null;
        $tipoIdentificacion = $_POST['tipoIdentificacion'] ?? null;

        // Validar obligatorios según restricciones NOT NULL
        if (!$nombre1 || !$apellido1 || !$identificacion || !$tipoIdentificacion) {
            ob_clean();
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios de identificación o nombres."]);
            exit;
        }

        $clienteModel->nombre1            = $nombre1;
        $clienteModel->nombre2            = $_POST['nombre2'] ?? null;
        $clienteModel->apellido1          = $apellido1;
        $clienteModel->apellido2          = $_POST['apellido2'] ?? null;
        $clienteModel->identificacion     = $identificacion;
        $clienteModel->tipoIdentificacion = $tipoIdentificacion;
        $clienteModel->correo             = $_POST['correo'] ?? null;
        $clienteModel->direccion          = $_POST['direccion'] ?? null;
        $clienteModel->telefono           = $_POST['telefono'] ?? null;

        if ($clienteModel->crear()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Cliente registrado con éxito."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudo registrar al cliente."]);
        }
        exit;
    }

    // --- ACCIÓN DE ACTUALIZACIÓN (EDITAR) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'EDITAR') {
        $id = $_POST['id'] ?? null;

        if (!$id) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "ID del cliente requerido para la edición."]);
            exit;
        }

        $clienteActual = $clienteModel->obtenerPorId($id);
        if (!$clienteActual) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "El cliente no existe en la base de datos."]);
            exit;
        }

        $clienteModel->id                 = $id;
        $clienteModel->nombre1            = $_POST['nombre1'] ?? $clienteActual['nombre1'];
        $clienteModel->nombre2            = $_POST['nombre2'] ?? $clienteActual['nombre2'];
        $clienteModel->apellido1          = $_POST['apellido1'] ?? $clienteActual['apellido1'];
        $clienteModel->apellido2          = $_POST['apellido2'] ?? $clienteActual['apellido2'];
        $clienteModel->identificacion     = $_POST['identificacion'] ?? $clienteActual['identificacion'];
        $clienteModel->tipoIdentificacion = $_POST['tipoIdentificacion'] ?? $clienteActual['tipoIdentificacion'];
        $clienteModel->correo             = $_POST['correo'] ?? $clienteActual['correo'];
        $clienteModel->direccion          = $_POST['direccion'] ?? $clienteActual['direccion'];
        $clienteModel->telefono           = $_POST['telefono'] ?? $clienteActual['telefono'];
        $clienteModel->estado             = $_POST['estado'] ?? $clienteActual['estado'];

        if ($clienteModel->actualizar()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Información del cliente actualizada."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se guardaron cambios en el cliente."]);
        }
        exit;
    }

    // --- ACCIÓN DE ELIMINACIÓN LÓGICA (ELIMINAR) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'ELIMINAR') {
        $id = $_POST['id'] ?? null;

        if (!$id) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "ID de cliente inválido."]);
            exit;
        }

        if ($clienteModel->eliminar($id)) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Cliente dado de baja correctamente."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "Error al desactivar el cliente."]);
        }
        exit;
    }

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error interno en el controlador de clientes: " . $e->getMessage()
    ]);
    exit;
}
?>