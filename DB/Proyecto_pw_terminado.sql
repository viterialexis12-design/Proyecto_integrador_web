-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 20-07-2026 a las 04:15:29
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_factura` (IN `p_claveAcceso` VARCHAR(49), IN `p_subtotal` DECIMAL(14,2), IN `p_totalIva` DECIMAL(14,2), IN `p_importeTotal` DECIMAL(14,2), IN `p_id_puntoEmision` INT, IN `p_id_cliente` INT, IN `p_id_usuario` INT, OUT `p_id_factura` INT)   BEGIN
    DECLARE v_id_empresa INT;

    -- Obtenemos de forma interna la empresa dueña de ese punto de emisión
    SELECT id_empresa INTO v_id_empresa 
    FROM puntoEmision 
    WHERE id = p_id_puntoEmision LIMIT 1;

    -- Insertamos la cabecera con todos los datos requeridos por tu BD
    INSERT INTO factura (
        claveAcceso, subtotal, totalIva, importeTotal, 
        id_empresa, id_puntoEmision, id_cliente, id_usuario
    ) VALUES (
        p_claveAcceso, p_subtotal, p_totalIva, p_importeTotal, 
        v_id_empresa, p_id_puntoEmision, p_id_cliente, p_id_usuario
    );

    -- Retornamos el ID recién creado
    SET p_id_factura = LAST_INSERT_ID();
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insertar_detalle_factura` (IN `p_cantidad` DECIMAL(14,2), IN `p_precio_unitario` DECIMAL(14,4), IN `p_tarifa_iva` DECIMAL(5,2), IN `p_id_factura` INT, IN `p_id_producto` INT)   BEGIN
    DECLARE v_precioTotalSinImpuesto DECIMAL(14,2);
    DECLARE v_valorIva DECIMAL(14,2);

    -- Realizamos los cálculos internamente
    SET v_precioTotalSinImpuesto = p_cantidad * p_precio_unitario;
    SET v_valorIva = v_precioTotalSinImpuesto * (p_tarifa_iva / 100);

    -- Inserción directa en la tabla física
    INSERT INTO detalleFactura (
        cantidad, precio_unitario, precioTotalSinImpuesto, 
        tarifa_iva, valorIva, id_factura, id_producto
    ) VALUES (
        p_cantidad, p_precio_unitario, v_precioTotalSinImpuesto, 
        p_tarifa_iva, v_valorIva, p_id_factura, p_id_producto
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_mis_ventas_por_cliente` (IN `p_usuario_id` INT, IN `p_termino_cliente` VARCHAR(150))   BEGIN
    SELECT 
        factura_id,
        factura_secuencial,
        punto_emision_codigo,
        fecha_emision,
        cliente_nombre_completo,
        cliente_identificacion,
        total_factura
    FROM v_factura_cabecera 
    WHERE usuario_id = p_usuario_id 
      AND (cliente_nombre_completo LIKE CONCAT('%', p_termino_cliente, '%') 
           OR cliente_identificacion LIKE CONCAT('%', p_termino_cliente, '%'))
    ORDER BY fecha_emision DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_mis_ventas_por_fecha` (IN `p_usuario_id` INT, IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE)   BEGIN
    SELECT 
        factura_id,
        factura_secuencial,
        punto_emision_codigo,
        fecha_emision,
        cliente_nombre_completo,
        cliente_identificacion,
        total_factura
    FROM v_factura_cabecera 
    WHERE usuario_id = p_usuario_id 
      AND DATE(fecha_emision) BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY fecha_emision DESC;
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_auditoria` (IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE, IN `p_tipo` VARCHAR(50))   BEGIN
    SELECT * 
    FROM v_auditoria_productos
    WHERE 1=1
      AND (p_tipo IS NULL OR p_tipo = '' OR tipo_movimiento_texto LIKE CONCAT(p_tipo, '%'))
      AND (p_fecha_inicio IS NULL OR p_fecha_fin IS NULL OR DATE(fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin)
    ORDER BY fecha_movimiento DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_auditorias_cambios` (IN `p_tabla` VARCHAR(100), IN `p_fecha_inicio` VARCHAR(10), IN `p_fecha_fin` VARCHAR(10))   BEGIN
    SELECT 
        a.id,
        a.tabla_afectada,
        a.operacion,
        a.registro_id,
        a.valor_anterior,
        a.valor_nuevo,
        a.id_usuario,
        CONCAT(IFNULL(u.nombre1, 'Sistema'), ' ', IFNULL(u.apellido1, '')) AS usuario_nombre,
        IFNULL(u.username, 'SYSTEM') AS username,
        DATE_FORMAT(a.fecha_movimiento, '%Y-%m-%d %H:%i:%s') AS fecha_movimiento
    FROM auditoria_cambios a
    LEFT JOIN usuario u ON a.id_usuario = u.id
    WHERE (p_tabla IS NULL OR p_tabla = '' OR a.tabla_afectada = p_tabla)
      AND (p_fecha_inicio IS NULL OR p_fecha_inicio = '' OR DATE(a.fecha_movimiento) >= p_fecha_inicio)
      AND (p_fecha_fin IS NULL OR p_fecha_fin = '' OR DATE(a.fecha_movimiento) <= p_fecha_fin)
    ORDER BY a.fecha_movimiento DESC;
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_ventas_generales` ()   BEGIN
    SELECT 
        factura_id,
        factura_secuencial,
        punto_emision_codigo,
        punto_emision_nombre,       -- Nombre del punto (ej. Matriz, Sucursal)
        usuario_nombre_completo,    -- Nombre del cajero/usuario que vendió
        fecha_emision,
        cliente_nombre_completo,
        cliente_identificacion,
        total_factura
    FROM v_factura_cabecera 
    ORDER BY fecha_emision DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_ventas_por_usuario` (IN `p_usuario_id` INT)   BEGIN
    SELECT 
        factura_id,
        factura_secuencial,
        punto_emision_codigo,
        fecha_emision,
        cliente_nombre_completo,
        cliente_identificacion,
        total_factura
    FROM v_factura_cabecera 
    WHERE usuario_id = p_usuario_id
    ORDER BY fecha_emision DESC;
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ventas_generales_por_cliente` (IN `p_termino_cliente` VARCHAR(150))   BEGIN
    SELECT 
        factura_id,
        factura_secuencial,
        punto_emision_codigo,
        punto_emision_nombre,
        usuario_nombre_completo,
        fecha_emision,
        cliente_nombre_completo,
        cliente_identificacion,
        total_factura
    FROM v_factura_cabecera 
    WHERE cliente_nombre_completo LIKE CONCAT('%', p_termino_cliente, '%') 
       OR cliente_identificacion LIKE CONCAT('%', p_termino_cliente, '%')
    ORDER BY fecha_emision DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ventas_generales_por_fecha` (IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE)   BEGIN
    SELECT 
        factura_id,
        factura_secuencial,
        punto_emision_codigo,
        punto_emision_nombre,
        usuario_nombre_completo,
        fecha_emision,
        cliente_nombre_completo,
        cliente_identificacion,
        total_factura
    FROM v_factura_cabecera 
    WHERE DATE(fecha_emision) BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY fecha_emision DESC;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria_cambios`
--

CREATE TABLE `auditoria_cambios` (
  `id` int(11) NOT NULL,
  `tabla_afectada` varchar(100) NOT NULL,
  `operacion` varchar(20) NOT NULL,
  `registro_id` int(11) NOT NULL,
  `valor_anterior` longtext DEFAULT NULL,
  `valor_nuevo` longtext DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_movimiento` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

--
-- Disparadores `categoria`
--
DELIMITER $$
CREATE TRIGGER `trg_categoria_after_insert` AFTER INSERT ON `categoria` FOR EACH ROW BEGIN
    INSERT INTO auditoria_cambios (
        tabla_afectada,
        operacion,
        registro_id,
        valor_anterior,
        valor_nuevo,
        id_usuario
    )
    VALUES (
        'categoria',
        'INSERT',
        NEW.id,
        NULL,
        JSON_OBJECT(
            'id', NEW.id,
            'nombre', NEW.nombre,
            'descripcion', NEW.descripcion,
            'estado', NEW.estado,
            'id_ivaSRI', NEW.id_ivaSRI
        ),
        @usuario_actual_id
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_categoria_after_update` AFTER UPDATE ON `categoria` FOR EACH ROW BEGIN
    DECLARE tipo_operacion VARCHAR(20);

    -- Clasificación del tipo de operación según el cambio de estado
    IF OLD.estado = 1 AND NEW.estado = 0 THEN
        SET tipo_operacion = 'LOGICAL_DELETE';
    ELSEIF OLD.estado = 0 AND NEW.estado = 1 THEN
        SET tipo_operacion = 'REACTIVATE';
    ELSE
        SET tipo_operacion = 'UPDATE';
    END IF;
    IF OLD.nombre <> NEW.nombre
       OR IFNULL(OLD.descripcion, '') <> IFNULL(NEW.descripcion, '')
       OR OLD.estado <> NEW.estado
       OR OLD.id_ivaSRI <> NEW.id_ivaSRI THEN

        INSERT INTO auditoria_cambios (
            tabla_afectada,
            operacion,
            registro_id,
            valor_anterior,
            valor_nuevo,
            id_usuario
        )
        VALUES (
            'categoria',
            tipo_operacion,
            NEW.id,
            JSON_OBJECT(
                'id', OLD.id,
                'nombre', OLD.nombre,
                'descripcion', OLD.descripcion,
                'estado', OLD.estado,
                'id_ivaSRI', OLD.id_ivaSRI
            ),
            JSON_OBJECT(
                'id', NEW.id,
                'nombre', NEW.nombre,
                'descripcion', NEW.descripcion,
                'estado', NEW.estado,
                'id_ivaSRI', NEW.id_ivaSRI
            ),
            @usuario_actual_id
        );
    END IF;
END
$$
DELIMITER ;

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

--
-- Disparadores `cliente`
--
DELIMITER $$
CREATE TRIGGER `trg_cliente_after_insert` AFTER INSERT ON `cliente` FOR EACH ROW BEGIN
    INSERT INTO auditoria_cambios (
        tabla_afectada,
        operacion,
        registro_id,
        valor_anterior,
        valor_nuevo,
        id_usuario
    )
    VALUES (
        'cliente',
        'INSERT',
        NEW.id,
        NULL,
        JSON_OBJECT(
            'id', NEW.id,
            'nombre1', NEW.nombre1,
            'nombre2', NEW.nombre2,
            'apellido1', NEW.apellido1,
            'apellido2', NEW.apellido2,
            'identificacion', NEW.identificacion,
            'tipoIdentificacion', NEW.tipoIdentificacion,
            'correo', NEW.correo,
            'direccion', NEW.direccion,
            'telefono', NEW.telefono,
            'estado', NEW.estado
        ),
        @usuario_actual_id
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_cliente_after_update` AFTER UPDATE ON `cliente` FOR EACH ROW BEGIN
    DECLARE tipo_operacion VARCHAR(20);

    -- Clasificación de la operación según el cambio en 'estado'
    IF OLD.estado = 1 AND NEW.estado = 0 THEN
        SET tipo_operacion = 'LOGICAL_DELETE';
    ELSEIF OLD.estado = 0 AND NEW.estado = 1 THEN
        SET tipo_operacion = 'REACTIVATE';
    ELSE
        SET tipo_operacion = 'UPDATE';
    END IF;

    -- Registrar solo si hubo un cambio real en alguna columna
    IF OLD.nombre1 <> NEW.nombre1
       OR IFNULL(OLD.nombre2, '') <> IFNULL(NEW.nombre2, '')
       OR OLD.apellido1 <> NEW.apellido1
       OR IFNULL(OLD.apellido2, '') <> IFNULL(NEW.apellido2, '')
       OR OLD.identificacion <> NEW.identificacion
       OR OLD.tipoIdentificacion <> NEW.tipoIdentificacion
       OR IFNULL(OLD.correo, '') <> IFNULL(NEW.correo, '')
       OR IFNULL(OLD.direccion, '') <> IFNULL(NEW.direccion, '')
       OR IFNULL(OLD.telefono, '') <> IFNULL(NEW.telefono, '')
       OR OLD.estado <> NEW.estado THEN

        INSERT INTO auditoria_cambios (
            tabla_afectada,
            operacion,
            registro_id,
            valor_anterior,
            valor_nuevo,
            id_usuario
        )
        VALUES (
            'cliente',
            tipo_operacion,
            NEW.id,
            JSON_OBJECT(
                'id', OLD.id,
                'nombre1', OLD.nombre1,
                'nombre2', OLD.nombre2,
                'apellido1', OLD.apellido1,
                'apellido2', OLD.apellido2,
                'identificacion', OLD.identificacion,
                'tipoIdentificacion', OLD.tipoIdentificacion,
                'correo', OLD.correo,
                'direccion', OLD.direccion,
                'telefono', OLD.telefono,
                'estado', OLD.estado
            ),
            JSON_OBJECT(
                'id', NEW.id,
                'nombre1', NEW.nombre1,
                'nombre2', NEW.nombre2,
                'apellido1', NEW.apellido1,
                'apellido2', NEW.apellido2,
                'identificacion', NEW.identificacion,
                'tipoIdentificacion', NEW.tipoIdentificacion,
                'correo', NEW.correo,
                'direccion', NEW.direccion,
                'telefono', NEW.telefono,
                'estado', NEW.estado
            ),
            @usuario_actual_id
        );
    END IF;
END
$$
DELIMITER ;

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

--
-- Disparadores `empresa`
--
DELIMITER $$
CREATE TRIGGER `trg_empresa_after_update` AFTER UPDATE ON `empresa` FOR EACH ROW BEGIN
    -- Registrar solo si hubo un cambio real en alguna columna
    IF OLD.razonSocial <> NEW.razonSocial
       OR OLD.nombreComercial <> NEW.nombreComercial
       OR OLD.ruc <> NEW.ruc
       OR OLD.dirMatriz <> NEW.dirMatriz
       OR OLD.obligadoContabilidad <> NEW.obligadoContabilidad
       OR IFNULL(OLD.contribuyenteEspecial, '') <> IFNULL(NEW.contribuyenteEspecial, '') THEN

        INSERT INTO auditoria_cambios (
            tabla_afectada,
            operacion,
            registro_id,
            valor_anterior,
            valor_nuevo,
            id_usuario
        )
        VALUES (
            'empresa',
            'UPDATE',
            NEW.id,
            JSON_OBJECT(
                'id', OLD.id,
                'razonSocial', OLD.razonSocial,
                'nombreComercial', OLD.nombreComercial,
                'ruc', OLD.ruc,
                'dirMatriz', OLD.dirMatriz,
                'obligadoContabilidad', OLD.obligadoContabilidad,
                'contribuyenteEspecial', OLD.contribuyenteEspecial
            ),
            JSON_OBJECT(
                'id', NEW.id,
                'razonSocial', NEW.razonSocial,
                'nombreComercial', NEW.nombreComercial,
                'ruc', NEW.ruc,
                'dirMatriz', NEW.dirMatriz,
                'obligadoContabilidad', NEW.obligadoContabilidad,
                'contribuyenteEspecial', NEW.contribuyenteEspecial
            ),
            @usuario_actual_id
        );
    END IF;
END
$$
DELIMITER ;

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
(25, 'Hacer una venta', 'hace una venta', 'hacer_venta.html', 24, 1),
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
(52, 'Registrar Egreso', 'Saque productos que no se vendieron', 'registrar_egreso.html', 49, 1),
(53, 'Mis ventas', 'Visualice las ventas que ha hecho', 'mis_ventas.html', 24, 1),
(54, 'Ventas generales', 'Visualice las ventas de todos los usuarios', 'ventas_generales.html', 24, 1),
(55, 'Auditoria', 'Permite ver  los cambios en el sistema y en el inventario', '', NULL, 1),
(56, 'Auditar Inventario', 'Vea los cambios hechos en el inventario, con sus responsables', 'auditoria_inventario.html', 55, 1),
(57, 'Ver cambios en el sistema', 'Vea los cambios hechos en el sistema con sus responsbles', 'ver_auditoria_cambios.html', 55, 1);

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
DELIMITER $$
CREATE TRIGGER `trg_menu_after_insert` AFTER INSERT ON `menu` FOR EACH ROW BEGIN
    INSERT INTO auditoria_cambios (
        tabla_afectada,
        operacion,
        registro_id,
        valor_anterior,
        valor_nuevo,
        id_usuario
    )
    VALUES (
        'menu',
        'INSERT',
        NEW.id,
        NULL,
        JSON_OBJECT(
            'id', NEW.id,
            'nombre', NEW.nombre,
            'descripcion', NEW.descripcion,
            'url', NEW.url,
            'id_menuPadre', NEW.id_menuPadre,
            'estado', NEW.estado
        ),
        @usuario_actual_id
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_menu_after_update` AFTER UPDATE ON `menu` FOR EACH ROW BEGIN
    DECLARE tipo_operacion VARCHAR(20);

    -- Clasificación del tipo de operación según el cambio en 'estado'
    IF OLD.estado = 1 AND NEW.estado = 0 THEN
        SET tipo_operacion = 'LOGICAL_DELETE';
    ELSEIF OLD.estado = 0 AND NEW.estado = 1 THEN
        SET tipo_operacion = 'REACTIVATE';
    ELSE
        SET tipo_operacion = 'UPDATE';
    END IF;

    -- Registrar solo si hubo un cambio real en alguna columna
    IF OLD.nombre <> NEW.nombre
       OR IFNULL(OLD.descripcion, '') <> IFNULL(NEW.descripcion, '')
       OR IFNULL(OLD.url, '') <> IFNULL(NEW.url, '')
       OR IFNULL(OLD.id_menuPadre, 0) <> IFNULL(NEW.id_menuPadre, 0)
       OR OLD.estado <> NEW.estado THEN

        INSERT INTO auditoria_cambios (
            tabla_afectada,
            operacion,
            registro_id,
            valor_anterior,
            valor_nuevo,
            id_usuario
        )
        VALUES (
            'menu',
            tipo_operacion,
            NEW.id,
            JSON_OBJECT(
                'id', OLD.id,
                'nombre', OLD.nombre,
                'descripcion', OLD.descripcion,
                'url', OLD.url,
                'id_menuPadre', OLD.id_menuPadre,
                'estado', OLD.estado
            ),
            JSON_OBJECT(
                'id', NEW.id,
                'nombre', NEW.nombre,
                'descripcion', NEW.descripcion,
                'url', NEW.url,
                'id_menuPadre', NEW.id_menuPadre,
                'estado', NEW.estado
            ),
            @usuario_actual_id
        );
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
  `stock_anterior` decimal(14,2) NOT NULL DEFAULT 0.00,
  `stock_posterior` decimal(14,2) NOT NULL DEFAULT 0.00,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `observacion` varchar(255) DEFAULT NULL,
  `id_producto` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_factura` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `movimientos`
--
DELIMITER $$
CREATE TRIGGER `tg_actualizar_stock_movimientos` BEFORE INSERT ON `movimientos` FOR EACH ROW BEGIN
    DECLARE v_stock_actual DECIMAL(14,2);

    -- 1. Obtenemos el stock que tiene el producto JUSTO AHORA (antes del movimiento)
    SELECT stockActual INTO v_stock_actual 
    FROM producto 
    WHERE id = NEW.id_producto;

    -- Si por alguna razón es el primer movimiento y no encuentra registro, lo seteamos en 0
    IF v_stock_actual IS NULL THEN
        SET v_stock_actual = 0.00;
    END IF;

    -- 2. Asignamos el stock anterior al registro del movimiento
    SET NEW.stock_anterior = v_stock_actual;

    -- 3. Evaluamos el tipo de movimiento para calcular el stock posterior e impactar a la tabla producto
    IF NEW.tipoMovimiento = 1 THEN
        SET NEW.stock_posterior = v_stock_actual + NEW.cantidad;
        
        UPDATE producto 
        SET stockActual = NEW.stock_posterior 
        WHERE id = NEW.id_producto;

    ELSEIF NEW.tipoMovimiento = 2 OR NEW.tipoMovimiento = 3 THEN
        SET NEW.stock_posterior = v_stock_actual - NEW.cantidad;
        
        UPDATE producto 
        SET stockActual = NEW.stock_posterior 
        WHERE id = NEW.id_producto;
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
(720, 1, 1),
(721, 1, 2),
(722, 1, 3),
(723, 1, 4),
(724, 1, 24),
(725, 1, 26),
(726, 1, 29),
(727, 1, 34),
(728, 1, 39),
(729, 1, 44),
(730, 1, 49),
(731, 1, 55),
(732, 1, 5),
(733, 1, 6),
(734, 1, 7),
(735, 1, 8),
(736, 1, 9),
(737, 1, 10),
(738, 1, 11),
(739, 1, 12),
(740, 1, 13),
(741, 1, 14),
(742, 1, 15),
(743, 1, 16),
(744, 1, 18),
(745, 1, 20),
(746, 1, 25),
(747, 1, 53),
(748, 1, 54),
(749, 1, 27),
(750, 1, 28),
(751, 1, 30),
(752, 1, 31),
(753, 1, 32),
(754, 1, 33),
(755, 1, 35),
(756, 1, 36),
(757, 1, 37),
(758, 1, 38),
(759, 1, 40),
(760, 1, 41),
(761, 1, 42),
(762, 1, 43),
(763, 1, 45),
(764, 1, 46),
(765, 1, 47),
(766, 1, 48),
(767, 1, 50),
(768, 1, 51),
(769, 1, 52),
(770, 1, 56),
(771, 1, 57);

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
(1, 'Papas', 'Bulto de papas', 'UNIDAD', 5.3500, 0.00, 1, 1),
(2, 'Cebolla', 'libra de cebolla', 'KG', 1.5000, 0.00, 1, 1);

--
-- Disparadores `producto`
--
DELIMITER $$
CREATE TRIGGER `trg_producto_after_insert` AFTER INSERT ON `producto` FOR EACH ROW BEGIN
    INSERT INTO auditoria_cambios (
        tabla_afectada,
        operacion,
        registro_id,
        valor_anterior,
        valor_nuevo,
        id_usuario
    )
    VALUES (
        'producto',
        'INSERT',
        NEW.id,
        NULL,
        JSON_OBJECT(
            'id', NEW.id,
            'nombre', NEW.nombre,
            'descripcion', NEW.descripcion,
            'unidadMedida', NEW.unidadMedida,
            'precioUnitario', NEW.precioUnitario,
            'stockActual', NEW.stockActual,
            'estado', NEW.estado,
            'id_categoria', NEW.id_categoria
        ),
        @usuario_actual_id
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_producto_after_update` AFTER UPDATE ON `producto` FOR EACH ROW BEGIN
    DECLARE tipo_operacion VARCHAR(20);

    -- Clasificación del tipo de operación según el cambio en 'estado'
    IF OLD.estado = 1 AND NEW.estado = 0 THEN
        SET tipo_operacion = 'LOGICAL_DELETE';
    ELSEIF OLD.estado = 0 AND NEW.estado = 1 THEN
        SET tipo_operacion = 'REACTIVATE';
    ELSE
        SET tipo_operacion = 'UPDATE';
    END IF;

    -- Registrar solo si hubo un cambio real en alguna columna
    IF OLD.nombre <> NEW.nombre
       OR IFNULL(OLD.descripcion, '') <> IFNULL(NEW.descripcion, '')
       OR IFNULL(OLD.unidadMedida, '') <> IFNULL(NEW.unidadMedida, '')
       OR OLD.precioUnitario <> NEW.precioUnitario
       OR OLD.stockActual <> NEW.stockActual
       OR OLD.estado <> NEW.estado
       OR OLD.id_categoria <> NEW.id_categoria THEN

        INSERT INTO auditoria_cambios (
            tabla_afectada,
            operacion,
            registro_id,
            valor_anterior,
            valor_nuevo,
            id_usuario
        )
        VALUES (
            'producto',
            tipo_operacion,
            NEW.id,
            JSON_OBJECT(
                'id', OLD.id,
                'nombre', OLD.nombre,
                'descripcion', OLD.descripcion,
                'unidadMedida', OLD.unidadMedida,
                'precioUnitario', OLD.precioUnitario,
                'stockActual', OLD.stockActual,
                'estado', OLD.estado,
                'id_categoria', OLD.id_categoria
            ),
            JSON_OBJECT(
                'id', NEW.id,
                'nombre', NEW.nombre,
                'descripcion', NEW.descripcion,
                'unidadMedida', NEW.unidadMedida,
                'precioUnitario', NEW.precioUnitario,
                'stockActual', NEW.stockActual,
                'estado', NEW.estado,
                'id_categoria', NEW.id_categoria
            ),
            @usuario_actual_id
        );
    END IF;
END
$$
DELIMITER ;

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

--
-- Disparadores `puntoEmision`
--
DELIMITER $$
CREATE TRIGGER `trg_puntoemision_after_insert` AFTER INSERT ON `puntoEmision` FOR EACH ROW BEGIN
    INSERT INTO auditoria_cambios (
        tabla_afectada,
        operacion,
        registro_id,
        valor_anterior,
        valor_nuevo,
        id_usuario
    )
    VALUES (
        'puntoEmision',
        'INSERT',
        NEW.id,
        NULL,
        JSON_OBJECT(
            'id', NEW.id,
            'nombre', NEW.nombre,
            'codigoSRI', NEW.codigoSRI,
            'secuencial', NEW.secuencial,
            'estado', NEW.estado,
            'id_empresa', NEW.id_empresa,
            'id_usuario', NEW.id_usuario
        ),
        @usuario_actual_id
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_puntoemision_after_update` AFTER UPDATE ON `puntoEmision` FOR EACH ROW BEGIN
    DECLARE tipo_operacion VARCHAR(20);

    -- Clasificación de la operación según el cambio en 'estado'
    IF OLD.estado = 1 AND NEW.estado = 0 THEN
        SET tipo_operacion = 'LOGICAL_DELETE';
    ELSEIF OLD.estado = 0 AND NEW.estado = 1 THEN
        SET tipo_operacion = 'REACTIVATE';
    ELSE
        SET tipo_operacion = 'UPDATE';
    END IF;

    -- Registrar solo si hubo un cambio real en alguna columna
    IF OLD.nombre <> NEW.nombre
       OR OLD.codigoSRI <> NEW.codigoSRI
       OR OLD.secuencial <> NEW.secuencial
       OR OLD.estado <> NEW.estado
       OR OLD.id_empresa <> NEW.id_empresa
       OR IFNULL(OLD.id_usuario, 0) <> IFNULL(NEW.id_usuario, 0) THEN

        INSERT INTO auditoria_cambios (
            tabla_afectada,
            operacion,
            registro_id,
            valor_anterior,
            valor_nuevo,
            id_usuario
        )
        VALUES (
            'puntoEmision',
            tipo_operacion,
            NEW.id,
            JSON_OBJECT(
                'id', OLD.id,
                'nombre', OLD.nombre,
                'codigoSRI', OLD.codigoSRI,
                'secuencial', OLD.secuencial,
                'estado', OLD.estado,
                'id_empresa', OLD.id_empresa,
                'id_usuario', OLD.id_usuario
            ),
            JSON_OBJECT(
                'id', NEW.id,
                'nombre', NEW.nombre,
                'codigoSRI', NEW.codigoSRI,
                'secuencial', NEW.secuencial,
                'estado', NEW.estado,
                'id_empresa', NEW.id_empresa,
                'id_usuario', NEW.id_usuario
            ),
            @usuario_actual_id
        );
    END IF;
END
$$
DELIMITER ;

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
(1, 'SA', 'Super administrador del sistema', 1);

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
DELIMITER $$
CREATE TRIGGER `trg_rol_after_insert` AFTER INSERT ON `rol` FOR EACH ROW BEGIN
    INSERT INTO auditoria_cambios (
        tabla_afectada,
        operacion,
        registro_id,
        valor_anterior,
        valor_nuevo,
        id_usuario
    )
    VALUES (
        'rol',
        'INSERT',
        NEW.id,
        NULL,
        JSON_OBJECT(
            'id', NEW.id,
            'nombre', NEW.nombre,
            'descripcion', NEW.descripcion,
            'estado', NEW.estado
        ),
        @usuario_actual_id
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_rol_after_update` AFTER UPDATE ON `rol` FOR EACH ROW BEGIN
    DECLARE tipo_operacion VARCHAR(20);

    -- Clasificación del tipo de operación según el cambio en 'estado'
    IF OLD.estado = 1 AND NEW.estado = 0 THEN
        SET tipo_operacion = 'LOGICAL_DELETE';
    ELSEIF OLD.estado = 0 AND NEW.estado = 1 THEN
        SET tipo_operacion = 'REACTIVATE';
    ELSE
        SET tipo_operacion = 'UPDATE';
    END IF;

    -- Registrar solo si hubo un cambio real en alguna columna
    IF OLD.nombre <> NEW.nombre
       OR IFNULL(OLD.descripcion, '') <> IFNULL(NEW.descripcion, '')
       OR OLD.estado <> NEW.estado THEN

        INSERT INTO auditoria_cambios (
            tabla_afectada,
            operacion,
            registro_id,
            valor_anterior,
            valor_nuevo,
            id_usuario
        )
        VALUES (
            'rol',
            tipo_operacion,
            NEW.id,
            JSON_OBJECT(
                'id', OLD.id,
                'nombre', OLD.nombre,
                'descripcion', OLD.descripcion,
                'estado', OLD.estado
            ),
            JSON_OBJECT(
                'id', NEW.id,
                'nombre', NEW.nombre,
                'descripcion', NEW.descripcion,
                'estado', NEW.estado
            ),
            @usuario_actual_id
        );
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
(1, 'Admin', NULL, 'Sistema', NULL, '1234567890', 'admin@sistema.com', '1990-01-01', NULL, '0999999999', 'admin', '$2y$10$fgh8DXCcOhLknzfQbxIVoutgnemloD3LU5bjny10f/fxaLygyHfeK', 1, 1, 1);

--
-- Disparadores `usuario`
--
DELIMITER $$
CREATE TRIGGER `trg_usuario_after_insert` AFTER INSERT ON `usuario` FOR EACH ROW BEGIN
    INSERT INTO auditoria_cambios (
        tabla_afectada,
        operacion,
        registro_id,
        valor_anterior,
        valor_nuevo,
        id_usuario
    )
    VALUES (
        'usuario',
        'INSERT',
        NEW.id,
        NULL,
        JSON_OBJECT(
            'id', NEW.id,
            'nombre1', NEW.nombre1,
            'nombre2', NEW.nombre2,
            'apellido1', NEW.apellido1,
            'apellido2', NEW.apellido2,
            'cedula', NEW.cedula,
            'correo', NEW.correo,
            'username', NEW.username,
            'telefono', NEW.telefono,
            'estado', NEW.estado,
            'id_rol', NEW.id_rol,
            'id_empresa', NEW.id_empresa
        ),
        @usuario_actual_id
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_usuario_after_update` AFTER UPDATE ON `usuario` FOR EACH ROW BEGIN
    DECLARE tipo_operacion VARCHAR(20);

    -- Detectar si es desactivación lógica o una reactivación
    IF OLD.estado = 1 AND NEW.estado = 0 THEN
        SET tipo_operacion = 'LOGICAL_DELETE';
    ELSEIF OLD.estado = 0 AND NEW.estado = 1 THEN
        SET tipo_operacion = 'REACTIVATE';
    ELSE
        SET tipo_operacion = 'UPDATE';
    END IF;

    -- Registrar solo si hubo un cambio real en alguna columna
    IF OLD.nombre1 <> NEW.nombre1
       OR IFNULL(OLD.nombre2, '') <> IFNULL(NEW.nombre2, '')
       OR OLD.apellido1 <> NEW.apellido1
       OR IFNULL(OLD.apellido2, '') <> IFNULL(NEW.apellido2, '')
       OR OLD.correo <> NEW.correo
       OR OLD.username <> NEW.username
       OR OLD.clave <> NEW.clave
       OR OLD.estado <> NEW.estado
       OR OLD.id_rol <> NEW.id_rol
       OR IFNULL(OLD.telefono, '') <> IFNULL(NEW.telefono, '') THEN

        INSERT INTO auditoria_cambios (
            tabla_afectada,
            operacion,
            registro_id,
            valor_anterior,
            valor_nuevo,
            id_usuario
        )
        VALUES (
            'usuario',
            tipo_operacion,
            NEW.id,
            JSON_OBJECT(
                'nombre1', OLD.nombre1,
                'nombre2', OLD.nombre2,
                'apellido1', OLD.apellido1,
                'apellido2', OLD.apellido2,
                'cedula', OLD.cedula,
                'correo', OLD.correo,
                'username', OLD.username,
                'telefono', OLD.telefono,
                'estado', OLD.estado,
                'id_rol', OLD.id_rol
            ),
            JSON_OBJECT(
                'nombre1', NEW.nombre1,
                'nombre2', NEW.nombre2,
                'apellido1', NEW.apellido1,
                'apellido2', NEW.apellido2,
                'cedula', NEW.cedula,
                'correo', NEW.correo,
                'username', NEW.username,
                'telefono', NEW.telefono,
                'estado', NEW.estado,
                'id_rol', NEW.id_rol
            ),
            @usuario_actual_id
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_auditoria_productos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_auditoria_productos` (
`movimiento_id` int(11)
,`id_factura` int(11)
,`producto_nombre` varchar(150)
,`unidad_medida` varchar(20)
,`tipo_movimiento_texto` varchar(21)
,`stock_anterior` decimal(14,2)
,`cantidad_cambio` decimal(14,2)
,`stock_posterior` decimal(14,2)
,`proveedor` varchar(150)
,`identificacion_comprador` varchar(20)
,`numero_factura` varchar(17)
,`punto_emision_origen` varchar(50)
,`usuario_responsable` varchar(101)
,`observacion` varchar(255)
,`fecha_movimiento` timestamp
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_factura_cabecera`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_factura_cabecera` (
`factura_id` int(11)
,`clave_acceso` varchar(49)
,`fecha_emision` timestamp
,`subtotal_factura` decimal(14,2)
,`total_iva_factura` decimal(14,2)
,`total_factura` decimal(14,2)
,`codigo_sri_pago` varchar(2)
,`estado_sri` varchar(20)
,`empresa_id` int(11)
,`empresa_razon_social` varchar(255)
,`empresa_nombre_comercial` varchar(255)
,`empresa_ruc` varchar(13)
,`empresa_direccion` varchar(255)
,`empresa_obligado_contabilidad` varchar(2)
,`empresa_contribuyente_especial` varchar(20)
,`punto_emision_id` int(11)
,`punto_emision_nombre` varchar(50)
,`punto_emision_codigo` varchar(3)
,`factura_secuencial` int(11)
,`cliente_id` int(11)
,`cliente_nombre_completo` varchar(203)
,`cliente_identificacion` varchar(20)
,`cliente_tipo_identificacion` varchar(2)
,`cliente_correo` varchar(100)
,`cliente_direccion` varchar(255)
,`cliente_telefono` varchar(20)
,`usuario_id` int(11)
,`usuario_username` varchar(50)
,`usuario_nombre_completo` varchar(203)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_factura_detalle`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_factura_detalle` (
`detalle_id` int(11)
,`factura_id` int(11)
,`producto_id` int(11)
,`producto_nombre` varchar(150)
,`producto_unidad_medida` varchar(20)
,`cantidad` decimal(14,2)
,`precio_unitario` decimal(14,4)
,`subtotal_detalle` decimal(14,2)
,`tarifa_iva` decimal(5,2)
,`valor_iva_detalle` decimal(14,2)
,`sri_codigo_iva` varchar(10)
,`sri_porcentaje_iva` varchar(5)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `v_auditoria_productos`
--
DROP TABLE IF EXISTS `v_auditoria_productos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_auditoria_productos`  AS SELECT `m`.`id` AS `movimiento_id`, `m`.`id_factura` AS `id_factura`, `p`.`nombre` AS `producto_nombre`, `p`.`unidadMedida` AS `unidad_medida`, CASE `m`.`tipoMovimiento` WHEN 1 THEN '1 - Ingreso' WHEN 2 THEN '2 - Egreso / Merma' WHEN 3 THEN '3 - Venta por Factura' ELSE 'Desconocido' END AS `tipo_movimiento_texto`, `m`.`stock_anterior` AS `stock_anterior`, `m`.`cantidad` AS `cantidad_cambio`, `m`.`stock_posterior` AS `stock_posterior`, ifnull(`m`.`nombreProveedor`,'N/A') AS `proveedor`, ifnull(`c`.`identificacion`,'N/A') AS `identificacion_comprador`, CASE WHEN `m`.`id_factura` is not null THEN concat(`pe_fac`.`codigoSRI`,'-001-',lpad(`f`.`id`,9,'0')) ELSE 'N/A' END AS `numero_factura`, CASE WHEN `m`.`tipoMovimiento` = 3 THEN ifnull(`pe_fac`.`nombre`,'General / Sin Asignar') ELSE 'N/A' END AS `punto_emision_origen`, concat(`u`.`nombre1`,' ',`u`.`apellido1`) AS `usuario_responsable`, `m`.`observacion` AS `observacion`, `m`.`fecha` AS `fecha_movimiento` FROM ((((((`movimientos` `m` join `producto` `p` on(`m`.`id_producto` = `p`.`id`)) join `usuario` `u` on(`m`.`id_usuario` = `u`.`id`)) left join `factura` `f` on(`m`.`id_factura` = `f`.`id`)) left join `cliente` `c` on(`f`.`id_cliente` = `c`.`id`)) left join `puntoEmision` `pe_fac` on(`f`.`id_puntoEmision` = `pe_fac`.`id`)) left join `puntoEmision` `pe_usr` on(`u`.`id` = `pe_usr`.`id_usuario` and `pe_usr`.`estado` = 1)) ORDER BY `m`.`fecha` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_factura_cabecera`
--
DROP TABLE IF EXISTS `v_factura_cabecera`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_factura_cabecera`  AS SELECT `f`.`id` AS `factura_id`, `f`.`claveAcceso` AS `clave_acceso`, `f`.`fechaEmision` AS `fecha_emision`, `f`.`subtotal` AS `subtotal_factura`, `f`.`totalIva` AS `total_iva_factura`, `f`.`importeTotal` AS `total_factura`, `f`.`codigoSriPago` AS `codigo_sri_pago`, `f`.`estadoSri` AS `estado_sri`, `e`.`id` AS `empresa_id`, `e`.`razonSocial` AS `empresa_razon_social`, `e`.`nombreComercial` AS `empresa_nombre_comercial`, `e`.`ruc` AS `empresa_ruc`, `e`.`dirMatriz` AS `empresa_direccion`, `e`.`obligadoContabilidad` AS `empresa_obligado_contabilidad`, `e`.`contribuyenteEspecial` AS `empresa_contribuyente_especial`, `pe`.`id` AS `punto_emision_id`, `pe`.`nombre` AS `punto_emision_nombre`, `pe`.`codigoSRI` AS `punto_emision_codigo`, `pe`.`secuencial` AS `factura_secuencial`, `c`.`id` AS `cliente_id`, trim(concat(`c`.`nombre1`,' ',ifnull(`c`.`nombre2`,''),' ',`c`.`apellido1`,' ',ifnull(`c`.`apellido2`,''))) AS `cliente_nombre_completo`, `c`.`identificacion` AS `cliente_identificacion`, `c`.`tipoIdentificacion` AS `cliente_tipo_identificacion`, `c`.`correo` AS `cliente_correo`, `c`.`direccion` AS `cliente_direccion`, `c`.`telefono` AS `cliente_telefono`, `u`.`id` AS `usuario_id`, `u`.`username` AS `usuario_username`, trim(concat(`u`.`nombre1`,' ',ifnull(`u`.`nombre2`,''),' ',`u`.`apellido1`,' ',ifnull(`u`.`apellido2`,''))) AS `usuario_nombre_completo` FROM ((((`factura` `f` join `empresa` `e` on(`f`.`id_empresa` = `e`.`id`)) join `puntoEmision` `pe` on(`f`.`id_puntoEmision` = `pe`.`id`)) join `cliente` `c` on(`f`.`id_cliente` = `c`.`id`)) join `usuario` `u` on(`f`.`id_usuario` = `u`.`id`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_factura_detalle`
--
DROP TABLE IF EXISTS `v_factura_detalle`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_factura_detalle`  AS SELECT `df`.`id` AS `detalle_id`, `df`.`id_factura` AS `factura_id`, `df`.`id_producto` AS `producto_id`, `p`.`nombre` AS `producto_nombre`, `p`.`unidadMedida` AS `producto_unidad_medida`, `df`.`cantidad` AS `cantidad`, `df`.`precio_unitario` AS `precio_unitario`, `df`.`precioTotalSinImpuesto` AS `subtotal_detalle`, `df`.`tarifa_iva` AS `tarifa_iva`, `df`.`valorIva` AS `valor_iva_detalle`, `i`.`codigoSri` AS `sri_codigo_iva`, `i`.`porcentaje` AS `sri_porcentaje_iva` FROM (((`detalleFactura` `df` join `producto` `p` on(`df`.`id_producto` = `p`.`id`)) join `categoria` `cat` on(`p`.`id_categoria` = `cat`.`id`)) join `ivaSRI` `i` on(`cat`.`id_ivaSRI` = `i`.`id`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria_cambios`
--
ALTER TABLE `auditoria_cambios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

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
-- AUTO_INCREMENT de la tabla `auditoria_cambios`
--
ALTER TABLE `auditoria_cambios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `ivaSRI`
--
ALTER TABLE `ivaSRI`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `permiso`
--
ALTER TABLE `permiso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=783;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `puntoEmision`
--
ALTER TABLE `puntoEmision`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria_cambios`
--
ALTER TABLE `auditoria_cambios`
  ADD CONSTRAINT `auditoria_cambios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE SET NULL;

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
