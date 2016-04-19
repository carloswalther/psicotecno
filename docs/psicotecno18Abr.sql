-- phpMyAdmin SQL Dump
-- version 4.5.0.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 19, 2016 at 02:52 AM
-- Server version: 10.0.17-MariaDB
-- PHP Version: 5.5.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `psicotecno`
--

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `name` varchar(255) DEFAULT NULL,
  `rut` varchar(255) DEFAULT NULL,
  `centralPayment` tinyint(1) DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`name`, `rut`, `centralPayment`, `id`, `createdAt`, `updatedAt`) VALUES
('Red Global', '76010776-k', 1, 1, NULL, NULL),
('Otra Company', '16010776-k', 0, 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

CREATE TABLE `exam` (
  `name` varchar(255) DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exam`
--

INSERT INTO `exam` (`name`, `id`, `createdAt`, `updatedAt`) VALUES
('B1', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `historic`
--

CREATE TABLE `historic` (
  `patient` int(11) DEFAULT NULL,
  `exam` int(11) DEFAULT NULL,
  `company` int(11) DEFAULT NULL,
  `cc` varchar(255) DEFAULT NULL,
  `respApplication` varchar(255) DEFAULT NULL,
  `registerDate` date DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `historic`
--

INSERT INTO `historic` (`patient`, `exam`, `company`, `cc`, `respApplication`, `registerDate`, `id`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, NULL, NULL, '2016-04-18', 1, '2016-04-01 00:00:00', NULL),
(1, 1, 1, NULL, NULL, '2016-04-19', 2, '2016-04-18 14:58:38', '2016-04-18 14:58:38'),
(2, 1, 1, NULL, NULL, NULL, 3, '2016-04-18 15:00:19', '2016-04-18 15:00:19'),
(2, 1, 1, NULL, NULL, NULL, 4, '2016-04-18 15:02:33', '2016-04-18 15:02:33'),
(2, 1, 1, NULL, NULL, NULL, 5, '2016-04-18 15:03:08', '2016-04-18 15:03:08'),
(2, 1, 1, NULL, NULL, NULL, 6, '2016-04-18 15:05:48', '2016-04-18 15:05:48'),
(1, 1, 1, NULL, NULL, NULL, 7, '2016-04-18 15:08:26', '2016-04-18 15:08:26'),
(1, 1, 2, NULL, NULL, NULL, 8, '2016-04-18 15:09:58', '2016-04-18 15:09:58'),
(1, 1, 1, NULL, NULL, NULL, 9, '2016-04-18 15:11:50', '2016-04-18 15:11:50'),
(2, 1, 1, NULL, NULL, NULL, 10, '2016-04-18 17:56:45', '2016-04-18 17:56:45'),
(1, 1, 1, NULL, NULL, '2016-04-19', 11, '2016-04-18 20:41:30', '2016-04-18 20:41:30'),
(1, 1, 1, '1234carv', 'Pamela Araya', '2016-04-20', 12, '2016-04-18 20:49:46', '2016-04-18 20:49:46'),
(4, 1, 1, NULL, NULL, '2016-04-20', 13, '2016-04-18 21:34:44', '2016-04-18 21:34:44');

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `name` varchar(255) DEFAULT NULL,
  `rut` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`name`, `rut`, `lastName`, `id`, `createdAt`, `updatedAt`) VALUES
('Carlos ', '15162414-6', 'Walther', 1, NULL, NULL),
('Claudio', '16162414-6', 'Cisterna', 2, NULL, NULL),
('Pamela', '16766069-k', 'Araya', 3, '2016-04-18 21:32:26', '2016-04-18 21:32:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `historic`
--
ALTER TABLE `historic`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rut` (`rut`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `exam`
--
ALTER TABLE `exam`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `historic`
--
ALTER TABLE `historic`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
