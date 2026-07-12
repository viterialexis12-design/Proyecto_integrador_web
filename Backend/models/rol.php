<?php
class Rol {
    private $conexion;
    private $tabla = "rol";

    // Atributos mapeados de la base de datos (Actualizado: id_rol -> id)
    public $id;
    public $nombre;
    public $descripcion;
    public $estado;

    public function __construct($db) {
        $this->conexion = $db;
    }

    /**
     * Obtiene la lista completa de roles ordenada por ID
     */
    public function obtenerTodos() {
        // Cambiado id_rol por id
        $query = "SELECT id, nombre, descripcion, estado 
                  FROM " . $this->tabla . " 
                  ORDER BY id DESC";
                  
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    /**
     * Registra un nuevo rol en el sistema
     */
    public function crear() {
        $query = "INSERT INTO " . $this->tabla . " (nombre, descripcion, estado) 
                  VALUES (:nombre, :descripcion, 1)";

        $stmt = $this->conexion->prepare($query);

        // Limpieza de datos (Sanitize)
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));

        // Vinculación segura de parámetros
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);

        return $stmt->execute();
    }

    /**
     * Actualiza los datos de un rol existente
     */
    public function actualizar() {
        // Cambiado id_rol = :id_rol por id = :id
        $query = "UPDATE " . $this->tabla . " 
                  SET nombre = :nombre, descripcion = :descripcion, estado = :estado 
                  WHERE id = :id";

        $stmt = $this->conexion->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->estado = htmlspecialchars(strip_tags($this->estado));

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':estado', $this->estado);

        return $stmt->execute();
    }

    /**
     * Inactivación lógica del rol (Pasa de 1 a 0)
     */
    public function desactivarLogico($id) {
        // Cambiado id_rol = :id por id = :id
        $query = "UPDATE " . $this->tabla . " SET estado = 0 WHERE id = :id";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>
