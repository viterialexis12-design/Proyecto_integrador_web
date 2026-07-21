<?php
class Factura {
    private $conexion;

    public function __construct($db) {
        $this->conexion = $db;
    }

    public function registrarVenta($datosVenta) {
        try {
            $this->conexion->beginTransaction();

            // 1. GENERAR CABECERA MEDIANTE PROCEDURE
            // Agregamos el parámetro ':id_punto' que faltaba
            $queryCabecera = "CALL sp_crear_factura(:clave, :subtotal, :iva, :total, :id_punto, :id_cliente, :id_usuario, @id_factura)";
            $stmt = $this->conexion->prepare($queryCabecera);

            // Estructura oficial del SRI para Clave de Acceso (Ejemplo con fecha actual de 2026)
            $claveDummy = "1907202601" . "1793456789001" . "2" . "001001" . str_pad(rand(1, 99999999), 8, "0", STR_PAD_LEFT) . "123456781";

            $stmt->bindParam(":clave", $claveDummy);
            $stmt->bindParam(":subtotal", $datosVenta['subtotal']);
            $stmt->bindParam(":iva", $datosVenta['totalIva']);
            $stmt->bindParam(":total", $datosVenta['importeTotal']);
            $stmt->bindParam(":id_punto", $datosVenta['id_puntoEmision'], PDO::PARAM_INT);
            $stmt->bindParam(":id_cliente", $datosVenta['id_cliente'], PDO::PARAM_INT);
            $stmt->bindParam(":id_usuario", $datosVenta['id_usuario'], PDO::PARAM_INT);
            
            $stmt->execute();
            $stmt->closeCursor();

            // Recuperamos el ID devuelto por la variable de sesión de MySQL
            $resId = $this->conexion->query("SELECT @id_factura AS id_factura")->fetch(PDO::FETCH_ASSOC);
            $idFactura = $resId['id_factura'];

            if (!$idFactura) {
                throw new Exception("No se pudo recuperar el ID de la factura generada.");
            }

            // 2. INSERTAR DETALLES MEDIANTE PROCEDURE
            // Cero código SQL aquí, delegamos el cálculo del IVA a MySQL
            $queryDetalle = "CALL sp_insertar_detalle_factura(:cantidad, :precio, :tarifa_iva, :id_factura, :id_producto)";
            $stmtDetalle = $this->conexion->prepare($queryDetalle);

            foreach ($datosVenta['productos'] as $prod) {
                $stmtDetalle->bindParam(":cantidad", $prod['cantidad']);
                $stmtDetalle->bindParam(":precio", $prod['precioUnitario']);
                $stmtDetalle->bindParam(":tarifa_iva", $prod['porcentajeIva']);
                $stmtDetalle->bindParam(":id_factura", $idFactura, PDO::PARAM_INT);
                $stmtDetalle->bindParam(":id_producto", $prod['id_producto'], PDO::PARAM_INT);

                $stmtDetalle->execute();
                $stmtDetalle->closeCursor(); // Limpiamos el cursor en cada iteración del Procedure
            }

            $this->conexion->commit();
            return ["status" => "success", "id_factura" => $idFactura];

        } catch (Exception $e) {
            $this->conexion->rollBack();
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    // Usando la vista que creamos en el paso anterior para leer datos limpios sin JOINS manuales
    public function obtenerFacturaCabecera($idFactura) {
        $query = "SELECT * FROM v_factura_cabecera WHERE factura_id = :id LIMIT 1";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id", $idFactura, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function obtenerFacturaDetalle($idFactura) {
        $query = "SELECT * FROM v_factura_detalle WHERE factura_id = :id";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id", $idFactura, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerVentasPorUsuario($id_usuario) {
        try {
            // Invocamos el procedimiento usando la sintaxis estándar de PDO
            $sql = "CALL sp_obtener_ventas_por_usuario(:id_usuario)";
            $stmt = $this->conexion->prepare($sql);
            
            if (!$stmt) {
                throw new Exception("Error al preparar el procedimiento almacenado.");
            }
            
            $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
            $stmt->execute();
            
            // Recuperamos todos los registros mapeados en un arreglo asociativo
            $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // 🧹 IMPORTANTE PARA PDO + MARIADB PROCEDURES:
            // Cerramos el cursor para liberar la conexión y evitar errores "Row count" o buffers bloqueados
            $stmt->closeCursor();
            
            return $ventas;
            
        } catch (PDOException $e) {
            throw new Exception("Error en la base de datos (SP): " . $e->getMessage());
        }
    }

    public function obtenerVentasGenerales() {
        try {
            $sql = "CALL sp_obtener_ventas_generales()";
            $stmt = $this->conexion->prepare($sql);
            
            if (!$stmt) {
                throw new Exception("Error al preparar el procedimiento de ventas generales.");
            }
            
            $stmt->execute();
            $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $stmt->closeCursor();
            return $ventas;
            
        } catch (PDOException $e) {
            throw new Exception("Error en la base de datos (SP General): " . $e->getMessage());
        }
    }
    // ==========================================
    // MÉTODOS COMPLEMENTARIOS PARA "MIS VENTAS"
    // ==========================================

    public function obtenerMisVentasPorCliente($id_usuario, $termino) {
        try {
            $sql = "CALL sp_mis_ventas_por_cliente(:id_usuario, :termino)";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
            $stmt->bindParam(":termino", $termino, PDO::PARAM_STR);
            $stmt->execute();
            $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $ventas;
        } catch (PDOException $e) {
            throw new Exception("Error al filtrar mis ventas por cliente: " . $e->getMessage());
        }
    }

    public function obtenerMisVentasPorFecha($id_usuario, $fecha_inicio, $fecha_fin) {
        try {
            $sql = "CALL sp_mis_ventas_por_fecha(:id_usuario, :fecha_inicio, :fecha_fin)";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
            $stmt->bindParam(":fecha_inicio", $fecha_inicio, PDO::PARAM_STR);
            $stmt->bindParam(":fecha_fin", $fecha_fin, PDO::PARAM_STR);
            $stmt->execute();
            $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $ventas;
        } catch (PDOException $e) {
            throw new Exception("Error al filtrar mis ventas por fecha: " . $e->getMessage());
        }
    }

    // ==============================================
    // MÉTODOS COMPLEMENTARIOS PARA "VENTAS GENERALES"
    // ==============================================

    public function obtenerVentasGeneralesPorCliente($termino) {
        try {
            $sql = "CALL sp_ventas_generales_por_cliente(:termino)";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":termino", $termino, PDO::PARAM_STR);
            $stmt->execute();
            $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $ventas;
        } catch (PDOException $e) {
            throw new Exception("Error al filtrar ventas generales por cliente: " . $e->getMessage());
        }
    }

    public function obtenerVentasGeneralesPorFecha($fecha_inicio, $fecha_fin) {
        try {
            $sql = "CALL sp_ventas_generales_por_fecha(:fecha_inicio, :fecha_fin)";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":fecha_inicio", $fecha_inicio, PDO::PARAM_STR);
            $stmt->bindParam(":fecha_fin", $fecha_fin, PDO::PARAM_STR);
            $stmt->execute();
            $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $ventas;
        } catch (PDOException $e) {
            throw new Exception("Error al filtrar ventas generales por fecha: " . $e->getMessage());
        }
    }
}
?>