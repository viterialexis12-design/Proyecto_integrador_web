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
        if (isset($_GET['id_rol_matriz'])) {
            // Caso 1: Alimentar la matriz de Checkboxes para Edición (Devuelve activos e inactivos cruzados)
            $id_rol = intval($_GET['id_rol_matriz']);
            $datos = $permisoModel->obtenerMatrizPorRol($id_rol);
        } else if (isset($_GET['id_rol'])) {
            // Caso 2: Visualizar SOLO los accesos que el rol tiene admitidos actualmente
            $id_rol = intval($_GET['id_rol']);
            $matrizCompleta = $permisoModel->obtenerMatrizPorRol($id_rol);
            
            // Filtramos en caliente para enviar únicamente donde 'tiene_permiso' sea 1
            $datos = array_values(array_filter($matrizCompleta, function($item) {
                return intval($item['tiene_permiso']) === 1;
            }));
        } else {
            // Comportamiento global por defecto
            $datos = $permisoModel->obtenerTodos();
        }

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

        // --- NUEVA ACCIÓN: GUARDAR MATRIZ COMPLETA ---
        // --- ACCIÓN: GUARDAR MATRIZ COMPLETA ---
// --- ACCIÓN: GUARDAR MATRIZ COMPLETA ---
        if ($accion === 'GUARDAR_MATRIZ') {
            $id_rol = intval($_POST['id_rol'] ?? 0);
            $menus_seleccionados = $_POST['menus'] ?? []; 

            if (!$id_rol) {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "El ID de rol es requerido."]);
                exit;
            }

            // 🔥 REGLA DE PROTECCIÓN EN BACKEND
            if ($id_rol === 1) {
                $ids_vitales = [4, 18, 20];
                foreach ($ids_vitales as $id_vital) {
                    if (!in_array($id_vital, $menus_seleccionados)) {
                        $menus_seleccionados[] = $id_vital;
                    }
                }
            }

            // Llamamos directamente al modelo que ahora gestiona la transacción en la BD
            if ($permisoModel->guardarMatriz($id_rol, $menus_seleccionados)) {
                ob_clean();
                echo json_encode(["status" => "success", "message" => "Matriz de permisos actualizada exitosamente."]);
            } else {
                ob_clean();
                echo json_encode(["status" => "error", "message" => "No se pudo actualizar la matriz de permisos."]);
            }
            exit;
    try {
        $conexion->beginTransaction();
        
        // (El resto de tu lógica para hacer DELETE e INSERT individuales se queda exactamente igual...)

                // 1. Limpiamos todos los permisos vigentes que tenga asignados ese rol
                $queryDelete = "DELETE FROM permiso WHERE id_rol = :id_rol";
                $stmtDel = $conexion->prepare($queryDelete);
                $stmtDel->bindValue(':id_rol', intval($id_rol), PDO::PARAM_INT);
                $stmtDel->execute();

                // 2. Insertamos únicamente los menús/submenús que se quedaron marcados
                if (!empty($menus_seleccionados)) {
                    $queryInsert = "INSERT INTO permiso (id_rol, id_menu) VALUES (:id_rol, :id_menu)";
                    $stmtIns = $conexion->prepare($queryInsert);

                    foreach ($menus_seleccionados as $id_menu) {
                        $stmtIns->bindValue(':id_rol', intval($id_rol), PDO::PARAM_INT);
                        $stmtIns->bindValue(':id_menu', intval($id_menu), PDO::PARAM_INT);
                        $stmtIns->execute();
                    }
                }

                $conexion->commit();
                ob_clean();
                echo json_encode(["status" => "success", "message" => "Matriz de permisos actualizada exitosamente."]);

            } catch (Exception $txEx) {
                $conexion->rollBack(); // Si algo falla en el bucle, revierte todo el cambio
                ob_clean();
                echo json_encode(["status" => "error", "message" => "Error transaccional: " . $txEx->getMessage()]);
            }
            exit;
        }

        // --- ACCIÓN: ASIGNAR MENU A ROL (INDIVIDUAL VIEJO) ---
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
                echo json_encode(["status" => "error", "message" => "No se pudo crear la asignación."]);
            }
            exit;
        }

        // --- ACCIÓN: MODIFICAR ASIGNACIÓN (INDIVIDUAL VIEJO) ---
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

        // --- ACCIÓN: ELIMINAR VÍNCULO (INDIVIDUAL VIEJO) ---
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