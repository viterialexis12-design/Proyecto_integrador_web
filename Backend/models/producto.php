<?php
class Producto {
    private $conexion;

    // Atributos de la tabla
    public $id;
    public $nombre;
    public $descripcion;
    public $unidadMedida;
    public $precioUnitario;
    public $stockActual;
    public $estado;
    public $id_categoria;

    public function __construct($db) {
        $this->conexion = $db;
    }

    public function obtenerTodos($soloAlerta = 0) {
        $query = "CALL sp_obtener_productos(:solo_alerta)";
        $stmt = $this->conexion->prepare($query);
        
        $soloAlerta = (int)$soloAlerta;
        $stmt->bindParam(":solo_alerta", $soloAlerta, PDO::PARAM_INT);
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorId($id) {
        $query = "CALL sp_obtener_producto_por_id(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function crear() {
        $query = "CALL sp_crear_producto(:nombre, :descripcion, :unidadMedida, :precioUnitario, :stockActual, :id_categoria)";
        $stmt = $this->conexion->prepare($query);

        // Sanitización rigurosa
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = !empty($this->descripcion) ? htmlspecialchars(strip_tags($this->descripcion)) : null;
        $this->unidadMedida = !empty($this->unidadMedida) ? htmlspecialchars(strip_tags($this->unidadMedida)) : 'UNIDAD';
        $this->precioUnitario = (float)$this->precioUnitario;
        $this->stockActual = (float)$this->stockActual;
        $this->id_categoria = (int)$this->id_categoria;

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion, $this->descripcion === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":unidadMedida", $this->unidadMedida);
        $stmt->bindParam(":precioUnitario", $this->precioUnitario);
        $stmt->bindParam(":stockActual", $this->stockActual);
        $stmt->bindParam(":id_categoria", $this->id_categoria, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function actualizar() {
        $query = "CALL sp_actualizar_producto(:id, :nombre, :descripcion, :unidadMedida, :precioUnitario, :stockActual, :estado, :id_categoria)";
        $stmt = $this->conexion->prepare($query);

        $this->id = (int)$this->id;
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = !empty($this->descripcion) ? htmlspecialchars(strip_tags($this->descripcion)) : null;
        $this->unidadMedida = !empty($this->unidadMedida) ? htmlspecialchars(strip_tags($this->unidadMedida)) : 'UNIDAD';
        $this->precioUnitario = (float)$this->precioUnitario;
        $this->stockActual = (float)$this->stockActual;
        $this->estado = (int)$this->estado;
        $this->id_categoria = (int)$this->id_categoria;

        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion, $this->descripcion === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":unidadMedida", $this->unidadMedida);
        $stmt->bindParam(":precioUnitario", $this->precioUnitario);
        $stmt->bindParam(":stockActual", $this->stockActual);
        $stmt->bindParam(":estado", $this->estado, PDO::PARAM_INT);
        $stmt->bindParam(":id_categoria", $this->id_categoria, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function eliminar($id) {
        $query = "CALL sp_eliminar_producto(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>