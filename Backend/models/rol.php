<?php
class Rol {
    private $conexion;

    public $id;
    public $nombre;
    public $descripcion;
    public $estado;

    public function __construct($db) {
        $this->conexion = $db;
    }

    /**
     * Obtiene la lista completa de roles mediante Stored Procedure
     */
    public function obtenerTodos() {
        $query = "CALL sp_ObtenerTodosRoles()";
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Registra un nuevo rol mediante Stored Procedure
     */
    public function crear() {
        $query = "CALL sp_CrearRol(:nombre, :descripcion)";
        $stmt = $this->conexion->prepare($query);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));

        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);

        return $stmt->execute();
    }

    /**
     * Actualiza los datos de un rol mediante Stored Procedure
     */
    public function actualizar() {
        $query = "CALL sp_ActualizarRol(:id, :nombre, :descripcion, :estado)";
        $stmt = $this->conexion->prepare($query);

        $this->id = intval($this->id);
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->estado = intval($this->estado);

        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':estado', $this->estado, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Inactivación lógica del rol mediante Stored Procedure
     */
    public function desactivarLogico($id) {
        $query = "CALL sp_DesactivarRol(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindValue(':id', intval($id), PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>