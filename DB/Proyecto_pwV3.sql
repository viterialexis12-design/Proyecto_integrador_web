-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 19-07-2026 a las 17:55:40
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `Proyecto_pw`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ActualizarMenu` (IN `p_id` INT, IN `p_nombre` VARCHAR(100), IN `p_descripcion` VARCHAR(255), IN `p_url` VARCHAR(255), IN `p_estado` INT, IN `p_id_menuPadre` INT)   BEGIN
    UPDATE menu 
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        url = p_url,
        estado = p_estado,
        id_menuPadre = p_id_menuPadre
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ActualizarPermiso` (IN `p_id` INT, IN `p_id_rol` INT, IN `p_id_menu` INT)   BEGIN
    UPDATE permiso 
    SET id_rol = p_id_rol, id_menu = p_id_menu 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ActualizarRol` (IN `p_id` INT, IN `p_nombre` VARCHAR(100), IN `p_descripcion` VARCHAR(255), IN `p_estado` INT)   BEGIN
    UPDATE rol 
    SET nombre = p_nombre, 
        descripcion = p_descripcion, 
        estado = p_estado 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ActualizarUsuario` (IN `p_id` INT, IN `p_nombre1` VARCHAR(50), IN `p_nombre2` VARCHAR(50), IN `p_apellido1` VARCHAR(50), IN `p_apellido2` VARCHAR(50), IN `p_cedula` VARCHAR(10), IN `p_correo` VARCHAR(100), IN `p_fecha_nacimiento` DATE, IN `p_foto_perfil` VARCHAR(255), IN `p_telefono` VARCHAR(20), IN `p_username` VARCHAR(50), IN `p_clave` VARCHAR(255), IN `p_id_rol` INT, IN `p_id_empresa` INT, IN `p_estado` TINYINT(1))   BEGIN
    UPDATE usuario 
    SET 
        nombre1 = p_nombre1, 
        nombre2 = p_nombre2, 
        apellido1 = p_apellido1, 
        apellido2 = p_apellido2,
        cedula = p_cedula, 
        correo = p_correo, 
        fecha_nacimiento = p_fecha_nacimiento, 
        foto_perfil = p_foto_perfil,
        telefono = p_telefono, 
        username = p_username, 
        clave = p_clave, 
        id_rol = p_id_rol, 
        id_empresa = p_id_empresa,
        estado = p_estado
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_actualizar_categoria` (IN `p_id` INT, IN `p_nombre` VARCHAR(100), IN `p_descripcion` VARCHAR(255), IN `p_estado` TINYINT, IN `p_id_ivaSRI` INT)   BEGIN
    UPDATE categoria 
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        estado = p_estado,
        id_ivaSRI = p_id_ivaSRI
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_actualizar_cliente` (IN `p_id` INT, IN `p_nombre1` VARCHAR(50), IN `p_nombre2` VARCHAR(50), IN `p_apellido1` VARCHAR(50), IN `p_apellido2` VARCHAR(50), IN `p_identificacion` VARCHAR(20), IN `p_tipoIdentificacion` VARCHAR(2), IN `p_correo` VARCHAR(100), IN `p_direccion` VARCHAR(255), IN `p_telefono` VARCHAR(20), IN `p_estado` TINYINT)   BEGIN
    UPDATE cliente 
    SET nombre1 = p_nombre1,
        nombre2 = p_nombre2,
        apellido1 = p_apellido1,
        apellido2 = p_apellido2,
        identificacion = p_identificacion,
        tipoIdentificacion = p_tipoIdentificacion,
        correo = p_correo,
        direccion = p_direccion,
        telefono = p_telefono,
        estado = p_estado
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_actualizar_empresa` (IN `p_id` INT, IN `p_razonSocial` VARCHAR(255), IN `p_nombreComercial` VARCHAR(255), IN `p_ruc` VARCHAR(13), IN `p_dirMatriz` VARCHAR(255), IN `p_obligadoContabilidad` VARCHAR(2), IN `p_contribuyenteEspecial` VARCHAR(20))   BEGIN
    UPDATE empresa 
    SET razonSocial = p_razonSocial,
        nombreComercial = p_nombreComercial,
        ruc = p_ruc,
        dirMatriz = p_dirMatriz,
        obligadoContabilidad = p_obligadoContabilidad,
        contribuyenteEspecial = p_contribuyenteEspecial
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_actualizar_producto` (IN `p_id` INT, IN `p_nombre` VARCHAR(150), IN `p_descripcion` VARCHAR(255), IN `p_unidadMedida` VARCHAR(20), IN `p_precioUnitario` DECIMAL(14,4), IN `p_stockActual` DECIMAL(14,2), IN `p_estado` TINYINT, IN `p_id_categoria` INT)   BEGIN
    UPDATE producto 
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        unidadMedida = p_unidadMedida,
        precioUnitario = p_precioUnitario,
        stockActual = p_stockActual,
        estado = p_estado,
        id_categoria = p_id_categoria
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_actualizar_punto_emision` (IN `p_id` INT, IN `p_nombre` VARCHAR(50), IN `p_codigoSRI` VARCHAR(3), IN `p_secuencial` INT, IN `p_estado` TINYINT, IN `p_id_empresa` INT, IN `p_id_usuario` INT)   BEGIN
    UPDATE puntoEmision 
    SET nombre = p_nombre,
        codigoSRI = p_codigoSRI,
        secuencial = p_secuencial,
        estado = p_estado,
        id_empresa = p_id_empresa,
        id_usuario = p_id_usuario
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_CrearMenu` (IN `p_nombre` VARCHAR(100), IN `p_descripcion` VARCHAR(255), IN `p_url` VARCHAR(255), IN `p_estado` INT, IN `p_id_menuPadre` INT)   BEGIN
    INSERT INTO menu (nombre, descripcion, url, estado, id_menuPadre)
    VALUES (p_nombre, p_descripcion, p_url, p_estado, p_id_menuPadre);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_CrearPermiso` (IN `p_id_rol` INT, IN `p_id_menu` INT)   BEGIN
    INSERT INTO permiso (id_rol, id_menu) 
    VALUES (p_id_rol, p_id_menu);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_CrearRol` (IN `p_nombre` VARCHAR(100), IN `p_descripcion` VARCHAR(255))   BEGIN
    INSERT INTO rol (nombre, descripcion, estado) 
    VALUES (p_nombre, p_descripcion, 1);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_CrearUsuario` (IN `p_nombre1` VARCHAR(50), IN `p_nombre2` VARCHAR(50), IN `p_apellido1` VARCHAR(50), IN `p_apellido2` VARCHAR(50), IN `p_cedula` VARCHAR(10), IN `p_correo` VARCHAR(100), IN `p_fecha_nacimiento` DATE, IN `p_foto_perfil` VARCHAR(255), IN `p_telefono` VARCHAR(20), IN `p_username` VARCHAR(50), IN `p_clave` VARCHAR(255), IN `p_id_rol` INT, IN `p_id_empresa` INT, IN `p_estado` TINYINT(1))   BEGIN
    INSERT INTO usuario (
        nombre1, nombre2, apellido1, apellido2, cedula, 
        correo, fecha_nacimiento, foto_perfil, telefono, 
        username, clave, id_rol, id_empresa, estado
    ) 
    VALUES (
        p_nombre1, p_nombre2, p_apellido1, p_apellido2, p_cedula, 
        p_correo, p_fecha_nacimiento, p_foto_perfil, p_telefono, 
        p_username, p_clave, p_id_rol, p_id_empresa, p_estado
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_categoria` (IN `p_nombre` VARCHAR(100), IN `p_descripcion` VARCHAR(255), IN `p_id_ivaSRI` INT)   BEGIN
    INSERT INTO categoria (nombre, descripcion, estado, id_ivaSRI)
    VALUES (p_nombre, p_descripcion, 1, p_id_ivaSRI);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_cliente` (IN `p_nombre1` VARCHAR(50), IN `p_nombre2` VARCHAR(50), IN `p_apellido1` VARCHAR(50), IN `p_apellido2` VARCHAR(50), IN `p_identificacion` VARCHAR(20), IN `p_tipoIdentificacion` VARCHAR(2), IN `p_correo` VARCHAR(100), IN `p_direccion` VARCHAR(255), IN `p_telefono` VARCHAR(20))   BEGIN
    INSERT INTO cliente (nombre1, nombre2, apellido1, apellido2, identificacion, tipoIdentificacion, correo, direccion, telefono, estado)
    VALUES (p_nombre1, p_nombre2, p_apellido1, p_apellido2, p_identificacion, p_tipoIdentificacion, p_correo, p_direccion, p_telefono, 1);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_factura` (IN `p_claveAcceso` VARCHAR(49), IN `p_subtotal` DECIMAL(14,2), IN `p_totalIva` DECIMAL(14,2), IN `p_importeTotal` DECIMAL(14,2), IN `p_id_cliente` INT, IN `p_id_usuario` INT, OUT `p_id_factura_generada` INT)   BEGIN
    -- Insertamos la cabecera usando valores por defecto requeridos para el SRI
    INSERT INTO factura (
        claveAcceso,
        fechaEmision,
        subtotal,
        totalIva,
        importeTotal,
        codigoSriPago,
        estadoSri,
        id_empresa,
        id_puntoEmision,
        id_cliente,
        id_usuario
    )
    VALUES (
        p_claveAcceso,
        NOW(),
        p_subtotal,
        p_totalIva,
        p_importeTotal,
        '01',       -- 01 = Sin utilización del sistema financiero (Efectivo/Otros)
        'PENDIENTE', -- Estado inicial antes de firmar/enviar al SRI
        1,          -- id_empresa por defecto de tu volcado (Minimarket San Jose)
        1,          -- id_puntoEmision por defecto (Debe existir en tu tabla)
        p_id_cliente,
        p_id_usuario
    );

    -- Retornamos el ID autoincremental de la factura creada para usarlo en los detalles
    SET p_id_factura_generada = LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_producto` (IN `p_nombre` VARCHAR(150), IN `p_descripcion` VARCHAR(255), IN `p_unidadMedida` VARCHAR(20), IN `p_precioUnitario` DECIMAL(14,4), IN `p_stockActual` DECIMAL(14,2), IN `p_id_categoria` INT)   BEGIN
    INSERT INTO producto (nombre, descripcion, unidadMedida, precioUnitario, stockActual, estado, id_categoria)
    VALUES (p_nombre, p_descripcion, p_unidadMedida, p_precioUnitario, p_stockActual, 1, p_id_categoria);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_punto_emision` (IN `p_nombre` VARCHAR(50), IN `p_codigoSRI` VARCHAR(3), IN `p_secuencial` INT, IN `p_estado` TINYINT, IN `p_id_empresa` INT, IN `p_id_usuario` INT)   BEGIN
    INSERT INTO puntoEmision (nombre, codigoSRI, secuencial, estado, id_empresa, id_usuario)
    VALUES (p_nombre, p_codigoSRI, IFNULL(p_secuencial, 1), IFNULL(p_estado, 1), p_id_empresa, p_id_usuario);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DesactivarMenu` (IN `p_id` INT)   BEGIN
    UPDATE menu SET estado = 0 WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DesactivarRol` (IN `p_id` INT)   BEGIN
    UPDATE rol 
    SET estado = 0 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DesactivarUsuario` (IN `p_id` INT)   BEGIN
    UPDATE usuario SET estado = 0 WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_EliminarPermiso` (IN `p_id` INT)   BEGIN
    DELETE FROM permiso WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_eliminar_categoria` (IN `p_id` INT)   BEGIN
    UPDATE categoria 
    SET estado = 0 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_eliminar_cliente` (IN `p_id` INT)   BEGIN
    UPDATE cliente 
    SET estado = 0 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_eliminar_producto` (IN `p_id` INT)   BEGIN
    UPDATE producto 
    SET estado = 0 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_eliminar_punto_emision` (IN `p_id` INT)   BEGIN
    UPDATE puntoEmision 
    SET estado = 0 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GuardarMatrizPermisos` (IN `p_id_rol` INT, IN `p_menus_csv` TEXT)   BEGIN
    -- Declaramos manejador de errores para revertir si algo falla
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al actualizar la matriz de permisos en la base de datos.';
    END;

    START TRANSACTION;

    -- 1. Limpiamos permisos anteriores
    DELETE FROM permiso WHERE id_rol = p_id_rol;

    -- 2. Validamos e insertamos los nuevos registros mapeando el CSV
    IF p_menus_csv IS NOT NULL AND p_menus_csv != '' THEN
        -- Insertamos usando un truco nativo para iterar el String separado por comas
        INSERT INTO permiso (id_rol, id_menu)
        SELECT p_id_rol, m.id
        FROM menu m
        WHERE FIND_IN_SET(m.id, p_menus_csv) > 0;
    END IF;

    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerMatrizPorRol` (IN `p_id_rol` INT)   BEGIN
    SELECT 
        m.id AS id_menu_catalogo,
        m.nombre AS nombre_menu,
        m.id_menuPadre,
        CASE WHEN p.id IS NOT NULL THEN 1 ELSE 0 END AS tiene_permiso
    FROM menu m
    LEFT JOIN permiso p ON p.id_menu = m.id AND p.id_rol = p_id_rol
    WHERE m.estado = 1
    ORDER BY m.id_menuPadre ASC, m.id ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerMenusPorRol` (IN `p_id_rol` INT)   BEGIN
    SELECT m.id, m.nombre, m.descripcion, m.url, m.estado, m.id_menuPadre
    FROM menu m
    INNER JOIN permiso p ON p.id_menu = m.id
    WHERE p.id_rol = p_id_rol AND m.estado = 1
    ORDER BY m.nombre;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerRolUsuario` (IN `p_id_usuario` INT)   BEGIN
    SELECT r.nombre 
    FROM usuario u
    INNER JOIN rol r ON u.id_rol = r.id
    WHERE u.id = p_id_usuario 
    LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerTodosPermisos` ()   BEGIN
    SELECT p.id, p.id_rol, p.id_menu, 
           r.nombre AS nombre_rol, 
           m.nombre AS nombre_menu,
           m.id_menuPadre
    FROM permiso p
    INNER JOIN rol r ON p.id_rol = r.id
    INNER JOIN menu m ON p.id_menu = m.id
    ORDER BY m.id_menuPadre ASC, m.id ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerTodosRoles` ()   BEGIN
    SELECT id, nombre, descripcion, estado 
    FROM rol 
    ORDER BY id DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerTodosUsuarios` ()   BEGIN
    SELECT 
        u.id, 
        u.nombre1, 
        u.nombre2, 
        u.apellido1, 
        u.apellido2, 
        u.cedula, 
        u.correo, 
        u.fecha_nacimiento,
        u.foto_perfil,
        u.telefono,
        u.username, 
        u.estado, 
        u.id_rol,
        u.id_empresa,
        r.nombre AS nombre_rol
    FROM usuario u
    LEFT JOIN rol r ON u.id_rol = r.id
    ORDER BY u.id DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerUsuarioPorId` (IN `p_id` INT)   BEGIN
    SELECT 
        id, nombre1, nombre2, apellido1, apellido2, 
        cedula, correo, fecha_nacimiento, foto_perfil, 
        telefono, username, clave, estado, id_rol, id_empresa
    FROM usuario 
    WHERE id = p_id 
    LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_categorias` ()   BEGIN
    SELECT id, nombre, descripcion, estado, id_ivaSRI 
    FROM categoria;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_categoria_por_id` (IN `p_id` INT)   BEGIN
    SELECT id, nombre, descripcion, estado, id_ivaSRI 
    FROM categoria 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_clientes` ()   BEGIN
    SELECT id, nombre1, nombre2, apellido1, apellido2, identificacion, tipoIdentificacion, correo, direccion, telefono, estado 
    FROM cliente;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_cliente_por_id` (IN `p_id` INT)   BEGIN
    SELECT id, nombre1, nombre2, apellido1, apellido2, identificacion, tipoIdentificacion, correo, direccion, telefono, estado 
    FROM cliente 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_empresas` ()   BEGIN
    SELECT id, razonSocial, nombreComercial, ruc, dirMatriz, obligadoContabilidad, contribuyenteEspecial 
    FROM empresa;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_empresa_por_id` (IN `p_id` INT)   BEGIN
    SELECT id, razonSocial, nombreComercial, ruc, dirMatriz, obligadoContabilidad, contribuyenteEspecial 
    FROM empresa 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_productos` (IN `p_solo_alerta` TINYINT)   BEGIN
    IF p_solo_alerta = 1 THEN
        -- Retorna solo los productos activos con stock crítico
        SELECT p.id, p.nombre, p.descripcion, p.unidadMedida, p.precioUnitario, p.stockActual, p.estado, p.id_categoria, c.nombre AS categoria_nombre
        FROM producto p
        INNER JOIN categoria c ON p.id_categoria = c.id
        WHERE p.estado = 1 AND p.stockActual <= 10.00;
    ELSE
        -- Retorna todo el universo de productos (Comportamiento original)
        SELECT p.id, p.nombre, p.descripcion, p.unidadMedida, p.precioUnitario, p.stockActual, p.estado, p.id_categoria, c.nombre AS categoria_nombre
        FROM producto p
        INNER JOIN categoria c ON p.id_categoria = c.id;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_producto_por_id` (IN `p_id` INT)   BEGIN
    SELECT id, nombre, descripcion, unidadMedida, precioUnitario, stockActual, estado, id_categoria 
    FROM producto 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_puntos_emision` ()   BEGIN
    SELECT id, nombre, codigoSRI, secuencial, estado, id_empresa, id_usuario 
    FROM puntoEmision;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_punto_emision_por_id` (IN `p_id` INT)   BEGIN
    SELECT id, nombre, codigoSRI, secuencial, estado, id_empresa, id_usuario 
    FROM puntoEmision 
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_movimiento_egreso` (IN `p_tipoMovimiento` INT, IN `p_cantidad` DECIMAL(14,2), IN `p_observacion` VARCHAR(255), IN `p_id_producto` INT, IN `p_id_usuario` INT)   BEGIN
    INSERT INTO movimientos (
        nombreProveedor, -- Queda en NULL porque un egreso/merma no tiene proveedor
        tipoMovimiento, 
        cantidad, 
        fecha, 
        observacion, 
        id_producto, 
        id_usuario, 
        id_factura
    )
    VALUES (
        NULL, 
        p_tipoMovimiento, 
        p_cantidad, 
        NOW(), 
        p_observacion, 
        p_id_producto, 
        p_id_usuario, 
        NULL
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_movimiento_ingreso` (IN `p_nombreProveedor` VARCHAR(150), IN `p_tipoMovimiento` INT, IN `p_cantidad` DECIMAL(14,2), IN `p_observacion` VARCHAR(255), IN `p_id_producto` INT, IN `p_id_usuario` INT)   BEGIN
    INSERT INTO movimientos (
        nombreProveedor, 
        tipoMovimiento, 
        cantidad, 
        fecha, 
        observacion, 
        id_producto, 
        id_usuario, 
        id_factura
    )
    VALUES (
        p_nombreProveedor, 
        p_tipoMovimiento, 
        p_cantidad, 
        NOW(), 
        p_observacion, 
        p_id_producto, 
        p_id_usuario, 
        NULL
    );
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `id_ivaSRI` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id`, `nombre`, `descripcion`, `estado`, `id_ivaSRI`) VALUES
(1, 'Frutas y Verduras', 'Productos frescos como frutas y verduras', 1, 3),
(2, 'Carnes y Embutidos', 'Carnes de res, pollo, cerdo, pescado y embutidos.', 1, 3),
(3, 'Lácteos', 'Leche, queso, yogur y otros derivados.', 1, 3),
(4, 'Abarrotes', 'Productos básicos de despensa y consumo diario.', 1, 3),
(5, 'Limpieza e Higiene', 'Artículos de limpieza del hogar e higiene personal.', 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id` int(11) NOT NULL,
  `nombre1` varchar(50) NOT NULL,
  `nombre2` varchar(50) DEFAULT NULL,
  `apellido1` varchar(50) NOT NULL,
  `apellido2` varchar(50) DEFAULT NULL,
  `identificacion` varchar(20) NOT NULL,
  `tipoIdentificacion` varchar(2) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id`, `nombre1`, `nombre2`, `apellido1`, `apellido2`, `identificacion`, `tipoIdentificacion`, `correo`, `direccion`, `telefono`, `estado`) VALUES
(1, 'CONSUMIDOR', 'FINAL', 'DE', 'PRUEBA', '9999999999999', '07', 'consumidor@final.com', 'Quito, Ecuador', '0999999999', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalleFactura`
--

