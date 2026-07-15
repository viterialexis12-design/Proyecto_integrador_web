-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 13-07-2026 a las 16:31:07
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
-- Base de datos: `Proyecto_pw1`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--

CREATE TABLE `menu` (
  `id` smallint(6) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `id_menuPadre` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menu`
--

INSERT INTO `menu` (`id`, `nombre`, `descripcion`, `url`, `estado`, `id_menuPadre`) VALUES
(1, 'Gestion de usuarios', 'Gestiona los usuarios', NULL, 1, NULL),
(2, 'Gestion de roles', 'Gestiona los roles', NULL, 1, NULL),
(3, 'Gestion de menus', 'Gestiona los menus', NULL, 1, NULL),
(4, 'Gestion de permisos', 'Gestiona los permisos de cada rol', NULL, 1, NULL),
(5, 'Crear Usuario', 'Ingrese nuevos usuarios', 'crear_usuario.html', 1, 1),
(6, 'Actualizar usuario', 'Corrija informacion de un usuario', 'actualizar_usuario.html', 1, 1),
(7, 'Ver usuarios', 'Lista con todos los usuarios', 'ver_usuarios.html', 1, 1),
(8, 'Eliminar usuario', 'Elimine un usuario', 'eliminar_usuario.html', 1, 1),
(9, 'Ver roles', 'Listar los roles existentes', 'ver_roles.html', 1, 2),
(10, 'Actualizar rol', 'Actualizar un rol existente', 'actualizar_roles.html', 1, 2),
(11, 'Borrar rol', 'Borrar un rol', 'borrar_roles.html', 1, 2),
(12, 'Crear rol', 'Listar los roles existentes', 'crear_rol.html', 1, 2),
(13, 'Crear Menu/Submenu', 'Crear un menu o submenu', 'crear_menu.html', 1, 3),
(14, 'Ver Menu/Submenu', 'Listar los menus y submenus creados', 'ver_menu.html', 1, 3),
(15, 'Actualizar Menu/Submenu', 'Editar un menu o submenu', 'actualizar_menu.html', 1, 3),
(16, 'Borrar Menu/Submenu', 'Eliminar un menu o submenu', 'borrar_menu.html', 1, 3),
(18, 'Ver Permisos', 'Listar los permisos de los roles', 'ver_permiso.html', 1, 4),
(20, 'Actualizar Permiso', 'Editar permisos de un rol', 'editar_permiso.html', 1, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso`
--

CREATE TABLE `permiso` (
  `id` smallint(6) NOT NULL,
  `id_rol` smallint(6) NOT NULL,
  `id_menu` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permiso`
--

INSERT INTO `permiso` (`id`, `id_rol`, `id_menu`) VALUES
(83, 1, 1),
(88, 1, 2),
(93, 1, 3),
(98, 1, 4),
(84, 1, 5),
(85, 1, 6),
(86, 1, 7),
(87, 1, 8),
(89, 1, 9),
(90, 1, 10),
(91, 1, 11),
(92, 1, 12),
(94, 1, 13),
(95, 1, 14),
(96, 1, 15),
(97, 1, 16),
(99, 1, 18),
(100, 1, 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` smallint(6) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'SA', 'Super administrador del sistema', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` smallint(6) NOT NULL,
  `nombre1` varchar(50) NOT NULL,
  `nombre2` varchar(50) DEFAULT NULL,
  `apellido1` varchar(50) NOT NULL,
  `apellido2` varchar(50) DEFAULT NULL,
  `cedula` varchar(10) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `foto_perfil` text DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `id_rol` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre1`, `nombre2`, `apellido1`, `apellido2`, `cedula`, `correo`, `fecha_nacimiento`, `foto_perfil`, `telefono`, `username`, `clave`, `estado`, `id_rol`) VALUES
(1, 'Admin', NULL, 'Sistema', NULL, '1234567890', 'admin@sistema.com', '1990-01-01', NULL, '0999999999', 'admin', '$2y$10$fgh8DXCcOhLknzfQbxIVoutgnemloD3LU5bjny10f/fxaLygyHfeK', 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_menu_padre` (`id_menuPadre`);

--
-- Indices de la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_rol_menu` (`id_rol`,`id_menu`),
  ADD KEY `fk_permiso_menu` (`id_menu`);

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
  ADD UNIQUE KEY `uq_cedula` (`cedula`),
  ADD UNIQUE KEY `uq_correo` (`correo`),
  ADD UNIQUE KEY `uq_username` (`username`),
  ADD KEY `fk_usuario_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `permiso`
--
ALTER TABLE `permiso`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `fk_menu_padre` FOREIGN KEY (`id_menuPadre`) REFERENCES `menu` (`id`);

--
-- Filtros para la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD CONSTRAINT `fk_permiso_menu` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id`),
  ADD CONSTRAINT `fk_permiso_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
