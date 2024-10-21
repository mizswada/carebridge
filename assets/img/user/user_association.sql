-- Adminer 4.8.1 MySQL 8.0.29 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `user_association`;
CREATE TABLE `user_association` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `association_category` int NOT NULL,
  `registration_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `license_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `membership_details` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `establishment_date` date DEFAULT NULL,
  `association_type` int NOT NULL,
  `objectives` text COLLATE utf8mb4_unicode_ci,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `association_logo` text COLLATE utf8mb4_unicode_ci,
  `operational_area` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `association_address_line1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `association_address_line2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `association_address_city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `association_address_postcode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `association_address_state` int NOT NULL,
  `association_address_country` int NOT NULL,
  `pic_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pic_phoneNum` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pic_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_licenses` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `documents_certificates` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user` (`user_id`),
  KEY `association_category` (`association_category`),
  KEY `association_address_state` (`association_address_state`),
  KEY `association_address_country` (`association_address_country`),
  KEY `association_type` (`association_type`),
  CONSTRAINT `association_address_country` FOREIGN KEY (`association_address_country`) REFERENCES `lookup` (`lookupID`),
  CONSTRAINT `association_address_state` FOREIGN KEY (`association_address_state`) REFERENCES `lookup` (`lookupID`),
  CONSTRAINT `association_category` FOREIGN KEY (`association_category`) REFERENCES `category` (`category_id`),
  CONSTRAINT `association_type` FOREIGN KEY (`association_type`) REFERENCES `lookup` (`lookupID`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user_association` (`id`, `user_id`, `association_category`, `registration_number`, `license_number`, `membership_details`, `establishment_date`, `association_type`, `objectives`, `website`, `association_logo`, `operational_area`, `association_address_line1`, `association_address_line2`, `association_address_city`, `association_address_postcode`, `association_address_state`, `association_address_country`, `pic_name`, `pic_phoneNum`, `pic_email`, `document_licenses`, `documents_certificates`) VALUES
(1,	36,	19,	'Academy of Medicine of Malaysia (AMM)',	'Academy of Medicine of Malaysia (AMM)',	'Academy of Medicine of Malaysia (AMM)',	'2024-10-09',	18,	'Academy of Medicine of Malaysia (AMM)',	'https://www.acadmed.org.my/',	'/uploads/association/1729086473075_169_logo-acadmed.png',	'Academy of Medicine of Malaysia (AMM)',	'https://www.acadmed.org.my/',	NULL,	'johor',	'89000',	2,	1,	'ali',	'0987654321',	'ali@gmail.com',	'/uploads/association/1729086472864_898_samplepdf.pdf',	'/uploads/association/1729086472974_606_samplepdf.pdf');

-- 2024-10-20 22:52:51
