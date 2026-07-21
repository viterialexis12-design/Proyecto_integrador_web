<?php
class Auditoria {
    private $conexion;

    // Atributos de la tabla
    public $id;
    public $tabla_afectada;
    public $operacion;
    public $registro_id;
    public $valor_anterior;
    public $valor_nuevo;
    public $id_usuario;
    public $fecha_movimiento;

    public function __construct($db) {
        $this->conexion = $db;
    }

    /**
     * Obtiene el historial de auditorías con filtros opcionales
     */
    public function obtenerTodos($tabla = null, $fecha_inicio = null, $fecha_fin = null) {
        $query = "CALL sp_obtener_auditorias_cambios(:tabla, :fecha_inicio, :fecha_fin)";
        $stmt = $this->conexion->prepare($query);

        $tabla = !empty($tabla) ? htmlspecialchars(strip_tags($tabla)) : null;
        $fecha_inicio = !empty($fecha_inicio) ? $fecha_inicio : null;
        $fecha_fin = !empty($fecha_fin) ? $fecha_fin : null;

        $stmt->bindParam(":tabla", $tabla, $tabla === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":fecha_inicio", $fecha_inicio, $fecha_inicio === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":fecha_fin", $fecha_fin, $fecha_fin === null ? PDO::PARAM_NULL : PDO::PARAM_STR);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>