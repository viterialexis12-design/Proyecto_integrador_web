<?php
class Permiso {
    private $conexion;
    private $tabla = "permiso";

    // ─── PROPIEDADES REALES DE LA BD ──────────────────────────────────
    public $id_permiso;
    public $nombre_permiso;
    public $descripcion;
    public $codigo_menu;
    public $estado;

    public function __construct($db) {
        $this->conexion = $db;
    }

    /**
     * Obtiene todos los permisos con el nombre de su menú contenedor
     */
    public function obtenerTodos() {
        $query = "SELECT p.id_permiso, p.nombre_permiso, p.descripcion, p.codigo_menu, p.estado, m.nombre AS nombre_menu
                  FROM " . $this->tabla . " p
                  LEFT JOIN menu m ON p.codigo_menu = m.codigo_menu
                  ORDER BY p.id_permiso DESC";
                  
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Registra un nuevo permiso autogenerando el código consecutivo (PER0000001...)
     */
    public function crear() {
        // Generador secuencial para el ID del permiso
        $queryId = "SELECT IFNULL(MAX(CAST(SUBSTRING(id_permiso, 4) AS UNSIGNED)), 0) + 1 AS siguiente 
                    FROM " . $this->tabla;
        $stmtId = $this->conexion->prepare($queryId);
        $stmtId->execute();
        $row = $stmtId->fetch(PDO::FETCH_ASSOC);
        $this->id_permiso = "PER" . str_pad($row['siguiente'], 7, "0", STR_PAD_LEFT);

        $query = "INSERT INTO " . $this->tabla . " (id_permiso, nombre_permiso, descripcion, codigo_menu, estado) 
                  VALUES (:id_permiso, :nombre_permiso, :descripcion, :codigo_menu, 1)"; // 1 = Activo

        $stmt = $this->conexion->prepare($query);

        // Limpieza de datos
        $this->nombre_permiso = htmlspecialchars(strip_tags($this->nombre_permiso));
        $this->descripcion    = htmlspecialchars(strip_tags($this->descripcion));
        $this->codigo_menu    = htmlspecialchars(strip_tags($this->codigo_menu));

        $stmt->bindParam(':id_permiso', $this->id_permiso);
        $stmt->bindParam(':nombre_permiso', $this->nombre_permiso);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':codigo_menu', $this->codigo_menu);

        return $stmt->execute();
    }

    /**
     * Modifica las propiedades de un permiso existente
     */
    public function actualizar() {
        $query = "UPDATE " . $this->tabla . " 
                  SET nombre_permiso = :nombre_permiso, descripcion = :descripcion, codigo_menu = :codigo_menu, estado = :estado 
                  WHERE id_permiso = :id_permiso";

        $stmt = $this->conexion->prepare($query);

        $this->id_permiso     = htmlspecialchars(strip_tags($this->id_permiso));
        $this->nombre_permiso = htmlspecialchars(strip_tags($this->nombre_permiso));
        $this->descripcion    = htmlspecialchars(strip_tags($this->descripcion));
        $this->codigo_menu    = htmlspecialchars(strip_tags($this->codigo_menu));
        $this->estado         = intval($this->estado);

        $stmt->bindParam(':id_permiso', $this->id_permiso);
        $stmt->bindParam(':nombre_permiso', $this->nombre_permiso);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':codigo_menu', $this->codigo_menu);
        $stmt->bindParam(':estado', $this->estado);

        return $stmt->execute();
    }

    /**
     * Desactivación lógica segura (estado = 0)
     */
    public function desactivarLogico($id) {
        $query = "UPDATE " . $this->tabla . " SET estado = 0 WHERE id_permiso = :id";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>