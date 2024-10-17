-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.24-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para fabrica-galletitas
CREATE DATABASE IF NOT EXISTS `fabrica-galletitas` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `fabrica-galletitas`;

-- Volcando estructura para tabla fabrica-galletitas.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store` int(11) NOT NULL,
  `order` mediumtext NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 0,
  `code` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__stores` (`store`),
  CONSTRAINT `FK__stores` FOREIGN KEY (`store`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.orders: ~4 rows (aproximadamente)
REPLACE INTO `orders` (`id`, `store`, `order`, `date`, `status`, `code`) VALUES
	(1, 2, 'xa', '2024-10-14', 1, 0),
	(4, 2, '3 de tussi con merca', '2024-10-16', 0, 1081),
	(5, 2, 'quiero 2 kilos de penes', '2024-10-16', 0, 9235),
	(6, 2, 'y 4 de waska', '2024-10-16', 0, 8939);

-- Volcando estructura para tabla fabrica-galletitas.orders_logs
CREATE TABLE IF NOT EXISTS `orders_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `comments` mediumtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_orders_logs_orders` (`order`),
  KEY `FK_orders_logs_users` (`user`),
  CONSTRAINT `FK_orders_logs_orders` FOREIGN KEY (`order`) REFERENCES `orders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_orders_logs_users` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.orders_logs: ~1 rows (aproximadamente)
REPLACE INTO `orders_logs` (`id`, `order`, `user`, `date`, `comments`) VALUES
	(1, 1, 11, '2024-10-16 21:22:08', 'confirmadisomo hemrnao');

-- Volcando estructura para tabla fabrica-galletitas.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `device` varchar(50) NOT NULL DEFAULT 'Unknown',
  `application` varchar(50) NOT NULL DEFAULT 'Unknown',
  `ip` varchar(50) NOT NULL DEFAULT 'Unknown',
  `logged` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_session_users` (`userId`),
  CONSTRAINT `FK_session_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.sessions: ~5 rows (aproximadamente)
REPLACE INTO `sessions` (`id`, `userId`, `device`, `application`, `ip`, `logged`) VALUES
	(26, 10, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-10-14 20:55:37'),
	(28, 2, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-10-16 15:43:26'),
	(31, 11, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-10-16 19:54:53'),
	(33, 10, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-10-16 20:20:08'),
	(34, 10, 'Microsoft Windows', 'Chrome', '10.160.9.117', '2024-10-16 21:02:12');

-- Volcando estructura para tabla fabrica-galletitas.stores
CREATE TABLE IF NOT EXISTS `stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_stores_users` (`user`),
  CONSTRAINT `FK_stores_users` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.stores: ~1 rows (aproximadamente)
REPLACE INTO `stores` (`id`, `user`, `name`, `address`) VALUES
	(2, 10, 'Tussy Warriors', 'Av. Cabildo 3185');

-- Volcando estructura para tabla fabrica-galletitas.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` enum('admin','cliente','conductor','logistica','paletizador') NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` longtext NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.users: ~3 rows (aproximadamente)
REPLACE INTO `users` (`id`, `group`, `username`, `password`, `name`, `lastname`, `phone`) VALUES
	(2, 'admin', 'admin', '$2b$10$OmEPBW3oVkurumKEfiin6OL4orH40vqWijSivRYvPsa4OzpCCCTcG', 'admin', 'admin', '0'),
	(10, 'cliente', 'cliente', '$2a$10$hGvC.x1qeoc4zFarGgTJIeh/I0O0cpOtFcdoJOANZKcBZxm9EfeOK', 'Juan', 'Antonio', '11548759487'),
	(11, 'paletizador', 'paletizador', '$2a$10$kzUNCv.qW3rGqPgc5I1p3e/ynBfyLozGuYybmgY62m167sPNiIA6a', 'Paletizador', 'Paletizado', '116485488');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
