<?php
class Permiso {
    private $conexion;

    public $id;
    public $id_rol;
    public $id_menu;

    public function __construct($db) {
        $this->conexion = $db;
    }

    public function obtenerTodos() {
        $query = "CALL sp_ObtenerTodosPermisos()";
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function crear() {
        $query = "CALL sp_CrearPermiso(:id_rol, :id_menu)";
        $stmt = $this->conexion->prepare($query);

        $this->id_rol  = intval($this->id_rol);
        $this->id_menu = intval($this->id_menu);

        $stmt->bindParam(':id_rol', $this->id_rol, PDO::PARAM_INT);
        $stmt->bindParam(':id_menu', $this->id_menu, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function actualizar() {
        $query = "CALL sp_ActualizarPermiso(:id, :id_rol, :id_menu)";
        $stmt = $this->conexion->prepare($query);

        $this->id      = intval($this->id);
        $this->id_rol  = intval($this->id_rol);
        $this->id_menu = intval($this->id_menu);

        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->bindParam(':id_rol', $this->id_rol, PDO::PARAM_INT);
        $stmt->bindParam(':id_menu', $this->id_menu, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function eliminar($id) {
        $query = "CALL sp_EliminarPermiso(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function obtenerMatrizPorRol($id_rol) {
        $query = "CALL sp_ObtenerMatrizPorRol(:id_rol)";
        $stmt = $this->conexion->prepare($query);
        $id_rol = intval($id_rol);
        $stmt->bindParam(':id_rol', $id_rol, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Envía la lista de IDs seleccionados compactados en un String CSV al Stored Procedure
     */
    public function guardarMatriz($id_rol, array $menus) {
        $query = "CALL sp_GuardarMatrizPermisos(:id_rol, :menus_csv)";
        $stmt = $this->conexion->prepare($query);

        $menusCsv = !empty($menus) ? implode(',', array_map('intval', $menus)) : '';

        $stmt->bindValue(':id_rol', intval($id_rol), PDO::PARAM_INT);
        $stmt->bindValue(':menus_csv', $menusCsv, PDO::PARAM_STR);

        return $stmt->execute();
    }
}
?>