<?php
class Empresa {
    private $conexion;
    private $tabla = "empresa";

    // Propiedades
    public $id;
    public $razonSocial;
    public $nombreComercial;
    public $ruc;
    public $dirMatriz;
    public $obligadoContabilidad;
    public $contribuyenteEspecial;

    public function __construct($db) {
        $this->conexion = $db;
    }

    // Obtener todos los registros
    public function obtenerTodos() {
        $query = "CALL sp_obtener_empresas()";
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener por ID
    public function obtenerPorId($id) {
        $query = "CALL sp_obtener_empresa_por_id(:id)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }


    // Actualizar registro
    public function actualizar() {
        $query = "CALL sp_actualizar_empresa(:id, :razonSocial, :nombreComercial, :ruc, :dirMatriz, :obligadoContabilidad, :contribuyenteEspecial)";
        $stmt = $this->conexion->prepare($query);

        // Limpiar datos
        $this->id = (int)$this->id;
        $this->razonSocial = htmlspecialchars(strip_tags($this->razonSocial));
        $this->nombreComercial = htmlspecialchars(strip_tags($this->nombreComercial));
        $this->ruc = htmlspecialchars(strip_tags($this->ruc));
        $this->dirMatriz = htmlspecialchars(strip_tags($this->dirMatriz));
        $this->obligadoContabilidad = htmlspecialchars(strip_tags($this->obligadoContabilidad));
        $this->contribuyenteEspecial = !empty($this->contribuyenteEspecial) ? htmlspecialchars(strip_tags($this->contribuyenteEspecial)) : null;

        // Vincular parámetros
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $stmt->bindParam(":razonSocial", $this->razonSocial);
        $stmt->bindParam(":nombreComercial", $this->nombreComercial);
        $stmt->bindParam(":ruc", $this->ruc);
        $stmt->bindParam(":dirMatriz", $this->dirMatriz);
        $stmt->bindParam(":obligadoContabilidad", $this->obligadoContabilidad);
        $stmt->bindParam(":contribuyenteEspecial", $this->contribuyenteEspecial);

        return $stmt->execute();
    }
}
?>