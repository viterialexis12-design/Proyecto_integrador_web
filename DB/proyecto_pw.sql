-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 06-07-2026 a las 17:43:07
-- Versión del servidor: 8.0.17
-- Versión de PHP: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `Proyecto_pw`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--

CREATE TABLE `menu` (
  `codigo_menu` varchar(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `id_rol` varchar(10) NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menu`
--

INSERT INTO `menu` (`codigo_menu`, `nombre`, `descripcion`, `id_rol`, `estado`) VALUES
('MENU000001', 'Gestion de Usuarios', 'Use esta opcion para gestionar usuarios', 'ROL0000001', 1),
('MENU000002', 'Gestion de Menus', 'Cree menus y asigneles permisos', 'ROL0000001', 1),
('MENU000003', 'Gestion de Roles', 'Cree roles para asignar a cada usuario', 'ROL0000001', 1),
('MENU000004', 'Gestion de Permisos', 'Genere permisos para cada menu', 'ROL0000001', 1),
('MNU000001', 'Ventas', 'Ventas', 'ROL0000001', 1),
('MNU000002', 'PRODUCTOS', 'GESTION DE PRODUCTOS', 'ROL0000001', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso`
--

CREATE TABLE `permiso` (
  `id_permiso` varchar(10) NOT NULL,
  `nombre_permiso` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `codigo_menu` varchar(10) NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permiso`
--

INSERT INTO `permiso` (`id_permiso`, `nombre_permiso`, `descripcion`, `codigo_menu`, `estado`) VALUES
('PER0000001', 'Crear Usuario', 'Crear un usuario y asignarle un rol', 'MENU000001', 1),
('PER0000002', 'Actualizar Usuario', 'Actualize un usuario', 'MENU000001', 1),
('PER0000003', 'Borrar usuario', 'Asignarle estado inactivo a un usuario', 'MENU000001', 1),
('PER0000004', 'Ver Usuarios', 'Genere una lista con todos los usuarios', 'MENU000001', 1),
('PER0000005', 'Ver Menus', 'Ver todos los menus creados', 'MENU000002', 1),
('PER0000006', 'Actualizar un Menu', 'Editar la informacion de un menu', 'MENU000002', 1),
('PER0000007', 'Crear Menu', 'Crear un menu nuevo', 'MENU000002', 1),
('PER0000008', 'Borrar Menu', 'Eliminar un menu del sistema', 'MENU000002', 1),
('PER0000009', 'Ver Roles', 'Ver los roles exixtentes', 'MENU000003', 1),
('PER0000010', 'Crear Rol', 'Crear un rol para los usuarios', 'MENU000003', 1),
('PER0000011', 'Actualizar Rol', 'Editar la informacion de un rol', 'MENU000003', 1),
('PER0000012', 'Borrar Rol', 'Eliminar un rol', 'MENU000003', 1),
('PER0000013', 'Ver Permisos', 'Ver los permisos', 'MENU000004', 1),
('PER0000014', 'Actualizar un Permiso', 'Editar un permiso', 'MENU000004', 1),
('PER0000015', 'Borrar Permiso', 'Eliminar un permiso', 'MENU000004', 1),
('PER0000016', 'Crear Permiso', 'Crear un permiso', 'MENU000004', 1),
('PER0000017', 'Permiso nuevo', 'Prueba', 'MNU000001', 1),
('PER0000018', 'Crear productos', 'creemos un producto nuevo', 'MNU000002', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` varchar(10) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `descripcion` text,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`, `descripcion`, `estado`) VALUES
('ROL0000001', 'SA', 'Super administrador del sistema', 1),
('ROL0000002', 'Cajero', 'Pues es alguien que trabaja en caja', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` varchar(10) NOT NULL,
  `nombre1` varchar(20) NOT NULL,
  `nombre2` varchar(20) DEFAULT NULL,
  `apellido1` varchar(20) NOT NULL,
  `apellido2` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '0',
  `foto_perfil` text,
  `id_rol` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre1`, `nombre2`, `apellido1`, `apellido2`, `fecha_nacimiento`, `cedula`, `telefono`, `correo`, `username`, `clave`, `estado`, `foto_perfil`, `id_rol`) VALUES
('USR0000001', 'Admin', NULL, 'Sistema', NULL, '1990-01-01', '1234567890', '0999999999', 'admin@sistema.com', 'admin', '$2y$10$fgh8DXCcOhLknzfQbxIVoutgnemloD3LU5bjny10f/fxaLygyHfeK', 1, NULL, 'ROL0000001'),
('USR0000002', 'Alexis', 'Josue', 'Viteri', 'Avila', '2004-02-04', '1727753970', '0983785507', 'ajviteri2@espe.edu.ec', 'ajviteri2', '$2y$10$eFxOTImpENz5r5.QhHZGWeR4K6jZZ/xsGuR9d0hd4LH07xGImdlKa', 1, NULL, 'ROL0000002');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`codigo_menu`),
  ADD KEY `fk_menu_rol` (`id_rol`);

--
-- Indices de la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD PRIMARY KEY (`id_permiso`),
  ADD KEY `fk_permiso_menu` (`codigo_menu`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `fk_usuario_rol` (`id_rol`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `fk_menu_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);

--
-- Filtros para la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD CONSTRAINT `fk_permiso_menu` FOREIGN KEY (`codigo_menu`) REFERENCES `menu` (`codigo_menu`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
