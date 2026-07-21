<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Seguridad básica: Verificar sesión
if (!isset($_SESSION['id'])) {
    die("Acceso no autorizado.");
}

if (!isset($_GET['id'])) {
    die("ID de factura no proporcionado.");
}

require_once '../config/conexion.php';
require_once '../models/factura.php';
require_once '../lib/fpdf185/fpdf.php'; // Cambia esta ruta a donde tengas tu librería FPDF

global $conexion;
$id_factura = intval($_GET['id']);

$facturaModel = new Factura($conexion);
$cabecera = $facturaModel->obtenerFacturaCabecera($id_factura);
$detalles = $facturaModel->obtenerFacturaDetalle($id_factura);

if (!$cabecera) {
    die("La factura solicitada no existe.");
}

// --- GENERACIÓN DEL FORMATO PDF (ESTILO RIDE SRI) ---
$pdf = new FPDF('P', 'mm', 'A4');
$pdf->AddPage();
$pdf->SetFont('Arial', '', 10);

// Cuadro Izquierdo: Datos de la Empresa
$pdf->Rect(10, 10, 90, 45);
$pdf->SetXY(12, 12);
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(86, 5, utf8_decode($cabecera['empresa_nombre_comercial']), 0, 1);
$pdf->SetFont('Arial', '', 9);
$pdf->SetX(12);
$pdf->Cell(86, 5, utf8_decode("Razón Social: " . $cabecera['empresa_razon_social']), 0, 1);
$pdf->SetX(12);
$pdf->MultiCell(86, 4, utf8_decode("Dir. Matriz: " . $cabecera['empresa_direccion']), 0, 'L');
$pdf->SetX(12);
$pdf->Cell(86, 5, utf8_decode("Obligado a Llevar Contabilidad: " . $cabecera['empresa_obligado_contabilidad']), 0, 1);

// Cuadro Derecho: Datos de la Facturación Electrónica SRI
$pdf->Rect(105, 10, 95, 45);
$pdf->SetXY(107, 12);
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(91, 5, "R.U.C.: " . $cabecera['empresa_ruc'], 0, 1);
$pdf->SetX(107);
$pdf->Cell(91, 5, "F A C T U R A", 0, 1);
$pdf->SetFont('Arial', '', 9);
$pdf->SetX(107);
// Formateo del secuencial Ej: 001-001-000000001
$secuencialFormateado = str_pad($cabecera['factura_secuencial'], 9, "0", STR_PAD_LEFT);
$pdf->Cell(91, 5, utf8_decode("No. " . $cabecera['punto_emision_codigo'] . "-001-" . $secuencialFormateado), 0, 1);
$pdf->SetX(107);
$pdf->Cell(91, 5, utf8_decode("Fecha de Emisión: " . $cabecera['fecha_emision']), 0, 1);
$pdf->SetX(107);
$pdf->SetFont('Arial', 'B', 8);
$pdf->Cell(91, 4, utf8_decode("CLAVE DE ACCESO:"), 0, 1);
$pdf->SetX(107);
$pdf->SetFont('Arial', '', 7.5);
$pdf->Cell(91, 4, $cabecera['clave_acceso'], 0, 1);

$pdf->Ln(15);

// Cuadro Información del Cliente
$pdf->Rect(10, 60, 190, 20);
$pdf->SetXY(12, 62);
$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(120, 4, utf8_decode("Razón Social / Nombres y Apellidos: " . $cabecera['cliente_nombre_completo']), 0, 0);
$pdf->Cell(66, 4, utf8_decode("Identificación: " . $cabecera['cliente_identificacion']), 0, 1);
$pdf->SetX(12);
$pdf->SetFont('Arial', '', 9);
$pdf->Cell(120, 5, utf8_decode("Dirección: " . $cabecera['cliente_direccion']), 0, 0);
$pdf->Cell(66, 5, utf8_decode("Fecha Emisión: " . date("d/m/Y", strtotime($cabecera['fecha_emision']))), 0, 1);

$pdf->Ln(7);

// Tabla de Detalles (Productos)
$pdf->SetFont('Arial', 'B', 9);
$pdf->SetFillColor(230, 230, 230);
$pdf->Cell(20, 6, "Cant.", 1, 0, 'C', true);
$pdf->Cell(105, 6, utf8_decode("Descripción"), 1, 0, 'L', true);
$pdf->Cell(25, 6, "P. Unitario", 1, 0, 'R', true);
$pdf->Cell(15, 6, "IVA", 1, 0, 'C', true);
$pdf->Cell(25, 6, "Precio Total", 1, 1, 'R', true);

$pdf->SetFont('Arial', '', 9);
foreach ($detalles as $det) {
    $pdf->Cell(20, 6, number_format($det['cantidad'], 2), 1, 0, 'C');
    $pdf->Cell(105, 6, utf8_decode($det['producto_nombre']), 1, 0, 'L');
    $pdf->Cell(25, 6, "$ " . number_format($det['precio_unitario'], 2), 1, 0, 'R');
    $pdf->Cell(15, 6, number_format($det['tarifa_iva'], 0) . "%", 1, 0, 'C');
    $pdf->Cell(25, 6, "$ " . number_format($det['subtotal_detalle'], 2), 1, 1, 'R');
}

$pdf->Ln(5);

// Bloque de Totales (Alineado a la derecha)
$pdf->SetX(130);
$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(40, 5, "SUBTOTAL 0%:", 0, 0, 'L');
// Aquí puedes separar lógicas si manejas subtotal0 mediante filtros en el array o campos calculados
$pdf->SetFont('Arial', '', 9);
$pdf->Cell(30, 5, "$ " . number_format($cabecera['subtotal_factura'] - $cabecera['total_iva_factura'] / 0.15, 2), 0, 1, 'R'); // Cálculo dummy para muestra

$pdf->SetX(130);
$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(40, 5, "SUBTOTAL GRABADO:", 0, 0, 'L');
$pdf->SetFont('Arial', '', 9);
$pdf->Cell(30, 5, "$ " . number_format($cabecera['subtotal_factura'], 2), 0, 1, 'R');

$pdf->SetX(130);
$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(40, 5, "IVA 15%:", 0, 0, 'L');
$pdf->SetFont('Arial', '', 9);
$pdf->Cell(30, 5, "$ " . number_format($cabecera['total_iva_factura'], 2), 0, 1, 'R');

$pdf->SetX(130);
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(40, 6, "TOTAL A PAGAR:", 0, 0, 'L');
$pdf->Cell(30, 6, "$ " . number_format($cabecera['total_factura'], 2), 1, 1, 'R');

// Renderizado del PDF directo al navegador
$pdf->Output("I", "Factura_" . $cabecera['factura_id'] . ".pdf");