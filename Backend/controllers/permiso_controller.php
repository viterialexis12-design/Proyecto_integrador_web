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
require_once '../models/permiso.php';

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $permisoModel = new Permiso($conexion);

    // ==========================================================================
    // 📁 CONSULTAR ASIGNACIONES DE PERMISOS (GET)
    // ==========================================================================
    if ($metodo === 'GET') {
        $datos = $permisoModel->obtenerTodos();
        ob_clean();
        echo json_encode([
            "status" => "success",
            "data" => $datos
        ]);
        exit;
    }

    // ==========================================================================
    // 🛠️ OPERACIONES DE ESCRITURA (POST)
    // ==========================================================================
    if ($metodo === 'POST') {
        $accion = $_POST['accion'] ?? '';

        // --- ACCIÓN: ASIGNAR MENU A ROL ---
        if ($accion === 'CREAR') {
            $id_rol  = $_POST['id_rol'] ?? null;
            $id_menu = $_POST['id_menu'] ?? null;

            if (!$id_rol || !$id_menu) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "El rol y el menú son campos obligatorios."]);
                exit;
            }

            $permisoModel->id_rol  = $id_rol;
            $permisoModel->id_menu = $id_menu;

            if ($permisoModel->crear()) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "Permiso asignado exitosamente."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "No se pudo crear la asignación. Verifique si el rol ya cuenta con este menú."]);
            }
            exit;
        }

        // --- ACCIÓN: MODIFICAR ASIGNACIÓN ---
        if ($accion === 'EDITAR') {
            $id      = $_POST['id'] ?? null;
            $id_rol  = $_POST['id_rol'] ?? null;
            $id_menu = $_POST['id_menu'] ?? null;

            if (!$id || !$id_rol || !$id_menu) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios para realizar la actualización."]);
                exit;
            }

            $permisoModel->id      = $id;
            $permisoModel->id_rol  = $id_rol;
            $permisoModel->id_menu = $id_menu;

            if ($permisoModel->actualizar()) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "Asignación actualizada con éxito."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "No se pudo actualizar el registro de permisos."]);
            }
            exit;
        }

        // --- ACCIÓN: ELIMINAR VÍNCULO (REVOCAR PERMISO) ---
        if ($accion === 'ELIMINAR' || $accion === 'DESACTIVAR') {
            $id = $_POST['id'] ?? null;

            if (!$id) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "ID de asignación requerido para procesar el borrado."]);
                exit;
            }

            if ($permisoModel->eliminar($id)) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "El acceso ha sido revocado de forma exitosa."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Error al intentar eliminar el permiso."]);
            }
            exit;
        }

        ob_clean();
        echo json_encode(["status" => "error", "message" => "Acción POST desconocida."]);
        exit;
    }

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Fallo del servidor de permisos: " . $e->getMessage()
    ]);
    exit;
}
?>