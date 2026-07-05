<?php
// Backend/index.php

// Usamos __DIR__ para asegurarnos de que la ruta sea absoluta desde la carpeta Backend
require_once __DIR__ . '/config/conexion.php';

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    echo "<h1>Conexión Exitosa</h1>";
    echo "Estado del servidor: " . $conn->host_info;
    
} catch (Exception $e) {
    echo "<h1>Error en el flujo:</h1> " . $e->getMessage();
}