<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

// Validación de sesión activa heredada de tu arquitectura
if (!isset($_SESSION['id'])) {
    ob_clean();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Acceso denegado. Sesión inválida."]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/empresa.php'; 

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $empresaModel = new Empresa($conexion);

    // --- PROCESAR PETICIÓN DE LECTURA (GET) ---
   // --- PROCESAR PETICIÓN DE LECTURA (GET) ---
    if ($metodo === 'GET') {
        if (isset($_GET['id'])) {
            $datosEmpresa = $empresaModel->obtenerPorId($_GET['id']);
            ob_clean();
            if ($datosEmpresa) {
                echo json_encode(["status" => "success", "data" => $datosEmpresa]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Empresa no encontrada."]);
            }
            exit;
        } 
        
        // Si no viene ID, asumimos que es el registro único del sistema
        $listaEmpresas = $empresaModel->obtenerTodos();
        ob_clean();
        
        if (!empty($listaEmpresas)) {
            // Extraemos únicamente el primer elemento de la lista [0] para enviar un objeto directo
            echo json_encode([
                "status" => "success",
                "data" => $listaEmpresas[0] 
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "No hay ninguna empresa registrada en el sistema."]);
        }
        exit;
    }

    // --- PROCESAR PETICIÓN DE CREACIÓN (POST) ---
    if ($metodo === 'POST' && (!isset($_POST['accion']) || ($_POST['accion'] !== 'EDITAR' && $_POST['accion'] !== 'ELIMINAR'))) {
        
        $razonSocial           = $_POST['razonSocial'] ?? null;
        $nombreComercial       = $_POST['nombreComercial'] ?? null;
        $ruc                   = $_POST['ruc'] ?? null;
        $dirMatriz             = $_POST['dirMatriz'] ?? null;
        $obligadoContabilidad  = $_POST['obligadoContabilidad'] ?? 'NO';
        $contribuyenteEspecial = $_POST['contribuyenteEspecial'] ?? null;

        // Validación de campos obligatorios según restricción NOT NULL de tu BD
        if (!$razonSocial || !$nombreComercial || !$ruc || !$dirMatriz) {
            ob_clean();
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios para registrar la empresa."]);
            exit;
        }

        $empresaModel->razonSocial           = $razonSocial;
        $empresaModel->nombreComercial       = $nombreComercial;
        $empresaModel->ruc                   = $ruc;
        $empresaModel->dirMatriz             = $dirMatriz;
        $empresaModel->obligadoContabilidad  = $obligadoContabilidad;
        $empresaModel->contribuyenteEspecial = $contribuyenteEspecial;

        exit;
    }

    // --- PROCESAR ACTUALIZACIÓN (EDITAR) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'EDITAR') {
        
        $id = $_POST['id'] ?? null;
        if (!$id) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "ID de empresa requerido para la actualización."]);
            exit;
        }

        $empresaActual = $empresaModel->obtenerPorId($id);
        if (!$empresaActual) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "La empresa que intenta editar no existe."]);
            exit;
        }
        
        $empresaModel->id                    = $id;
        $empresaModel->razonSocial           = $_POST['razonSocial'] ?? $empresaActual['razonSocial'];
        $empresaModel->nombreComercial       = $_POST['nombreComercial'] ?? $empresaActual['nombreComercial'];
        $empresaModel->ruc                   = $_POST['ruc'] ?? $empresaActual['ruc'];
        $empresaModel->dirMatriz             = $_POST['dirMatriz'] ?? $empresaActual['dirMatriz'];
        $empresaModel->obligadoContabilidad  = $_POST['obligadoContabilidad'] ?? $empresaActual['obligadoContabilidad'];
        $empresaModel->contribuyenteEspecial = $_POST['contribuyenteEspecial'] ?? $empresaActual['contribuyenteEspecial'];

        if ($empresaModel->actualizar()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Datos de la empresa actualizados correctamente."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudieron guardar los cambios de la empresa."]);
        }
        exit;
    }

    // --- PROCESAR ELIMINACIÓN ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'ELIMINAR') {
        $id = $_POST['id'] ?? null;

        if (!$id) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "ID de empresa inválido."]);
            exit;
        }
        exit;
    }

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error interno en el controlador de empresas: " . $e->getMessage()
    ]);
    exit;
}
?>