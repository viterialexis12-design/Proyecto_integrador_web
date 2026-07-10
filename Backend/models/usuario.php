<?php
class Usuario {
    private $conexion;
    private $tabla = "usuario";

    // Propiedades del objeto Usuario
    public $id_usuario;
    public $nombre1;
    public $nombre2;
    public $apellido1;
    public $apellido2;
    public $fecha_nacimiento;
    public $cedula;
    public $telefono;
    public $correo;
    public $username;
    public $clave;
    public $estado;
    public $foto_perfil;
    public $id_rol;

    public function __construct($db) {
        $this->conexion = $db;
    }

    /**
     * Lee todos los usuarios de la base de datos
     * Realiza un JOIN con la tabla rol para traer el nombre del rol amigable
     */
    public function leerTodos() {
        $query = "SELECT 
                    u.id_usuario, 
                    u.nombre1, 
                    u.nombre2, 
                    u.apellido1, 
                    u.apellido2, 
                    u.cedula, 
                    u.correo, 
                    u.username, 
                    u.estado, 
                    u.id_rol,
                    r.nombre AS nombre_rol
                  FROM " . $this->tabla . " u
                  LEFT JOIN rol r ON u.id_rol = r.id_rol
                  ORDER BY u.id_usuario DESC";

        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function obtenerTodos() {
    // Ajusta los nombres de las columnas a los reales de tu base de datos si varían
    $query = "SELECT 
                u.id_usuario, 
                u.nombre1, 
                u.apellido1, 
                u.cedula, 
                u.correo, 
                u.username, 
                u.estado, 
                r.nombre AS nombre_rol
              FROM usuario u
              LEFT JOIN rol r ON u.id_rol = r.id_rol
              ORDER BY u.id_usuario DESC";

    $stmt = $this->conexion->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
/**
     * Registra un nuevo usuario en la base de datos
     */
    public function crear() {
        $query = "INSERT INTO " . $this->tabla . " 
                    (nombre1, nombre2, apellido1, apellido2, cedula, fecha_nacimiento, telefono, correo, username, clave, id_rol, estado) 
                  VALUES 
                    (:nombre1, :nombre2, :apellido1, :apellido2, :cedula, :fecha_nacimiento, :telefono, :correo, :username, :clave, :id_rol, :estado)";

        $stmt = $this->conexion->prepare($query);

        // Vinculación de parámetros seguros contra inyección SQL
        $stmt->bindParam(':nombre1', $this->nombre1);
        $stmt->bindParam(':nombre2', $this->nombre2);
        $stmt->bindParam(':apellido1', $this->apellido1);
        $stmt->bindParam(':apellido2', $this->apellido2);
        $stmt->bindParam(':cedula', $this->cedula);
        $stmt->bindParam(':fecha_nacimiento', $this->fecha_nacimiento);
        $stmt->bindParam(':telefono', $this->telefono);
        $stmt->bindParam(':correo', $this->correo);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':clave', $this->clave); // 🔐 Llega hasheada en SHA-256
        $stmt->bindParam(':id_rol', $this->id_rol);
        $stmt->bindParam(':estado', $this->estado);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    /**
     * Obtiene un usuario específico por su ID
     */
    public function obtenerPorId($id) {
        $query = "SELECT * FROM " . $this->tabla . " WHERE id_usuario = :id LIMIT 1";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Actualiza los datos de un usuario existente
     */
    public function actualizar() {
        $query = "UPDATE " . $this->tabla . " SET 
                    nombre1 = :nombre1, nombre2 = :nombre2, apellido1 = :apellido1, apellido2 = :apellido2,
                    cedula = :cedula, fecha_nacimiento = :fecha_nacimiento, telefono = :telefono, 
                    correo = :correo, username = :username, clave = :clave, id_rol = :id_rol, estado = :estado
                  WHERE id_usuario = :id_usuario";

        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':nombre1', $this->nombre1);
        $stmt->bindParam(':nombre2', $this->nombre2);
        $stmt->bindParam(':apellido1', $this->apellido1);
        $stmt->bindParam(':apellido2', $this->apellido2);
        $stmt->bindParam(':cedula', $this->cedula);
        $stmt->bindParam(':fecha_nacimiento', $this->fecha_nacimiento);
        $stmt->bindParam(':telefono', $this->telefono);
        $stmt->bindParam(':correo', $this->correo);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':clave', $this->clave);
        $stmt->bindParam(':id_rol', $this->id_rol);
        $stmt->bindParam(':estado', $this->estado);
        $stmt->bindParam(':id_usuario', $this->id_usuario);

        return $stmt->execute();
    }

    /**
     * Desactivación lógica (Borrado empresarial poniendo estado en 'I' o '0')
     */
    public function desactivarLogico($id) {
        // Cámbialo a '0' si tu columna maneja enteros en lugar de caracteres ('I')
        $query = "UPDATE " . $this->tabla . " SET estado = '0' WHERE id_usuario = :id";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>