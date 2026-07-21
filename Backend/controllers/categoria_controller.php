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
    echo json_encode(["status" => "error", "message" => "Acceso denegado. Sesión inválida."]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/categoria.php';

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $categoriaModel = new Categoria($conexion);

    // --- ACCIÓN DE CONSULTA (GET) ---
    if ($metodo === 'GET') {
        if (isset($_GET['id'])) {
            $data = $categoriaModel->obtenerPorId($_GET['id']);
            ob_clean();
            if ($data) {
                echo json_encode(["status" => "success", "data" => $data]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Categoría no encontrada."]);
            }
            exit;
        }

        $lista = $categoriaModel->obtenerTodos();
        ob_clean();
        echo json_encode(["status" => "success", "data" => $lista]);
        exit;
    }

    // --- ACCIÓN DE CREACIÓN (REGISTRAR) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'REGISTRAR') {
        $nombre = $_POST['nombre'] ?? null;
        $id_ivaSRI = $_POST['id_ivaSRI'] ?? null;

        if (!$nombre || !$id_ivaSRI) {
            ob_clean();
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "El nombre y el ID de IVA SRI son campos obligatorios."]);
            exit;
        }

        $categoriaModel->nombre = $nombre;
        $categoriaModel->descripcion = $_POST['descripcion'] ?? null;
        $categoriaModel->id_ivaSRI = $id_ivaSRI;

        if ($categoriaModel->crear()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Categoría creada con éxito."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudo crear la categoría."]);
        }
        exit;
    }

    // --- ACCIÓN DE ACTUALIZACIÓN (EDITAR) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'EDITAR') {
        $id = $_POST['id'] ?? null;

        if (!$id) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "ID de categoría requerido para proceder."]);
            exit;
        }

        $categoriaActual = $categoriaModel->obtenerPorId($id);
        if (!$categoriaActual) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "La categoría no existe."]);
            exit;
        }

        $categoriaModel->id = $id;
        $categoriaModel->nombre = $_POST['nombre'] ?? $categoriaActual['nombre'];
        $categoriaModel->descripcion = $_POST['descripcion'] ?? $categoriaActual['descripcion'];
        $categoriaModel->estado = $_POST['estado'] ?? $categoriaActual['estado'];
        $categoriaModel->id_ivaSRI = $_POST['id_ivaSRI'] ?? $categoriaActual['id_ivaSRI'];

        if ($categoriaModel->actualizar()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Categoría actualizada con éxito."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se detectaron cambios para guardar."]);
        }
        exit;
    }

    // --- ACCIÓN DE ELIMINACIÓN LÓGICA (ELIMINAR) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'ELIMINAR') {
        $id = $_POST['id'] ?? null;

        if (!$id) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "ID no válido para dar de baja."]);
            exit;
        }

        if ($categoriaModel->eliminar($id)) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Categoría dada de baja de forma lógica."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "Error al desactivar la categoría."]);
        }
        exit;
    }

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error interno en el controlador de categorías: " . $e->getMessage()
    ]);
    exit;
}
?>