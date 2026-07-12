<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

// Guardián de seguridad (verifica que haya iniciado sesión)
if (!isset($_SESSION['id'])) { // Ajustado si normalizaste el ID en tu sesión de usuario
    ob_clean();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Acceso denegado. Sesión inválida."]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/rol.php';

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $rolModel = new Rol($conexion);

    // ==========================================================================
    // 🖨️ 1. LEER ROLES (GET)
    // ==========================================================================
    if ($metodo === 'GET') {
        $listaRoles = $rolModel->obtenerTodos();
        
        ob_clean();
        echo json_encode([
            "status" => "success",
            "data" => $listaRoles
        ]);
        exit;
    }

    // ==========================================================================
    // 🛠️ 2. OPERACIONES DE ESCRITURA / MODIFICACIÓN (POST)
    // ==========================================================================
    if ($metodo === 'POST') {
        $accion = $_POST['accion'] ?? '';

        // --- CASO A: CREAR NUEVO ROL ---
        if ($accion === 'CREAR') {
            $nombre = $_POST['nombre'] ?? null;
            $descripcion = $_POST['descripcion'] ?? null;

            if (!$nombre) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "El nombre del rol es obligatorio."]);
                exit;
            }

            $rolModel->nombre = $nombre;
            $rolModel->descripcion = $descripcion;

            if ($rolModel->crear()) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "Rol guardado exitosamente."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "No se pudo crear el rol en la base de datos."]);
            }
            exit;
        }

        // --- CASO B: ACTUALIZAR ROL ---
        if ($accion === 'EDITAR') {
            $id = $_POST['id'] ?? null; // Cambiado de id_rol a id
            $nombre = $_POST['nombre'] ?? null;
            $descripcion = $_POST['descripcion'] ?? null;
            $estado = $_POST['estado'] ?? 1;

            if (!$id || !$nombre) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios para la edición."]);
                exit;
            }

            $rolModel->id = $id; // Cambiado asignación de propiedad a ->id
            $rolModel->nombre = $nombre;
            $rolModel->descripcion = $descripcion;
            $rolModel->estado = $estado;

            if ($rolModel->actualizar()) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "Rol modificado correctamente."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "No se pudo actualizar el registro."]);
            }
            exit;
        }

        // --- CASO C: INACTIVAR ROL (BORRADO LÓGICO) ---
        if ($accion === 'DESACTIVAR') {
            $id = $_POST['id'] ?? null; // Cambiado de id_rol a id

            if (!$id) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "ID de rol inválido o inexistente."]);
                exit;
            }

            if ($rolModel->desactivarLogico($id)) { // Pasamos la nueva variable $id
                ob_clean();
                echo json_encode(["status" => "success", "message" => "El rol ha sido inhabilitado correctamente."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Error al intentar cambiar el estado del rol."]);
            }
            exit;
        }

        // Si se envía POST pero no coincide con ninguna acción mapeada
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Acción POST no reconocida."]);
        exit;
    }

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error crítico en el controlador de roles: " . $e->getMessage()
    ]);
    exit;
}
?>