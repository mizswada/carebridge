-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 20, 2024 at 11:03 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carebridge`
--

-- --------------------------------------------------------

--
-- Table structure for table `user_admin`
--

CREATE TABLE `user_admin` (
  `admin_id` int NOT NULL,
  `admin_user_id` int DEFAULT NULL,
  `admin_gender` int NOT NULL,
  `admin_date_of_birth` date DEFAULT NULL,
  `admin_address_line1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_address_line2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_address_city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_address_postcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_address_state` int NOT NULL,
  `admin_address_country` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_admin`
--
ALTER TABLE `user_admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD KEY `admin_gender` (`admin_gender`),
  ADD KEY `admin_address_country` (`admin_address_country`),
  ADD KEY `admin_address_state` (`admin_address_state`),
  ADD KEY `admin_user_id` (`admin_user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user_admin`
--
ALTER TABLE `user_admin`
  MODIFY `admin_id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_admin`
--
ALTER TABLE `user_admin`
  ADD CONSTRAINT `admin_address_country` FOREIGN KEY (`admin_address_country`) REFERENCES `lookup` (`lookupID`),
  ADD CONSTRAINT `admin_address_state` FOREIGN KEY (`admin_address_state`) REFERENCES `lookup` (`lookupID`),
  ADD CONSTRAINT `admin_gender` FOREIGN KEY (`admin_gender`) REFERENCES `lookup` (`lookupID`),
  ADD CONSTRAINT `admin_user_id` FOREIGN KEY (`admin_user_id`) REFERENCES `user` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
