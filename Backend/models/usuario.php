<?php
class Usuario {
    private $conexion;

    public $id;
    public $nombre1;
    public $nombre2;
    public $apellido1;
    public $apellido2;
    public $cedula;
    public $correo;
    public $fecha_nacimiento;
    public $foto_perfil;
    public $telefono;
    public $username;
    public $clave;
    public $estado;
    public $id_rol;
    public $id_empresa;

    public function __construct($db) {
        $this->conexion = $db;
    }

    public function obtenerTodos() {
        $query = "CALL sp_ObtenerTodosUsuarios()";
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorId($id) {
        $query = "CALL sp_ObtenerUsuarioPorId(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindValue(':id', intval($id), PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function crear() {
        $query = "CALL sp_CrearUsuario(:nombre1, :nombre2, :apellido1, :apellido2, :cedula, :correo, :fecha_nacimiento, :foto_perfil, :telefono, :username, :clave, :id_rol, :id_empresa, :estado)";
        $stmt = $this->conexion->prepare($query);

        $stmt->bindValue(':nombre1', $this->nombre1, PDO::PARAM_STR);
        $stmt->bindValue(':nombre2', $this->nombre2, PDO::PARAM_STR);
        $stmt->bindValue(':apellido1', $this->apellido1, PDO::PARAM_STR);
        $stmt->bindValue(':apellido2', $this->apellido2, PDO::PARAM_STR);
        $stmt->bindValue(':cedula', $this->cedula, PDO::PARAM_STR);
        $stmt->bindValue(':correo', $this->correo, PDO::PARAM_STR);
        $stmt->bindValue(':fecha_nacimiento', $this->fecha_nacimiento, PDO::PARAM_STR);
        $stmt->bindValue(':foto_perfil', $this->foto_perfil, PDO::PARAM_STR);
        $stmt->bindValue(':telefono', $this->telefono, PDO::PARAM_STR);
        $stmt->bindValue(':username', $this->username, PDO::PARAM_STR);
        $stmt->bindValue(':clave', $this->clave, PDO::PARAM_STR);
        $stmt->bindValue(':id_rol', intval($this->id_rol), PDO::PARAM_INT);
        $stmt->bindValue(':id_empresa', intval($this->id_empresa), PDO::PARAM_INT);
        $stmt->bindValue(':estado', intval($this->estado), PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function actualizar() {
        $query = "CALL sp_ActualizarUsuario(:id, :nombre1, :nombre2, :apellido1, :apellido2, :cedula, :correo, :fecha_nacimiento, :foto_perfil, :telefono, :username, :clave, :id_rol, :id_empresa, :estado)";
        $stmt = $this->conexion->prepare($query);

        $stmt->bindValue(':id', intval($this->id), PDO::PARAM_INT);
        $stmt->bindValue(':nombre1', $this->nombre1, PDO::PARAM_STR);
        $stmt->bindValue(':nombre2', $this->nombre2, PDO::PARAM_STR);
        $stmt->bindValue(':apellido1', $this->apellido1, PDO::PARAM_STR);
        $stmt->bindValue(':apellido2', $this->apellido2, PDO::PARAM_STR);
        $stmt->bindValue(':cedula', $this->cedula, PDO::PARAM_STR);
        $stmt->bindValue(':correo', $this->correo, PDO::PARAM_STR);
        $stmt->bindValue(':fecha_nacimiento', $this->fecha_nacimiento, PDO::PARAM_STR);
        $stmt->bindValue(':foto_perfil', $this->foto_perfil, PDO::PARAM_STR);
        $stmt->bindValue(':telefono', $this->telefono, PDO::PARAM_STR);
        $stmt->bindValue(':username', $this->username, PDO::PARAM_STR);
        $stmt->bindValue(':clave', $this->clave, PDO::PARAM_STR);
        $stmt->bindValue(':id_rol', intval($this->id_rol), PDO::PARAM_INT);
        $stmt->bindValue(':id_empresa', intval($this->id_empresa), PDO::PARAM_INT);
        $stmt->bindValue(':estado', intval($this->estado), PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function desactivarLogico($id) {
        $query = "CALL sp_DesactivarUsuario(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindValue(':id', intval($id), PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>