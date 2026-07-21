<?php
class Clientes {
    private $conexion;

    // Propiedades de la tabla
    public $id;
    public $nombre1;
    public $nombre2;
    public $apellido1;
    public $apellido2;
    public $identificacion;
    public $tipoIdentificacion;
    public $correo;
    public $direccion;
    public $telefono;
    public $estado;

    public function __construct($db) {
        $this->conexion = $db;
    }

    // Obtener todos los clientes
    public function obtenerTodos() {
        $query = "CALL sp_obtener_clientes()";
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener un cliente por su ID
    public function obtenerPorId($id) {
        $query = "CALL sp_obtener_cliente_por_id(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Registrar nuevo cliente
    public function crear() {
        $query = "CALL sp_crear_cliente(:nombre1, :nombre2, :apellido1, :apellido2, :identificacion, :tipoIdentificacion, :correo, :direccion, :telefono)";
        $stmt = $this->conexion->prepare($query);

        // Sanitización estricta
        $this->nombre1 = htmlspecialchars(strip_tags($this->nombre1));
        $this->nombre2 = !empty($this->nombre2) ? htmlspecialchars(strip_tags($this->nombre2)) : null;
        $this->apellido1 = htmlspecialchars(strip_tags($this->apellido1));
        $this->apellido2 = !empty($this->apellido2) ? htmlspecialchars(strip_tags($this->apellido2)) : null;
        $this->identificacion = htmlspecialchars(strip_tags($this->identificacion));
        $this->tipoIdentificacion = htmlspecialchars(strip_tags($this->tipoIdentificacion));
        $this->correo = !empty($this->correo) ? htmlspecialchars(strip_tags($this->correo)) : null;
        $this->direccion = !empty($this->direccion) ? htmlspecialchars(strip_tags($this->direccion)) : null;
        $this->telefono = !empty($this->telefono) ? htmlspecialchars(strip_tags($this->telefono)) : null;

        // Vinculación de parámetros
        $stmt->bindParam(":nombre1", $this->nombre1);
        $stmt->bindParam(":nombre2", $this->nombre2, $this->nombre2 === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":apellido1", $this->apellido1);
        $stmt->bindParam(":apellido2", $this->apellido2, $this->apellido2 === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":identificacion", $this->identificacion);
        $stmt->bindParam(":tipoIdentificacion", $this->tipoIdentificacion);
        $stmt->bindParam(":correo", $this->correo, $this->correo === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":direccion", $this->direccion, $this->direccion === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":telefono", $this->telefono, $this->telefono === null ? PDO::PARAM_NULL : PDO::PARAM_STR);

        return $stmt->execute();
    }

    // Actualizar cliente existente
    public function actualizar() {
        $query = "CALL sp_actualizar_cliente(:id, :nombre1, :nombre2, :apellido1, :apellido2, :identificacion, :tipoIdentificacion, :correo, :direccion, :telefono, :estado)";
        $stmt = $this->conexion->prepare($query);

        $this->id = (int)$this->id;
        $this->nombre1 = htmlspecialchars(strip_tags($this->nombre1));
        $this->nombre2 = !empty($this->nombre2) ? htmlspecialchars(strip_tags($this->nombre2)) : null;
        $this->apellido1 = htmlspecialchars(strip_tags($this->apellido1));
        $this->apellido2 = !empty($this->apellido2) ? htmlspecialchars(strip_tags($this->apellido2)) : null;
        $this->identificacion = htmlspecialchars(strip_tags($this->identificacion));
        $this->tipoIdentificacion = htmlspecialchars(strip_tags($this->tipoIdentificacion));
        $this->correo = !empty($this->correo) ? htmlspecialchars(strip_tags($this->correo)) : null;
        $this->direccion = !empty($this->direccion) ? htmlspecialchars(strip_tags($this->direccion)) : null;
        $this->telefono = !empty($this->telefono) ? htmlspecialchars(strip_tags($this->telefono)) : null;
        $this->estado = (int)$this->estado;

        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $stmt->bindParam(":nombre1", $this->nombre1);
        $stmt->bindParam(":nombre2", $this->nombre2, $this->nombre2 === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":apellido1", $this->apellido1);
        $stmt->bindParam(":apellido2", $this->apellido2, $this->apellido2 === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":identificacion", $this->identificacion);
        $stmt->bindParam(":tipoIdentificacion", $this->tipoIdentificacion);
        $stmt->bindParam(":correo", $this->correo, $this->correo === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":direccion", $this->direccion, $this->direccion === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":telefono", $this->telefono, $this->telefono === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindParam(":estado", $this->estado, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Baja lógica del cliente (Cambio de estado a 0)
    public function eliminar($id) {
        $query = "CALL sp_eliminar_cliente(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>