<?php
ob_start();
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: application/json; charset=UTF-8');

if (!isset($_SESSION['id'])) {
    ob_clean();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Acceso no autorizado."]);
    exit;
}

require_once '../config/conexion.php';
require_once '../models/factura.php';

try {
    global $conexion;
    $metodo = $_SERVER['REQUEST_METHOD'];
    $id_usuario_sesion = $_SESSION['id'];

    // 🔒 CAPA DE SEGURIDAD INTERNA: Verificar si el usuario tiene punto de emisión asignado
    $queryPunto = "SELECT id, nombre, codigoSRI FROM puntoEmision WHERE id_usuario = :id_usuario AND estado = 1 LIMIT 1";
    $stmtPunto = $conexion->prepare($queryPunto);
    $stmtPunto->bindParam(":id_usuario", $id_usuario_sesion, PDO::PARAM_INT);
    $stmtPunto->execute();
    $puntoEmision = $stmtPunto->fetch(PDO::FETCH_ASSOC);

    if ($metodo === 'GET') {
        
        // 1. Verificar punto de emisión
        if (isset($_GET['verificar_punto'])) {
            ob_clean();
            if ($puntoEmision) {
                echo json_encode(["status" => "success", "tiene_punto" => true, "datos" => $puntoEmision]);
            } else {
                echo json_encode(["status" => "success", "tiene_punto" => false, "message" => "Tu usuario no tiene configurado un Punto de Emisión activo."]);
            }
            exit;
        }

        // 2. Ver detalles de una factura específica
        if (isset($_GET['id'])) {
            ob_clean();
            $id_factura = intval($_GET['id']);
            
            $facturaModel = new Factura($conexion);
            $cabecera = $facturaModel->obtenerFacturaCabecera($id_factura);
            
            if (!$cabecera) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Factura no encontrada."]);
                exit;
            }
            
            $detalles = $facturaModel->obtenerFacturaDetalle($id_factura);
            
            echo json_encode([
                "status" => "success",
                "factura" => $cabecera,
                "detalle" => $detalles
            ]);
            exit;
        }

        // 3. 📋 CASO: MIS VENTAS (Con filtros dinámicos por SP unificados)
        if (isset($_GET['mis_ventas'])) {
            ob_clean();
            $id_usuario = $_SESSION['id']; 
            $facturaModel = new Factura($conexion);
            
            if (isset($_GET['cliente']) && !empty(trim($_GET['cliente']))) {
                $misVentas = $facturaModel->obtenerMisVentasPorCliente($id_usuario, trim($_GET['cliente']));
            } elseif (isset($_GET['desde']) && isset($_GET['hasta']) && !empty($_GET['desde']) && !empty($_GET['hasta'])) {
                $misVentas = $facturaModel->obtenerMisVentasPorFecha($id_usuario, $_GET['desde'], $_GET['hasta']);
            } else {
                $misVentas = $facturaModel->obtenerVentasPorUsuario($id_usuario);
            }
            
            echo json_encode(["status" => "success", "data" => $misVentas]);
            exit;
        }

        // 4. 📊 CASO: VENTAS GENERALES (Con filtros dinámicos por SP unificados)
        if (isset($_GET['ventas_generales'])) {
            ob_clean();
            $facturaModel = new Factura($conexion);
            
            if (isset($_GET['cliente']) && !empty(trim($_GET['cliente']))) {
                $ventasGenerales = $facturaModel->obtenerVentasGeneralesPorCliente(trim($_GET['cliente']));
            } elseif (isset($_GET['desde']) && isset($_GET['hasta']) && !empty($_GET['desde']) && !empty($_GET['hasta'])) {
                $ventasGenerales = $facturaModel->obtenerVentasGeneralesPorFecha($_GET['desde'], $_GET['hasta']);
            } else {
                $ventasGenerales = $facturaModel->obtenerVentasGenerales();
            }
            
            echo json_encode(["status" => "success", "data" => $ventasGenerales]);
            exit;
        }
    }

    // 📥 Procesar la venta (POST)
    if ($metodo === 'POST') {
        if (!$puntoEmision) {
            ob_clean();
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Operación denegada. Su usuario no posee un Punto de Emisión asignado en el sistema."]);
            exit;
        }

        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if (!$data || empty($data['productos']) || !$data['id_cliente']) {
            ob_clean();
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Datos de la venta o carrito incompletos."]);
            exit;
        }

        $data['id_usuario'] = $id_usuario_sesion;
        $data['id_puntoEmision'] = $puntoEmision['id']; 

        $facturaModel = new Factura($conexion);
        $resultado = $facturaModel->registrarVenta($data);

        ob_clean();
        if ($resultado['status'] === 'success') {
            echo json_encode([
                "status" => "success", 
                "message" => "Venta procesada con éxito.",
                "id_factura" => $resultado['id_factura']
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $resultado['message']]);
        }
        exit;
    }

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    exit;
}
?>