<?php
class Movimiento {
    private $conexion;

    public $id;
    public $nombreProveedor;
    public $tipoMovimiento;
    public $cantidad;
    public $fecha;
    public $observacion;
    public $id_producto;
    public $id_usuario;
    public $id_factura;

    public function __construct($db) {
        $this->conexion = $db;
    }

   public function registrarIngreso() {
        $query = "CALL sp_registrar_movimiento_ingreso(:proveedor, :tipo, :cantidad, :observacion, :id_producto, :id_usuario)";
        $stmt = $this->conexion->prepare($query);

        $this->nombreProveedor = !empty($this->nombreProveedor) ? htmlspecialchars(strip_tags($this->nombreProveedor)) : null;
        $this->tipoMovimiento = 1; // Asignamos el entero 1 en lugar de la cadena 'INGRESO'
        $this->cantidad = (float)$this->cantidad;
        $this->observacion = !empty($this->observacion) ? htmlspecialchars(strip_tags($this->observacion)) : null;
        $this->id_producto = (int)$this->id_producto;
        $this->id_usuario = (int)$this->id_usuario;

        $stmt->bindParam(":proveedor", $this->nombreProveedor, $this->nombreProveedor === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":tipo", $this->tipoMovimiento, PDO::PARAM_INT); // Cambiado a PARAM_INT
        $stmt->bindParam(":cantidad", $this->cantidad);
        $stmt->bindParam(":observacion", $this->observacion, $this->observacion === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":id_producto", $this->id_producto, PDO::PARAM_INT);
        $stmt->bindParam(":id_usuario", $this->id_usuario, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function registrarEgreso() {
        $query = "CALL sp_registrar_movimiento_egreso(:tipo, :cantidad, :observacion, :id_producto, :id_usuario)";
        $stmt = $this->conexion->prepare($query);

        $this->tipoMovimiento = 2; // 2 = EGRESO
        $this->cantidad = (float)$this->cantidad;
        $this->observacion = !empty($this->observacion) ? htmlspecialchars(strip_tags($this->observacion)) : null;
        $this->id_producto = (int)$this->id_producto;
        $this->id_usuario = (int)$this->id_usuario;

        $stmt->bindParam(":tipo", $this->tipoMovimiento, PDO::PARAM_INT);
        $stmt->bindParam(":cantidad", $this->cantidad);
        $stmt->bindParam(":observacion", $this->observacion, $this->observacion === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":id_producto", $this->id_producto, PDO::PARAM_INT);
        $stmt->bindParam(":id_usuario", $this->id_usuario, PDO::PARAM_INT);

        return $stmt->execute();
    }

public function obtenerAuditoria($fecha_inicio = null, $fecha_fin = null, $tipo_movimiento = null) {
    try {
        // Cero código SQL aquí, abstracción total hacia el SP
        $sql = "CALL sp_obtener_auditoria(:inicio, :fin, :tipo)";
        $stmt = $this->conexion->prepare($sql);
        
        $stmt->bindParam(':inicio', $fecha_inicio, $fecha_inicio === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(':fin', $fecha_fin, $fecha_fin === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(':tipo', $tipo_movimiento, $tipo_movimiento === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        throw new Exception("Error al invocar el procedimiento de auditoría: " . $e->getMessage());
    }
}
}
?>