CREATE TABLE `detalleFactura` (
  `id` int(11) NOT NULL,
  `cantidad` decimal(14,2) NOT NULL,
  `precio_unitario` decimal(14,4) NOT NULL,
  `precioTotalSinImpuesto` decimal(14,2) NOT NULL,
  `tarifa_iva` decimal(5,2) NOT NULL,
  `valorIva` decimal(14,2) NOT NULL,
  `id_factura` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalleFactura`
--

INSERT INTO `detalleFactura` (`id`, `cantidad`, `precio_unitario`, `precioTotalSinImpuesto`, `tarifa_iva`, `valorIva`, `id_factura`, `id_producto`) VALUES
(1, 3.00, 5.3000, 15.90, 15.00, 2.39, 3, 1);

--
-- Disparadores `detalleFactura`
--
DELIMITER $$
CREATE TRIGGER `tg_procesar_venta_detalle` AFTER INSERT ON `detalleFactura` FOR EACH ROW BEGIN
    -- Obtenemos el id_usuario desde la factura para saber quién la hizo
    SET @v_id_usuario = (SELECT id_usuario FROM factura WHERE id = NEW.id_factura);

    -- Insertamos el movimiento tipo 3 (VENTA). El trigger de arriba (tg_actualizar_stock_movimientos)
    -- se encargará de restar el stock automáticamente al ver este insert.
    INSERT INTO movimientos (
        nombreProveedor,
        tipoMovimiento,
        cantidad,
        fecha,
        observacion,
        id_producto,
        id_usuario,
        id_factura
    )
    VALUES (
        NULL,
        3, -- 3 = VENTA
        NEW.cantidad,
        NOW(),
        CONCAT('Salida por Venta - Factura N.- ', NEW.id_factura),
        NEW.id_producto,
        @v_id_usuario,
        NEW.id_factura
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id` int(11) NOT NULL,
  `razonSocial` varchar(255) NOT NULL,
  `nombreComercial` varchar(255) NOT NULL,
  `ruc` varchar(13) NOT NULL,
  `dirMatriz` varchar(255) NOT NULL,
  `obligadoContabilidad` varchar(2) NOT NULL DEFAULT 'NO',
  `contribuyenteEspecial` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`id`, `razonSocial`, `nombreComercial`, `ruc`, `dirMatriz`, `obligadoContabilidad`, `contribuyenteEspecial`) VALUES
