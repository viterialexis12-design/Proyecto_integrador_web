<?php
class Menu {
    private $conexion;
    private $tabla = "menu";

    public $codigo_menu;
    public $nombre;
    public $descripcion;
    public $id_rol;
    public $estado; // Añadido para el control de estados 1 y 0

    public function __construct($db) {
        $this->conexion = $db;
    }

    /**
     * 🔥 USADO POR EL SIDEBAR: Obtiene menús y concatena permisos por Rol (Solo Activos)
     */
    public function obtenerPorRol($id_rol) {
        $query = "SELECT 
                    m.codigo_menu, 
                    m.nombre, 
                    m.descripcion,
                    m.estado,
                    GROUP_CONCAT(p.nombre_permiso ORDER BY p.nombre_permiso ASC SEPARATOR ',') AS permisos_nombres,
                    GROUP_CONCAT(p.id_permiso ORDER BY p.nombre_permiso ASC SEPARATOR ',') AS permisos_ids
                  FROM " . $this->tabla . " m
                  LEFT JOIN permiso p ON m.codigo_menu = p.codigo_menu
                  WHERE m.id_rol = :id_rol AND m.estado = 1
                  GROUP BY m.codigo_menu
                  ORDER BY m.nombre ASC";

        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id_rol', $id_rol);
        $stmt->execute();

        $menus = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($menus as &$menu) {
            $nombres = !empty($menu['permisos_nombres']) ? explode(',', $menu['permisos_nombres']) : [];
            $ids = !empty($menu['permisos_ids']) ? explode(',', $menu['permisos_ids']) : [];
            
            $menu['permisos'] = [];
            for ($i = 0; $i < count($nombres); $i++) {
                $menu['permisos'][] = [
                    'id_permiso' => $ids[$i],
                    'nombre_permiso' => $nombres[$i]
                ];
            }
            unset($menu['permisos_nombres']);
            unset($menu['permisos_ids']);
        }
        return $menus;
    }

    /**
     * 🛠️ USADO POR EL CRUD (per0000013): Obtiene absolutamente todos los menús administrables
     */
    public function obtenerTodos() {
        $query = "SELECT codigo_menu, nombre, descripcion, id_rol, estado 
                  FROM " . $this->tabla . " 
                  ORDER BY codigo_menu DESC";
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * 🛠️ USADO POR EL CRUD (per0000014): Crear nuevo menú secuencial
     */
    public function crear() {
        $queryId = "SELECT IFNULL(MAX(CAST(SUBSTRING(codigo_menu, 4) AS UNSIGNED)), 0) + 1 AS siguiente FROM " . $this->tabla;
        $stmtId = $this->conexion->prepare($queryId);
        $stmtId->execute();
        $row = $stmtId->fetch(PDO::FETCH_ASSOC);
        $this->codigo_menu = "MNU" . str_pad($row['siguiente'], 6, "0", STR_PAD_LEFT);

        $query = "INSERT INTO " . $this->tabla . " (codigo_menu, nombre, descripcion, id_rol, estado) 
                  VALUES (:codigo_menu, :nombre, :descripcion, :id_rol, 1)"; // 1 = Activo

        $stmt = $this->conexion->prepare($query);
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->id_rol = htmlspecialchars(strip_tags($this->id_rol));

        $stmt->bindParam(':codigo_menu', $this->codigo_menu);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':id_rol', $this->id_rol);

        return $stmt->execute();
    }

    /**
     * 🛠️ USADO POR EL CRUD (per0000015): Editar un menú
     */
    public function actualizar() {
        $query = "UPDATE " . $this->tabla . " 
                  SET nombre = :nombre, descripcion = :descripcion, id_rol = :id_rol, estado = :estado 
                  WHERE codigo_menu = :codigo_menu";

        $stmt = $this->conexion->prepare($query);
        $this->codigo_menu = htmlspecialchars(strip_tags($this->codigo_menu));
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->id_rol = htmlspecialchars(strip_tags($this->id_rol));
        $this->estado = intval($this->estado);

        $stmt->bindParam(':codigo_menu', $this->codigo_menu);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':id_rol', $this->id_rol);
        $stmt->bindParam(':estado', $this->estado);

        return $stmt->execute();
    }

    /**
     * 🛠️ USADO POR EL CRUD (per0000016): Desactivación lógica (A 0)
     */
    public function desactivarLogico($codigo) {
        $query = "UPDATE " . $this->tabla . " SET estado = 0 WHERE codigo_menu = :codigo";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':codigo', $codigo);
        return $stmt->execute();
    }
}
?>