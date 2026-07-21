<?php
class Menu {
    private $conexion;

    public $id;
    public $nombre;
    public $descripcion;
    public $url;
    public $estado;
    public $id_menuPadre;

    public function __construct($db) {
        $this->conexion = $db;
    }

    public function obtenerPorRol($id_rol) {
        $query = "CALL sp_ObtenerMenusPorRol(:id_rol)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id_rol", $id_rol, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerRolDeUsuario($idUsuario) {
        $query = "CALL sp_ObtenerRolUsuario(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id', $idUsuario, PDO::PARAM_INT);
        $stmt->execute();
        
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado ? $resultado['nombre'] : 'Sin Rol';
    }

    public function obtenerTodos() {
        // Como este es un SELECT directo y simple, puedes dejarlo o crear un SP pequeño si lo exigen al 100%
        $query = "SELECT id, nombre, descripcion, url, estado, id_menuPadre FROM menu ORDER BY id";
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function crear() {
        $query = "CALL sp_CrearMenu(:nombre, :descripcion, :url, :estado, :id_menuPadre)";
        $stmt = $this->conexion->prepare($query);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->url = htmlspecialchars(strip_tags($this->url));
        $estado = isset($this->estado) ? intval($this->estado) : 1;
        $idPadre = empty($this->id_menuPadre) ? null : intval($this->id_menuPadre);

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":url", $this->url);
        $stmt->bindParam(":estado", $estado, PDO::PARAM_INT);
        $stmt->bindValue(":id_menuPadre", $idPadre, $idPadre === null ? PDO::PARAM_NULL : PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function actualizar() {
        $query = "CALL sp_ActualizarMenu(:id, :nombre, :descripcion, :url, :estado, :id_menuPadre)";
        $stmt = $this->conexion->prepare($query);

        $this->id = intval($this->id);
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->url = htmlspecialchars(strip_tags($this->url));
        $this->estado = intval($this->estado);
        $idPadre = empty($this->id_menuPadre) ? null : intval($this->id_menuPadre);

        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":url", $this->url);
        $stmt->bindParam(":estado", $this->estado, PDO::PARAM_INT);
        $stmt->bindValue(":id_menuPadre", $idPadre, $idPadre === null ? PDO::PARAM_NULL : PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function desactivarLogico($id) {
        $query = "CALL sp_DesactivarMenu(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindValue(":id", intval($id), PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>