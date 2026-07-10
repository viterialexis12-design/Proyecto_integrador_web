<?php
class Rol {
    private $conexion;
    private $tabla = "rol";

    // Atributos mapeados de la base de datos
    public $id_rol;
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
        $query = "SELECT id_rol, nombre, descripcion, estado 
                  FROM " . $this->tabla . " 
                  ORDER BY id_rol DESC";
                  
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

        // Limpieza de datos (Sanatize)
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
        $query = "UPDATE " . $this->tabla . " 
                  SET nombre = :nombre, descripcion = :descripcion, estado = :estado 
                  WHERE id_rol = :id_rol";

        $stmt = $this->conexion->prepare($query);

        $this->id_rol = htmlspecialchars(strip_tags($this->id_rol));
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->estado = htmlspecialchars(strip_tags($this->estado));

        $stmt->bindParam(':id_rol', $this->id_rol);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':estado', $this->estado);

        return $stmt->execute();
    }

    /**
     * Inactivación lógica del rol (Pasa de 'A' a 'I')
     */
    public function desactivarLogico($id) {
        $query = "UPDATE " . $this->tabla . " SET estado = 0 WHERE id_rol= :id";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>