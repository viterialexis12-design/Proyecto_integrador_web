<?php
class PuntoEmision {
    private $conexion;
    private $tabla = "puntoEmision";

    // Propiedades correspondientes a las columnas de la BD
    public $id;
    public $nombre;
    public $codigoSRI;
    public $secuencial;
    public $estado;
    public $id_empresa;
    public $id_usuario;

    public function __construct($db) {
        $this->conexion = $db;
    }

    // Obtener todos los registros
    public function obtenerTodos() {
        $query = "CALL sp_obtener_puntos_emision()";
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener por ID
    public function obtenerPorId($id) {
        $query = "CALL sp_obtener_punto_emision_por_id(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Crear registro
    public function crear() {
        $query = "CALL sp_crear_punto_emision(:nombre, :codigoSRI, :secuencial, :estado, :id_empresa, :id_usuario)";
        $stmt = $this->conexion->prepare($query);

        // Sanitización y limpieza de cadenas
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->codigoSRI = htmlspecialchars(strip_tags($this->codigoSRI));
        $this->secuencial = (int)$this->secuencial;
        $this->estado = (int)$this->estado;
        $this->id_empresa = (int)$this->id_empresa;
        $this->id_usuario = !empty($this->id_usuario) ? (int)$this->id_usuario : null;

        // Vincular parámetros
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":codigoSRI", $this->codigoSRI);
        $stmt->bindParam(":secuencial", $this->secuencial, PDO::PARAM_INT);
        $stmt->bindParam(":estado", $this->estado, PDO::PARAM_INT);
        $stmt->bindParam(":id_empresa", $this->id_empresa, PDO::PARAM_INT);
        $stmt->bindParam(":id_usuario", $this->id_usuario, $this->id_usuario === null ? PDO::PARAM_NULL : PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Actualizar registro
    public function actualizar() {
        $query = "CALL sp_actualizar_punto_emision(:id, :nombre, :codigoSRI, :secuencial, :estado, :id_empresa, :id_usuario)";
        $stmt = $this->conexion->prepare($query);

        // Sanitización y tipos
        $this->id = (int)$this->id;
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->codigoSRI = htmlspecialchars(strip_tags($this->codigoSRI));
        $this->secuencial = (int)$this->secuencial;
        $this->estado = (int)$this->estado;
        $this->id_empresa = (int)$this->id_empresa;
        $this->id_usuario = !empty($this->id_usuario) ? (int)$this->id_usuario : null;

        // Vincular parámetros
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":codigoSRI", $this->codigoSRI);
        $stmt->bindParam(":secuencial", $this->secuencial, PDO::PARAM_INT);
        $stmt->bindParam(":estado", $this->estado, PDO::PARAM_INT);
        $stmt->bindParam(":id_empresa", $this->id_empresa, PDO::PARAM_INT);
        $stmt->bindParam(":id_usuario", $this->id_usuario, $this->id_usuario === null ? PDO::PARAM_NULL : PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Eliminar registro
    public function eliminar($id) {
        $query = "CALL sp_eliminar_punto_emision(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>