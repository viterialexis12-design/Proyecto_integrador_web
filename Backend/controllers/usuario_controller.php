<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

// 1. Guardián de seguridad silencioso
if (!isset($_SESSION['id_usuario'])) {
    ob_clean();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Acceso denegado. Sesión inválida."]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/usuario.php'; 

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $usuarioModel = new Usuario($conexion);

    // 2. PROCESAR PETICIÓN DE LECTURA (GET)
    if ($metodo === 'GET') {
        
        // Si viene un ID específico por URL (para editar o ver detalle)
        if (isset($_GET['id'])) {
            $datosUsuario = $usuarioModel->obtenerPorId($_GET['id']);
            ob_clean();
            echo json_encode(["status" => "success", "data" => $datosUsuario]);
            exit;
        } 
        
        // Si no viene ID, devolvemos la lista completa para la tabla
        $listaUsuarios = $usuarioModel->obtenerTodos();
        
        ob_clean();
        echo json_encode([
            "status" => "success",
            "data" => $listaUsuarios
        ]);
        exit;
    }

    // 3. PROCESAR PETICIÓN DE CREACIÓN (POST)
    if ($metodo === 'POST') {
        
        // Capturar los campos enviados desde el formulario
        $nombre1       = $_POST['nombre1'] ?? null;
        $nombre2       = $_POST['nombre2'] ?? null;
        $apellido1     = $_POST['apellido1'] ?? null;
        $apellido2     = $_POST['apellido2'] ?? null;
        $cedula        = $_POST['cedula'] ?? null;
        $fecha_nac     = $_POST['fecha_nacimiento'] ?? null;
        $telefono      = $_POST['telefono'] ?? null;
        $correo        = $_POST['correo'] ?? null;
        $username      = $_POST['username'] ?? null;
        $clave_limpia  = $_POST['clave'] ?? null;
        $id_rol        = $_POST['id_rol'] ?? null;
        $estado        = $_POST['estado'] ?? 'A';

        // Validaciones básicas de campos obligatorios
        if (!$nombre1 || !$apellido1 || !$cedula || !$correo || !$username || !$clave_limpia || !$id_rol) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios."]);
            exit;
        }

        // 🔥 APLICAMOS EL HASH BCRYPT (IDÉNTICO A TU SCRIPT DE ADMIN)
        $clave_hasheada = password_hash($clave_limpia, PASSWORD_BCRYPT);

        // Mapeamos los datos al objeto del modelo
        $usuarioModel->nombre1 = $nombre1;
        $usuarioModel->nombre2 = $nombre2;
        $usuarioModel->apellido1 = $apellido1;
        $usuarioModel->apellido2 = $apellido2;
        $usuarioModel->cedula = $cedula;
        $usuarioModel->fecha_nacimiento = !empty($fecha_nac) ? $fecha_nac : null;
        $usuarioModel->telefono = $telefono;
        $usuarioModel->correo = $correo;
        $usuarioModel->username = $username;
        $usuarioModel->clave = $clave_hasheada; // 🔐 Guardamos el hash de 60 caracteres
        $usuarioModel->id_rol = $id_rol;
        $usuarioModel->estado = $estado;

        // Intentar registrar en la Base de Datos
        if ($usuarioModel->crear()) {
            ob_clean();
            echo json_encode([
                "status" => "success", 
                "message" => "Usuario registrado correctamente con encriptación Bcrypt."
            ]);
        } else {
            ob_clean();
            echo json_encode([
                "status" => "error", 
                "message" => "No se pudo registrar el usuario en el sistema."
            ]);
        }
        exit;
    }

    $metodo = $_SERVER['REQUEST_METHOD'];
    $usuarioModel = new Usuario($conexion);

    // --- PROCESAR ACTUALIZACIÓN (MÉTODO POST O PUT) ---
    // Nota: Como enviamos FormData desde JS, usaremos POST simulando actualización
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'EDITAR') {
        
        $id_usuario = $_POST['id_usuario'] ?? null;
        if (!$id_usuario) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "ID de usuario requerido."]);
            exit;
        }

        // Cargar datos actuales para no perder la clave si viene vacía
        $usuarioActual = $usuarioModel->obtenerPorId($id_usuario);
        
        $usuarioModel->id_usuario = $id_usuario;
        $usuarioModel->nombre1   = $_POST['nombre1'] ?? '';
        $usuarioModel->nombre2   = $_POST['nombre2'] ?? null;
        $usuarioModel->apellido1 = $_POST['apellido1'] ?? '';
        $usuarioModel->apellido2 = $_POST['apellido2'] ?? null;
        $usuarioModel->cedula    = $_POST['cedula'] ?? '';
        $usuarioModel->correo    = $_POST['correo'] ?? '';
        $usuarioModel->username  = $_POST['username'] ?? '';
        $usuarioModel->id_rol    = $_POST['id_rol'] ?? null;
        $usuarioModel->estado    = $_POST['estado'] ?? 'A';
        $usuarioModel->fecha_nacimiento = !empty($_POST['fecha_nacimiento']) ? $_POST['fecha_nacimiento'] : null;
        $usuarioModel->telefono  = $_POST['telefono'] ?? null;

        // 🔥 Validar contraseña: si el usuario escribió algo, se hashea con Bcrypt. Si no, se deja la actual.
        if (!empty($_POST['clave'])) {
            $usuarioModel->clave = password_hash($_POST['clave'], PASSWORD_BCRYPT);
        } else {
            $usuarioModel->clave = $usuarioActual['clave']; 
        }

        if ($usuarioModel->actualizar()) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Usuario actualizado con éxito."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudo actualizar el usuario."]);
        }
        exit;
    }

    // --- PROCESAR DESACTIVACIÓN LÓGICA (BORRAR) ---
    if ($metodo === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'DESACTIVAR') {
        $id_usuario = $_POST['id_usuario'] ?? null;

        if (!$id_usuario) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "ID de usuario inválido."]);
            exit;
        }

        // Ejecutar el cambio de estado en el modelo
        if ($usuarioModel->desactivarLogico($id_usuario)) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Usuario desactivado del sistema correctamente."]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "No se pudo cambiar el estado del usuario."]);
        }
        exit;
    }

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error en el controlador de usuarios: " . $e->getMessage()
    ]);
    exit;
}
?>