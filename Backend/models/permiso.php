<?php
class Permiso {
    private $conexion;
    private $tabla = "permiso";

    // Mapeo adaptado a la tabla intermedia pura
    public $id;
    public $id_rol;
    public $id_menu;

    public function __construct($db) {
        $this->conexion = $db;
    }

    /**
     * Obtiene la lista de asignaciones vigentes entre roles y menús
     */
    public function obtenerTodos() {
    // Agregamos m.id_menuPadre a la consulta
    $query = "SELECT p.id, p.id_rol, p.id_menu, 
                     r.nombre AS nombre_rol, 
                     m.nombre AS nombre_menu,
                     m.id_menuPadre
              FROM " . $this->tabla . " p
              INNER JOIN rol r ON p.id_rol = r.id
              INNER JOIN menu m ON p.id_menu = m.id
              ORDER BY m.id_menuPadre ASC, m.id ASC"; // Mejor orden para estructura jerárquica
              
    $stmt = $this->conexion->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}



    /**
     * Crea la asignación (vínculo) entre un rol y un menú
     */
    public function crear() {
        // Al tener un UNIQUE KEY (id_rol, id_menu), usamos un condicional para evitar duplicados manuales o errores fatales
        $query = "INSERT INTO " . $this->tabla . " (id_rol, id_menu) 
                  VALUES (:id_rol, :id_menu)";

        $stmt = $this->conexion->prepare($query);

        $this->id_rol  = intval($this->id_rol);
        $this->id_menu = intval($this->id_menu);

        $stmt->bindParam(':id_rol', $this->id_rol);
        $stmt->bindParam(':id_menu', $this->id_menu);

        return $stmt->execute();
    }

    /**
     * Modifica una asignación existente (cambiar el rol o el menú asignado)
     */
    public function actualizar() {
        $query = "UPDATE " . $this->tabla . " 
                  SET id_rol = :id_rol, id_menu = :id_menu 
                  WHERE id = :id";

        $stmt = $this->conexion->prepare($query);

        $this->id      = intval($this->id);
        $this->id_rol  = intval($this->id_rol);
        $this->id_menu = intval($this->id_menu);

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':id_rol', $this->id_rol);
        $stmt->bindParam(':id_menu', $this->id_menu);

        return $stmt->execute();
    }

    /**
     * En una tabla asociativa intermedia no suele haber "desactivación lógica". 
     * Se elimina el registro completo para remover el acceso (Eliminación Física).
     */
    public function eliminar($id) {
        $query = "DELETE FROM " . $this->tabla . " WHERE id = :id";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
    /**
 * Obtiene el catálogo completo de menús cruzado con los accesos de un rol específico
 * para alimentar la matriz de checkboxes.
 */
public function obtenerMatrizPorRol($id_rol) {
    $query = "SELECT 
                m.id AS id_menu_catalogo,
                m.nombre AS nombre_menu,
                m.id_menuPadre,
                CASE WHEN p.id IS NOT NULL THEN 1 ELSE 0 END AS tiene_permiso
              FROM menu m
              LEFT JOIN permiso p ON p.id_menu = m.id AND p.id_rol = :id_rol
              WHERE m.estado = 1
              ORDER BY m.id_menuPadre ASC, m.id ASC";

    $stmt = $this->conexion->prepare($query);
    $id_rol = intval($id_rol);
    $stmt->bindParam(':id_rol', $id_rol, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
}
?>