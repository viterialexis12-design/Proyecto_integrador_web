<?php
// Backend/controllers/AuthController.php

class AuthController {
    private $db;

    public function __construct() {
        // Instanciar la conexión a la base de datos
        $conexion = new Conexion();
        $this->db = $conexion->obtenerConexion();
    }

    public function login() {
        // 1. Asegurarnos de que la petición sea POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método no permitido."]);
            return;
        }

        // 2. Leer el cuerpo de la petición (JSON enviado desde JS fetch)
        $inputData = json_decode(file_get_contents("php://input"), true);

        $email = $inputData['email'] ?? '';
        $password = $inputData['password'] ?? '';

        // Validar que no vengan vacíos
        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Datos incompletos."]);
            return;
        }

        try {
            // 3. Buscar al usuario y su Rol mediante un INNER JOIN
            // Asumimos que tienes tablas: usuarios y roles (relación de muchos a uno o uno a uno)
            $query = "SELECT u.id, u.nombre, u.password, r.nombre_rol 
                      FROM usuarios u
                      INNER JOIN roles r ON u.id_rol = r.id
                      WHERE u.email = :email LIMIT 1";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $usuario = $stmt->fetch();

            // 4. Verificar si el usuario existe y la contraseña coincide
            // Nota académica: Usa password_verify() si usaste password_hash() al registrarlo.
            // Si en tu BD están en texto plano (no recomendado), cambiarías a: if ($usuario && $password === $usuario['password'])
            if ($usuario && password_verify($password, $usuario['password'])) {
                
                // 5. Obtener los PERMISOS específicos de ese Rol
                // Asumimos tablas: roles_permisos y permisos
                $queryPermisos = "SELECT p.nombre_permiso 
                                  FROM permisos p
                                  INNER JOIN roles_permisos rp ON p.id = rp.id_permiso
                                  WHERE rp.id_rol = (SELECT id_rol FROM usuarios WHERE id = :user_id)";
                
                $stmtPermisos = $this->db->prepare($queryPermisos);
                $stmtPermisos->bindParam(':user_id', $usuario['id']);
                $stmtPermisos->execute();
                
                // Convertimos el resultado en un array simple de strings ['ver_dashboard', 'crear_usuarios']
                $permisos = $stmtPermisos->fetchAll(PDO::FETCH_COLUMN, 0);

                // 6. Responder con éxito al Frontend enviando el rol y los permisos
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Login exitoso.",
                    "nombre" => $usuario['nombre'],
                    "rol" => $usuario['nombre_rol'],
                    "permisos" => $permisos,
                    "token" => bin2hex(random_bytes(16)) // Un token simulado para el localStorage
                ]);

            } else {
                // Credenciales inválidas (No especificar si falló el correo o la contraseña por seguridad)
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos."]);
            }

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Error en el servidor: " . $e->getMessage()]);
        }
    }

    public function logout() {
        // En una API Stateless el logout real ocurre destruyendo el localStorage en el Front,
        // pero aquí puedes responder una confirmación o destruir sesiones PHP si las usaras.
        echo json_encode(["success" => true, "message" => "Sesión cerrada correctamente."]);
    }
}