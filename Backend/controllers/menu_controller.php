<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

if (!isset($_SESSION['id_usuario'])) {
    ob_clean();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Sesión expirada."]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/menu.php';

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $menuModel = new Menu($conexion);
    $id_rol = $_SESSION['id_rol'] ?? null;

    // ==========================================================================
    // 📁 LEER DATOS (GET)
    // ==========================================================================
    if ($metodo === 'GET') {
        // Distinguimos: ¿Es el CRUD pidiendo todos los menús, o es el Sidebar?
        if (isset($_GET['gestion_crud']) && $_GET['gestion_crud'] === 'true') {
            // Petición desde la pantalla de Administración de Menús
            $listaMenus = $menuModel->obtenerTodos();
            ob_clean();
            echo json_encode([
                "status" => "success",
                "data" => $listaMenus
            ]);
        } else {
            // 🔥 Petición normal del Sidebar: Mantiene tu lógica original con username intacto
            if (!$id_rol) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "No se encontró el rol del usuario."]);
                exit;
            }
            
            $listaMenus = $menuModel->obtenerPorRol($id_rol);
            ob_clean();
            echo json_encode([
                "status" => "success",
                "usuario" => [
                    "username" => $_SESSION['username'],
                    "id_rol"   => $id_rol
                ],
                "menus" => $listaMenus,
                "message" => "Menús y permisos cargados correctamente."
            ]);
        }
        exit;
    }

    // ==========================================================================
    // 🛠️ ACCIONES DE EDICIÓN / ESCRITURA (POST)
    // ==========================================================================
    if ($metodo === 'POST') {
        $accion = $_POST['accion'] ?? '';

        if ($accion === 'CREAR') {
            $menuModel->nombre = $_POST['nombre'] ?? null;
            $menuModel->descripcion = $_POST['descripcion'] ?? null;
            $menuModel->id_rol = $_POST['id_rol'] ?? null;

            if (!$menuModel->nombre || !$menuModel->id_rol) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Nombre y Rol son obligatorios."]);
                exit;
            }

            if ($menuModel->crear()) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "Menú guardado correctamente."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Error al guardar el menú."]);
            }
            exit;
        }

        if ($accion === 'EDITAR') {
            $menuModel->codigo_menu = $_POST['codigo_menu'] ?? null;
            $menuModel->nombre = $_POST['nombre'] ?? null;
            $menuModel->descripcion = $_POST['descripcion'] ?? null;
            $menuModel->id_rol = $_POST['id_rol'] ?? null;
            $menuModel->estado = $_POST['estado'] ?? 1;

            if (!$menuModel->codigo_menu || !$menuModel->nombre || !$menuModel->id_rol) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Faltan parámetros obligatorios."]);
                exit;
            }

            if ($menuModel->actualizar()) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "Menú actualizado correctamente."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "No se pudieron guardar los cambios."]);
            }
            exit;
        }

        if ($accion === 'DESACTIVAR') {
            $codigo_menu = $_POST['codigo_menu'] ?? null;
            if (!$codigo_menu) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Código de menú requerido."]);
                exit;
            }

            if ($menuModel->desactivarLogico($codigo_menu)) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "Menú inhabilitado (estado 0)."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "No se pudo cambiar el estado."]);
            }
            exit;
        }
    }

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    exit;
}
?>