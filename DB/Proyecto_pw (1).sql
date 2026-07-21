-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 18-07-2026 a las 23:15:39
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
(25, 'hacer una venta', 'hace una venta', 'hacer_venta.html', 24, 1);

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
(50, 1, 1),
(51, 1, 2),
(52, 1, 3),
(53, 1, 4),
(54, 1, 5),
(55, 1, 6),
(56, 1, 7),
(57, 1, 8),
(58, 1, 9),
(59, 1, 10),
(60, 1, 11),
(61, 1, 12),
(62, 1, 13),
(63, 1, 14),
(64, 1, 15),
(65, 1, 16),
(66, 1, 18),
(67, 1, 20),
(81, 2, 1),
(82, 2, 2),
(83, 2, 7),
(84, 2, 9);

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
(2, 'ALexis', '', 'Viteri', '', '1727753970', 'ajviteri@espe.com', '2020-01-07', NULL, '0983785507', 'ajviteri2', '$2y$10$6mgonBShS/xt1zK3nqodDOTc5Ahj.siNsuz5EXcclbi8i9KmYj.ze', 1, 2, 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalleFactura`
--
ALTER TABLE `detalleFactura`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ivaSRI`
--
ALTER TABLE `ivaSRI`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permiso`
--
ALTER TABLE `permiso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puntoEmision`
--
ALTER TABLE `puntoEmision`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
