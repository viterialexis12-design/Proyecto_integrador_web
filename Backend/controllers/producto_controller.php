<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

// Seguridad de la SPA
if (!isset($_SESSION['id'])) {
    ob_clean();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Acceso denegado. Inicie sesión."]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/producto.php';

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $productoModel = new Producto($conexion);

    // --- CONSULTAR PRODUCTOS (GET) ---
    if ($metodo === 'GET') {
        // Caso 1: Buscar un producto específico por ID
        if (isset($_GET['id'])) {
            $data = $productoModel->obtenerPorId($_GET['id']);
            ob_clean();
            if ($data) {
                echo json_encode(["status" => "success", "data" => $data]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Producto no encontrado."]);
            }
            exit;
        }

        // Caso 2: Filtrar por alertas de stock crítico (?alerta=1) o traer todo el inventario
        $soloAlerta = isset($_GET['alerta']) && $_GET['alerta'] == '1' ? 1 : 0;
        
        $lista = $productoModel->obtenerTodos($soloAlerta);
        ob_clean();
        echo json_encode(["status" => "success", "data" => $lista]);
        exit;
    }

    // --- REGISTRAR PRODUCTO (POST) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'REGISTRAR') {
        $nombre = $_POST['nombre'] ?? null;
        $precioUnitario = $_POST['precioUnitario'] ?? null;
        $id_categoria = $_POST['id_categoria'] ?? null;

        if (!$nombre || $precioUnitario === null || !$id_categoria) {
            ob_clean();
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios para registrar el producto."]);
            exit;
        }

        $productoModel->nombre = $nombre;
        $productoModel->descripcion = $_POST['descripcion'] ?? null;
        $productoModel->unidadMedida = $_POST['unidadMedida'] ?? 'UNIDAD';
        $productoModel->precioUnitario = $precioUnitario;
        $productoModel->stockActual = $_POST['stockActual'] ?? 0.00;
        $productoModel->id_categoria = $id_categoria;

        if ($productoModel->crear()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Producto guardado con éxito."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudo insertar el producto."]);
        }
        exit;
    }

    // --- EDITAR PRODUCTO (POST) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'EDITAR') {
        $id = $_POST['id'] ?? null;

        if (!$id) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "Falta el ID del producto para aplicar la edición."]);
            exit;
        }

        $productoActual = $productoModel->obtenerPorId($id);
        if (!$productoActual) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "El producto referenciado no existe."]);
            exit;
        }

        $productoModel->id = $id;
        $productoModel->nombre = $_POST['nombre'] ?? $productoActual['nombre'];
        $productoModel->descripcion = $_POST['descripcion'] ?? $productoActual['descripcion'];
        $productoModel->unidadMedida = $_POST['unidadMedida'] ?? $productoActual['unidadMedida'];
        $productoModel->precioUnitario = $_POST['precioUnitario'] ?? $productoActual['precioUnitario'];
        $productoModel->stockActual = $_POST['stockActual'] ?? $productoActual['stockActual'];
        $productoModel->estado = $_POST['estado'] ?? $productoActual['estado'];
        $productoModel->id_categoria = $_POST['id_categoria'] ?? $productoActual['id_categoria'];

        if ($productoModel->actualizar()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Producto modificado con éxito."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudieron guardar las modificaciones."]);
        }
        exit;
    }

    // --- BAJA LÓGICA (POST) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'ELIMINAR') {
        $id = $_POST['id'] ?? null;

        if (!$id) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "ID faltante para desactivación."]);
            exit;
        }

        if ($productoModel->eliminar($id)) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Producto modificado a Inactivo."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudo dar de baja al producto."]);
        }
        exit;
    }

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Fallo de infraestructura en el controlador de productos: " . $e->getMessage()
    ]);
    exit;
}
?>