(1, 'Minimarket San Jose', 'Mini San Jose', '1793456789001', 'Av. Los Pinos y Calle Principal, Quito, Ecuador', 'NO', 'NO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id` int(11) NOT NULL,
  `claveAcceso` varchar(49) NOT NULL,
  `fechaEmision` timestamp NOT NULL DEFAULT current_timestamp(),
  `subtotal` decimal(14,2) NOT NULL,
  `totalIva` decimal(14,2) NOT NULL,
  `importeTotal` decimal(14,2) NOT NULL,
  `codigoSriPago` varchar(2) NOT NULL DEFAULT '01',
  `estadoSri` varchar(20) NOT NULL DEFAULT 'PAGADO',
  `id_empresa` int(11) NOT NULL,
  `id_puntoEmision` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `factura`
--

INSERT INTO `factura` (`id`, `claveAcceso`, `fechaEmision`, `subtotal`, `totalIva`, `importeTotal`, `codigoSriPago`, `estadoSri`, `id_empresa`, `id_puntoEmision`, `id_cliente`, `id_usuario`) VALUES
(3, '01072026011793456789001200100165229916123456781', '2026-07-19 02:08:57', 15.90, 2.38, 18.28, '01', 'PENDIENTE', 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ivaSRI`
--

CREATE TABLE `ivaSRI` (
  `id` int(11) NOT NULL,
  `codigoSri` varchar(10) NOT NULL,
  `porcentaje` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ivaSRI`
--

INSERT INTO `ivaSRI` (`id`, `codigoSri`, `porcentaje`) VALUES
(1, '0', '0'),
(2, '2', '12'),
(3, '3', '14'),
(4, '4', '15'),
(5, '5', '5'),
(6, '10', '13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `id_menuPadre` int(11) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menu`
--

INSERT INTO `menu` (`id`, `nombre`, `descripcion`, `url`, `id_menuPadre`, `estado`) VALUES
(1, 'Gestion de usuarios', 'Gestiona los usuarios', NULL, NULL, 1),
(2, 'Gestion de roles', 'Gestiona los roles', NULL, NULL, 1),
(3, 'Gestion de menus', 'Gestiona los menusitos', '', NULL, 1),
(4, 'Gestion de permisos', 'Gestiona los permisos', '', NULL, 1),
(5, 'Crear Usuario', 'Ingrese nuevos usuarios', 'crear_usuario.html', 1, 1),
(6, 'Actualizar usuario', 'Corrija informacion de un usuario', 'actualizar_usuario.html', 1, 1),
(7, 'Ver usuarios', 'Lista con todos los usuarios', 'ver_usuarios.html', 1, 1),
(8, 'Eliminar usuario', 'Elimine un usuario', 'eliminar_usuario.html', 1, 1),
(9, 'Ver roles', 'Listar los roles existentes', 'ver_roles.html', 2, 1),
(10, 'Actualizar rol', 'Actualizar un rol existente', 'actualizar_roles.html', 2, 1),
(11, 'Borrar rol', 'Borrar un rol', 'borrar_roles.html', 2, 1),
(12, 'Crear rol', 'Listar los roles existentes', 'crear_rol.html', 2, 1),
(13, 'Crear Menu/Submenu', 'Crear un menu o submenu', 'crear_menu.html', 3, 1),
(14, 'Ver Menu/Submenu', 'Listar los menus y submenus creados', 'ver_menu.html', 3, 1),
(15, 'Actualizar Menu/Submenu', 'Editar un menu o submenu', 'actualizar_menu.html', 3, 1),
(16, 'Borrar Menu/Submenu', 'Eliminar un menu o submenu', 'borrar_menu.html', 3, 1),
(18, 'Ver Permisos', 'Listar los permisos de los roles', 'ver_permiso.html', 4, 1),
(20, 'Actualizar Permiso', 'Editar permisos de un rol', 'actualizar_permiso.html', 4, 1),
(24, 'Ventas', 'Permite vender', '', NULL, 1),
(25, 'hacer una venta', 'hace una venta', 'hacer_venta.html', 24, 1),
(26, 'Empresa', 'Datos generales de la empresa, necesario para facturacion', '', NULL, 1),
(27, 'Ver empresa', 'Visualizar los datos de la empresa', 'ver_empresa.html', 26, 1),
(28, 'Actualizar empresa', 'Actualiza los datos de la empresa', 'actualizar_empresa.html', 26, 1),
(29, 'Puntos de emision', 'Gesione los puntos de emision de su empresa', '', NULL, 1),
(30, 'Ver Puntos', 'Liste los puntos de emision de su empresa', 'ver_puntos.html', 29, 1),
(31, 'Crear Punto', 'Creee un nuevo punto de emision', 'crear_puntos.html', 29, 1),
(32, 'Editar Punto', 'Actualiza los datos de un punto de emision', 'actualizar_punto.html', 29, 1),
(33, 'Eliminar punto de emision', 'Elimine puntos de emision de su sistema', 'borrar_punto.html', 29, 1),
(34, 'Clientes', 'Gestione aqui sus clientes', '', NULL, 1),
(35, 'Ver clientes', 'Liste los clientes registrados en el sistema', 'ver_clientes.html', 34, 1),
(36, 'Editar Cliente', 'Actualize o corrija datos de un cliente', 'actualizar_clientes.html', 34, 1),
(37, 'Eliminar Cliente', 'Desactive a un cliente de su sistema', 'borrar_clientes.html', 34, 1),
(38, 'Crear cliente', 'Registe a un cliente en su empresa', 'crear_cliente.html', 34, 1),
(39, 'Categorias', 'Categorias de los productos que comercia su empresa', '', NULL, 1),
(40, 'Ver Categorias', 'Liste las categorias existentes en su sistema', 'ver_categoria.html', 39, 1),
(41, 'Eliminar categoria', 'Desactive una categoria del sistema', 'borrar_categorias.html', 39, 1),
(42, 'Editar Categoria', 'Permite actualizar los datos de una categoria', 'actualizar_categorias.html', 39, 1),
(43, 'Crear categoria', 'Genere una nueva categoría para sus productos', 'crear_categorias.html', 39, 1),
(44, 'Productos', 'Gestione los productos que oferta', '', NULL, 1),
(45, 'Crear Producto', 'Registre un nuevo producto dentro de sus sistema', 'crear_producto.html', 44, 1),
(46, 'Editar Producto', 'Actualice los datos de un producto', 'actualizar_producto.html', 44, 1),
(47, 'Eliminar Producto', 'Desactive un producto de su sistema', 'borrar_producto.html', 44, 1),
(48, 'Ver Productos', 'Liste los productos registrados en su sistema', 'ver_producto.html', 44, 1),
(49, 'Inventario', 'Ingrese o elimine productos, vea el inventario ', '', NULL, 1),
(50, 'Ver inventario', 'Vea el inventario con alertas por stock', 'ver_inventario.html', 49, 1),
(51, 'Registrar Ingreso', 'Ingrese Productos al inventario', 'registrar_ingreso.html', 49, 1),
(52, 'Registrar Egreso', 'Saque productos que no se vendieron', 'registrar_egreso.html', 49, 1);

--
-- Disparadores `menu`
--
DELIMITER $$
CREATE TRIGGER `tg_DesactivarHijosMenu` AFTER UPDATE ON `menu` FOR EACH ROW BEGIN
    -- Si el menú cambió su estado a 0 (desactivado)
    IF OLD.estado = 1 AND NEW.estado = 0 THEN
        UPDATE menu 
        SET estado = 0 
        WHERE id_menuPadre = NEW.id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `nombreProveedor` varchar(150) DEFAULT NULL,
  `tipoMovimiento` int(11) NOT NULL,
  `cantidad` decimal(14,2) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `observacion` varchar(255) DEFAULT NULL,
  `id_producto` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_factura` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`id`, `nombreProveedor`, `tipoMovimiento`, `cantidad`, `fecha`, `observacion`, `id_producto`, `id_usuario`, `id_factura`) VALUES
(1, 'Don Pepe', 1, 5.00, '2026-07-19 01:41:34', 'Todo bien', 1, 1, NULL),
(2, NULL, 2, 18.00, '2026-07-19 01:49:24', 'Se pudrieron las papas', 1, 1, NULL),
(3, NULL, 3, 3.00, '2026-07-19 02:08:57', 'Salida por Venta - Factura N.- 3', 1, 1, 3);

--
-- Disparadores `movimientos`
--
DELIMITER $$
CREATE TRIGGER `tg_actualizar_stock_movimientos` AFTER INSERT ON `movimientos` FOR EACH ROW BEGIN
    IF NEW.tipoMovimiento = 1 THEN
        UPDATE producto SET stockActual = stockActual + NEW.cantidad WHERE id = NEW.id_producto;
    -- Tanto el egreso manual (2) como la venta (3) restan stock
    ELSEIF NEW.tipoMovimiento = 2 OR NEW.tipoMovimiento = 3 THEN
        UPDATE producto SET stockActual = stockActual - NEW.cantidad WHERE id = NEW.id_producto;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso`
--

CREATE TABLE `permiso` (
  `id` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `id_menu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permiso`
--

INSERT INTO `permiso` (`id`, `id_rol`, `id_menu`) VALUES
(81, 2, 1),
(82, 2, 2),
(83, 2, 7),
(84, 2, 9),
(496, 1, 1),
(497, 1, 2),
(498, 1, 3),
(499, 1, 4),
(500, 1, 24),
(501, 1, 26),
(502, 1, 29),
(503, 1, 34),
(504, 1, 39),
(505, 1, 44),
(506, 1, 49),
(507, 1, 5),
(508, 1, 6),
(509, 1, 7),
(510, 1, 8),
(511, 1, 9),
(512, 1, 10),
(513, 1, 11),
(514, 1, 12),
(515, 1, 13),
(516, 1, 14),
(517, 1, 15),
(518, 1, 16),
(519, 1, 18),
(520, 1, 20),
(521, 1, 25),
(522, 1, 27),
(523, 1, 28),
(524, 1, 30),
(525, 1, 31),
(526, 1, 32),
(527, 1, 33),
(528, 1, 35),
(529, 1, 36),
(530, 1, 37),
(531, 1, 38),
(532, 1, 40),
(533, 1, 41),
(534, 1, 42),
(535, 1, 43),
(536, 1, 45),
(537, 1, 46),
(538, 1, 47),
(539, 1, 48),
(540, 1, 50),
(541, 1, 51),
(542, 1, 52);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `unidadMedida` varchar(20) DEFAULT 'UNIDAD',
  `precioUnitario` decimal(14,4) NOT NULL,
  `stockActual` decimal(14,2) NOT NULL DEFAULT 0.00,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `descripcion`, `unidadMedida`, `precioUnitario`, `stockActual`, `estado`, `id_categoria`) VALUES
(1, 'Papas', 'Bulto de papas', 'UNIDAD', 5.3000, 4.00, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntoEmision`
--

CREATE TABLE `puntoEmision` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `codigoSRI` varchar(3) NOT NULL,
  `secuencial` int(11) NOT NULL DEFAULT 1,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `id_empresa` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `puntoEmision`
--

INSERT INTO `puntoEmision` (`id`, `nombre`, `codigoSRI`, `secuencial`, `estado`, `id_empresa`, `id_usuario`) VALUES
(1, 'Matriz', '001', 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'SA', 'Super administrador del sistema', 1),
(2, 'Supervisor', 'Supervisa', 1);

--
-- Disparadores `rol`
--
DELIMITER $$
CREATE TRIGGER `tg_InactivarPermisosPorRol` AFTER UPDATE ON `rol` FOR EACH ROW BEGIN
    -- Si el rol pasa de activo a inactivo
    IF OLD.estado = 1 AND NEW.estado = 0 THEN
        -- Opción A: Si tu tabla permiso usa borrado físico
        DELETE FROM permiso WHERE id_rol = NEW.id;
        
        -- Opción B (Descomenta si usas estado en permisos):
        -- UPDATE permiso SET estado = 0 WHERE id_rol = NEW.id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre1` varchar(50) NOT NULL,
  `nombre2` varchar(50) DEFAULT NULL,
  `apellido1` varchar(50) NOT NULL,
  `apellido2` varchar(50) DEFAULT NULL,
  `cedula` varchar(10) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `id_rol` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre1`, `nombre2`, `apellido1`, `apellido2`, `cedula`, `correo`, `fecha_nacimiento`, `foto_perfil`, `telefono`, `username`, `clave`, `estado`, `id_rol`, `id_empresa`) VALUES
(1, 'Admin', NULL, 'Sistema', NULL, '1234567890', 'admin@sistema.com', '1990-01-01', NULL, '0999999999', 'admin', '$2y$10$fgh8DXCcOhLknzfQbxIVoutgnemloD3LU5bjny10f/fxaLygyHfeK', 1, 1, 1),
(2, 'Alexis', '', 'Viteri', '', '1727753970', 'ajviteri@espe.com', '2020-01-07', NULL, '0983785507', 'ajviteri2', '$2y$10$6mgonBShS/xt1zK3nqodDOTc5Ahj.siNsuz5EXcclbi8i9KmYj.ze', 1, 2, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_ivaSRI` (`id_ivaSRI`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identificacion` (`identificacion`);

--
-- Indices de la tabla `detalleFactura`
--
ALTER TABLE `detalleFactura`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_factura` (`id_factura`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ruc` (`ruc`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `claveAcceso` (`claveAcceso`),
  ADD KEY `id_empresa` (`id_empresa`),
  ADD KEY `id_puntoEmision` (`id_puntoEmision`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `ivaSRI`
--
ALTER TABLE `ivaSRI`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_menuPadre` (`id_menuPadre`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_factura` (`id_factura`);

--
-- Indices de la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `id_menu` (`id_menu`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `puntoEmision`
--
ALTER TABLE `puntoEmision`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_empresa` (`id_empresa`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `id_empresa` (`id_empresa`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `detalleFactura`
--
ALTER TABLE `detalleFactura`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ivaSRI`
--
ALTER TABLE `ivaSRI`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `permiso`
--
ALTER TABLE `permiso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=543;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `puntoEmision`
--
ALTER TABLE `puntoEmision`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD CONSTRAINT `categoria_ibfk_1` FOREIGN KEY (`id_ivaSRI`) REFERENCES `ivaSRI` (`id`);

--
-- Filtros para la tabla `detalleFactura`
--
ALTER TABLE `detalleFactura`
  ADD CONSTRAINT `detalleFactura_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `factura` (`id`),
  ADD CONSTRAINT `detalleFactura_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`);

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id`),
  ADD CONSTRAINT `factura_ibfk_2` FOREIGN KEY (`id_puntoEmision`) REFERENCES `puntoEmision` (`id`),
  ADD CONSTRAINT `factura_ibfk_3` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`),
  ADD CONSTRAINT `factura_ibfk_4` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`id_menuPadre`) REFERENCES `menu` (`id`);

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `movimientos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `movimientos_ibfk_3` FOREIGN KEY (`id_factura`) REFERENCES `factura` (`id`);

--
-- Filtros para la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD CONSTRAINT `permiso_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`),
  ADD CONSTRAINT `permiso_ibfk_2` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`);

--
-- Filtros para la tabla `puntoEmision`
--
ALTER TABLE `puntoEmision`
  ADD CONSTRAINT `puntoEmision_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id`),
  ADD CONSTRAINT `puntoEmision_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
