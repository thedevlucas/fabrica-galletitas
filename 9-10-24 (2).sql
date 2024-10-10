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
  CONSTRAINT `FK_session_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.sessions: ~4 rows (aproximadamente)
REPLACE INTO `sessions` (`id`, `userId`, `device`, `application`, `ip`, `logged`) VALUES
	(17, 2, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-10-02 20:43:52'),
	(19, 2, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-10-02 21:18:06'),
	(20, 2, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-10-02 21:18:09'),
	(22, 9, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-10-09 20:48:27');

-- Volcando estructura para tabla fabrica-galletitas.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` enum('admin','cliente','conductor','logistica','paletizador') NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` longtext NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `storeName` varchar(50) DEFAULT NULL,
  `storeAddress` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.users: ~2 rows (aproximadamente)
REPLACE INTO `users` (`id`, `group`, `username`, `password`, `name`, `lastname`, `phone`, `storeName`, `storeAddress`) VALUES
	(2, 'admin', 'admin', '$2b$10$OmEPBW3oVkurumKEfiin6OL4orH40vqWijSivRYvPsa4OzpCCCTcG', 'admin', 'admin', '0', NULL, NULL),
	(9, 'cliente', 'cliente', '$2a$10$S9eUrc2MFUMs6VrrbO0PNuHSuhOWr3v8LTqLmYOzHqjsSQuJEDuNy', 'Juan', 'Tony', '1146528456', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
