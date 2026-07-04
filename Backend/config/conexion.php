<?php
// Backend/config/conexion.php

class Conexion {
    private $host = "localhost";
    private $db_name = "tu_base_datos"; // Cambia esto por el nombre real de tu BD
    private $username = "root";         // Usuario por defecto en AppServ
    private $password = "tu_password";   // Pon aquí la contraseña que configuraste en AppServ
    public $conn;

    public function obtenerConexion() {
        $this->conn = null;

        try {
            // Establecer la conexión con codificación UTF-8 para evitar problemas con eñes o acentos
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8",
                $this->username,
                $this->password
            );
            
            // Configurar PDO para que lance excepciones en caso de errores de SQL
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Configurar para que devuelva los datos como arrays asociativos por defecto
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
        } catch(PDOException $exception) {
            // En producción es mejor no mostrar el mensaje directo, pero para desarrollo académico es ideal
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Error de conexión a la base de datos: " . $exception->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}