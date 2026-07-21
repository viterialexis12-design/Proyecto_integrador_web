<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

if (!isset($_SESSION['id'])) {
    ob_clean();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Sesión inválida. Acceso denegado."]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/movimiento.php';

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $movimientoModel = new Movimiento($conexion);

    // --- NUEVA ACCIÓN: LISTAR AUDITORÍA DE INVENTARIO (GET) ---
    if ($metodo === 'GET' && isset($_GET['accion']) && $_GET['accion'] === 'LISTAR_AUDITORIA') {
        // Capturar filtros opcionales limpiamente sin espacios raros
        $fecha_inicio = !empty($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : null;
        $fecha_fin = !empty($_GET['fecha_fin']) ? $_GET['fecha_fin'] : null;
        $tipo = !empty($_GET['tipo']) ? $_GET['tipo'] : null;

        // Llamada al método corregido
        $datos = $movimientoModel->obtenerAuditoria($fecha_inicio, $fecha_fin, $tipo);

        ob_clean();
        if ($datos !== false) {
            echo json_encode([
                "status" => "success",
                "data" => $datos
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "No se pudo recuperar el historial de auditoría."
            ]);
        }
        exit;
    }

    // --- ACCIÓN EXISTENTE: INGRESAR MERCADERÍA (POST) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'INGRESAR_MERCADERIA') {
        $id_producto = $_POST['id_producto'] ?? null;
        $cantidad = $_POST['cantidad'] ?? null;

        if (!$id_producto || $cantidad === null || $cantidad <= 0) {
            ob_clean();
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "El producto y una cantidad mayor a cero son obligatorios."]);
            exit;
        }

        $movimientoModel->id_producto = $id_producto;
        $movimientoModel->cantidad = $cantidad;
        $movimientoModel->nombreProveedor = $_POST['nombreProveedor'] ?? null;
        $movimientoModel->observacion = $_POST['observacion'] ?? null;
        $movimientoModel->id_usuario = $_SESSION['id']; // Usuario auditor desde la sesión

        if ($movimientoModel->registrarIngreso()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Ingreso procesado. El stock se actualizó mediante trigger."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudo registrar el movimiento en la base de datos."]);
        }
        exit;
    }

    // --- ACCIÓN EXISTENTE: REGISTRAR EGRESO (POST) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'REGISTRAR_EGRESO') {
        $id_producto = $_POST['id_producto'] ?? null;
        $cantidad = $_POST['cantidad'] ?? null;

        if (!$id_producto || $cantidad === null || $cantidad <= 0) {
            ob_clean();
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "El producto y una cantidad válida son requeridos."]);
            exit;
        }

        $movimientoModel->id_producto = $id_producto;
        $movimientoModel->cantidad = $cantidad;
        $movimientoModel->observacion = $_POST['observacion'] ?? null;
        $movimientoModel->id_usuario = $_SESSION['id']; // Auditoría

        if ($movimientoModel->registrarEgreso()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Egreso registrado. El stock disminuyó mediante el trigger."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudo procesar el egreso en el sistema."]);
        }
        exit;
    }

    // Si no entra en ningún if válido
    ob_clean();
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Acción o método HTTP no permitido."]);
    exit;

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error interno en el controlador de movimientos: " . $e->getMessage()
    ]);
    exit;
}
?>