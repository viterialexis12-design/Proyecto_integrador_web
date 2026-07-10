<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

// Guardián de sesión activo
if (!isset($_SESSION['id_usuario'])) {
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
    // 📁 CONSULTAR PERMISOS (GET)
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

        // --- ACCIÓN: REGISTRAR ---
        if ($accion === 'CREAR') {
            $nombre      = $_POST['nombre_permiso'] ?? null;
            $descripcion = $_POST['descripcion'] ?? null;
            $codigo_menu = $_POST['codigo_menu'] ?? null;

            if (!$nombre || !$codigo_menu) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "El nombre del permiso y el menú contenedor son obligatorios."]);
                exit;
            }

            $permisoModel->nombre_permiso = $nombre;
            $permisoModel->descripcion    = $descripcion;
            $permisoModel->codigo_menu    = $codigo_menu;

            if ($permisoModel->crear()) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "Permiso registrado exitosamente."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Error interno al guardar el permiso en el sistema."]);
            }
            exit;
        }

        // --- ACCIÓN: MODIFICAR ---
        if ($accion === 'EDITAR') {
            $id_permiso    = $_POST['id_permiso'] ?? null;
            $nombre        = $_POST['nombre_permiso'] ?? null;
            $descripcion   = $_POST['descripcion'] ?? null;
            $codigo_menu   = $_POST['codigo_menu'] ?? null;
            $estado        = $_POST['estado'] ?? 1;

            if (!$id_permiso || !$nombre || !$codigo_menu) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios para realizar la actualización."]);
                exit;
            }

            $permisoModel->id_permiso     = $id_permiso;
            $permisoModel->nombre_permiso = $nombre;
            $permisoModel->descripcion    = $descripcion;
            $permisoModel->codigo_menu    = $codigo_menu;
            $permisoModel->estado         = $estado;

            if ($permisoModel->actualizar()) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "Permiso actualizado con éxito."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "No se pudieron registrar las modificaciones."]);
            }
            exit;
        }

        // --- ACCIÓN: INACTIVAR ---
        if ($accion === 'DESACTIVAR') {
            $id_permiso = $_POST['id_permiso'] ?? null;

            if (!$id_permiso) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "ID del permiso requerido para la baja."]);
                exit;
            }

            if ($permisoModel->desactivarLogico($id_permiso)) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "El permiso ha sido marcado como inactivo (0)."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Error al intentar cambiar el estado del permiso."]);
            }
            exit;
        }

        // Si la acción no coincide con ninguna declarada
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