<?php
class Menu {
    private $conexion;
    private $tabla = "menu";

    public $id;
    public $nombre;
    public $descripcion;
    public $url;
    public $estado;
    public $id_menuPadre;

    public function __construct($db) {
        $this->conexion = $db;
    }

    /**
     * Menús asignados a un rol
     */
    public function obtenerPorRol($id_rol) {

        $query = "SELECT
                    m.id,
                    m.nombre,
                    m.descripcion,
                    m.url,
                    m.estado,
                    m.id_menuPadre
                  FROM {$this->tabla} m
                  INNER JOIN permiso p
                        ON p.id_menu = m.id
                  WHERE p.id_rol = :id_rol
                    AND m.estado = 1
                  ORDER BY m.nombre";

        $stmt = $this->conexion->prepare($query);

        $stmt->bindParam(":id_rol", $id_rol, PDO::PARAM_INT);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function obtenerRolDeUsuario($idUsuario) {
        $query = "SELECT r.nombre 
                  FROM usuario u
                  INNER JOIN rol r ON u.id_rol = r.id
                  WHERE u.id = :id LIMIT 1";
                  
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id', $idUsuario, PDO::PARAM_INT);
        $stmt->execute();
        
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado ? $resultado['nombre'] : 'Sin Rol';
    }

    /**
     * Obtener todos los menús
     */
    public function obtenerTodos() {

        $query = "SELECT
                    id,
                    nombre,
                    descripcion,
                    url,
                    estado,
                    id_menuPadre
                  FROM {$this->tabla}
                  ORDER BY id";

        $stmt = $this->conexion->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Crear menú
     */
    public function crear() {

        $query = "INSERT INTO {$this->tabla}
                (
                    nombre,
                    descripcion,
                    url,
                    estado,
                    id_menuPadre
                )
                VALUES
                (
                    :nombre,
                    :descripcion,
                    :url,
                    :estado,
                    :id_menuPadre
                )";

        $stmt = $this->conexion->prepare($query);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->url = htmlspecialchars(strip_tags($this->url));

        $estado = isset($this->estado) ? intval($this->estado) : 1;

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":url", $this->url);
        $stmt->bindParam(":estado", $estado, PDO::PARAM_INT);

        if (empty($this->id_menuPadre)) {
            $stmt->bindValue(":id_menuPadre", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":id_menuPadre", intval($this->id_menuPadre), PDO::PARAM_INT);
        }

        return $stmt->execute();
    }

    /**
     * Actualizar menú
     */
    public function actualizar() {

        $query = "UPDATE {$this->tabla}
                  SET
                        nombre = :nombre,
                        descripcion = :descripcion,
                        url = :url,
                        estado = :estado,
                        id_menuPadre = :id_menuPadre
                  WHERE id = :id";

        $stmt = $this->conexion->prepare($query);

        $this->id = intval($this->id);
        $this->estado = intval($this->estado);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->url = htmlspecialchars(strip_tags($this->url));

        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":url", $this->url);
        $stmt->bindParam(":estado", $this->estado, PDO::PARAM_INT);

        if (empty($this->id_menuPadre)) {
            $stmt->bindValue(":id_menuPadre", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":id_menuPadre", intval($this->id_menuPadre), PDO::PARAM_INT);
        }

        return $stmt->execute();
    }

    /**
     * Desactivación lógica
     */
    public function desactivarLogico($id) {

        $query = "UPDATE {$this->tabla}
                  SET estado = 0
                  WHERE id = :id";

        $stmt = $this->conexion->prepare($query);

        $stmt->bindValue(":id", intval($id), PDO::PARAM_INT);

        return $stmt->execute();
    }
}
?>