<?php
class Categoria {
    private $conexion;

    // Propiedades mapeadas de la tabla
    public $id;
    public $nombre;
    public $descripcion;
    public $estado;
    public $id_ivaSRI;

    public function __construct($db) {
        $this->conexion = $db;
    }

    // Obtener todo el catálogo
    public function obtenerTodos() {
        $query = "CALL sp_obtener_categorias()";
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener un registro específico
    public function obtenerPorId($id) {
        $query = "CALL sp_obtener_categoria_por_id(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Insertar nueva categoría
    public function crear() {
        $query = "CALL sp_crear_categoria(:nombre, :descripcion, :id_ivaSRI)";
        $stmt = $this->conexion->prepare($query);

        // Sanitización rigurosa
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = !empty($this->descripcion) ? htmlspecialchars(strip_tags($this->descripcion)) : null;
        $this->id_ivaSRI = (int)$this->id_ivaSRI;

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion, $this->descripcion === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":id_ivaSRI", $this->id_ivaSRI, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Actualizar registro existente
    public function actualizar() {
        $query = "CALL sp_actualizar_categoria(:id, :nombre, :descripcion, :estado, :id_ivaSRI)";
        $stmt = $this->conexion->prepare($query);

        $this->id = (int)$this->id;
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = !empty($this->descripcion) ? htmlspecialchars(strip_tags($this->descripcion)) : null;
        $this->estado = (int)$this->estado;
        $this->id_ivaSRI = (int)$this->id_ivaSRI;

        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion, $this->descripcion === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":estado", $this->estado, PDO::PARAM_INT);
        $stmt->bindParam(":id_ivaSRI", $this->id_ivaSRI, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Baja lógica (Cambio de estado a 0)
    public function eliminar($id) {
        $query = "CALL sp_eliminar_categoria(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>