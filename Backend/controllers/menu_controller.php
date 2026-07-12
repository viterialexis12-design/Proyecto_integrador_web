<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

// Verificación unificada de sesión
if (!isset($_SESSION['id'])) {
    ob_clean();
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Sesión expirada o inválida."
    ]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/menu.php';

try {

    global $conexion;

    $metodo = $_SERVER['REQUEST_METHOD'];
    $menuModel = new Menu($conexion);

    $id_rol = $_SESSION['id_rol'] ?? null;

    // ==========================================================
    // GET
    // ==========================================================
    if ($metodo === 'GET') {

        if (isset($_GET['gestion_crud']) && $_GET['gestion_crud'] === 'true') {

            $listaMenus = $menuModel->obtenerTodos();

            ob_clean();
            echo json_encode([
                "status" => "success",
                "data" => $listaMenus
            ]);
            exit;
        }

        if (!$id_rol) {
            ob_clean();
            echo json_encode([
                "status" => "error",
                "message" => "No se encontró el rol asociado al usuario."
            ]);
            exit;
        }

        $listaMenus = $menuModel->obtenerPorRol($id_rol);
        $nombreRolReal = $menuModel->obtenerRolDeUsuario($_SESSION['id']);

        ob_clean();
        echo json_encode([
            "status" => "success",
            "usuario" => [
                "username" => $_SESSION['username'],
                "id_rol"   => $id_rol,
                "nombre_rol" => $nombreRolReal
            ],
            "menus" => $listaMenus,
            "message" => "Menús cargados correctamente."
        ]);
        exit;
    }

    // ==========================================================
    // POST
    // ==========================================================
    if ($metodo === 'POST') {

        $accion = $_POST['accion'] ?? '';

        // ------------------------------------------------------
        // CREAR
        // ------------------------------------------------------
        if ($accion === 'CREAR') {

            $menuModel->nombre = $_POST['nombre'] ?? null;
            $menuModel->descripcion = $_POST['descripcion'] ?? null;
            $menuModel->url = $_POST['url'] ?? null;
            $menuModel->estado = $_POST['estado'] ?? 1;
            $menuModel->id_menuPadre = !empty($_POST['id_menuPadre'])
                ? $_POST['id_menuPadre']
                : null;

            if (!$menuModel->nombre) {
                ob_clean();
                echo json_encode([
                    "status" => "error",
                    "message" => "El nombre del menú es obligatorio."
                ]);
                exit;
            }

            if ($menuModel->crear()) {

                ob_clean();
                echo json_encode([
                    "status" => "success",
                    "message" => "Menú registrado correctamente."
                ]);

            } else {

                ob_clean();
                echo json_encode([
                    "status" => "error",
                    "message" => "No fue posible registrar el menú."
                ]);
            }

            exit;
        }

        // ------------------------------------------------------
        // EDITAR
        // ------------------------------------------------------
        if ($accion === 'EDITAR') {

            $menuModel->id = $_POST['id'] ?? null;
            $menuModel->nombre = $_POST['nombre'] ?? null;
            $menuModel->descripcion = $_POST['descripcion'] ?? null;
            $menuModel->url = $_POST['url'] ?? null;
            $menuModel->estado = $_POST['estado'] ?? 1;
            $menuModel->id_menuPadre = !empty($_POST['id_menuPadre'])
                ? $_POST['id_menuPadre']
                : null;

            if (!$menuModel->id || !$menuModel->nombre) {

                ob_clean();
                echo json_encode([
                    "status" => "error",
                    "message" => "ID y nombre son obligatorios."
                ]);
                exit;
            }

            if ($menuModel->actualizar()) {

                ob_clean();
                echo json_encode([
                    "status" => "success",
                    "message" => "Menú actualizado correctamente."
                ]);

            } else {

                ob_clean();
                echo json_encode([
                    "status" => "error",
                    "message" => "No fue posible actualizar el menú."
                ]);
            }

            exit;
        }

        // ------------------------------------------------------
        // DESACTIVAR
        // ------------------------------------------------------
        if ($accion === 'DESACTIVAR') {

            $id = $_POST['id'] ?? null;

            if (!$id) {

                ob_clean();
                echo json_encode([
                    "status" => "error",
                    "message" => "Debe indicar el ID del menú."
                ]);
                exit;
            }

            if ($menuModel->desactivarLogico($id)) {

                ob_clean();
                echo json_encode([
                    "status" => "success",
                    "message" => "Menú desactivado correctamente."
                ]);

            } else {

                ob_clean();
                echo json_encode([
                    "status" => "error",
                    "message" => "No fue posible desactivar el menú."
                ]);
            }

            exit;
        }

        ob_clean();
        echo json_encode([
            "status" => "error",
            "message" => "Acción no válida."
        ]);
        exit;
    }

} catch (Exception $e) {

    ob_clean();
    http_response_code(500);

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);

    exit;
}
?>