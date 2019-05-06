-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2019 at 04:27 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vlab`
--

-- --------------------------------------------------------

--
-- Table structure for table `briefs`
--

CREATE TABLE `briefs` (
  `id` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `page_num` int(254) NOT NULL,
  `num` int(254) NOT NULL,
  `status` varchar(254) NOT NULL,
  `note` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `district` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `ward` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_at` int(254) NOT NULL,
  `updated_at` int(254) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `briefs`
--

INSERT INTO `briefs` (`id`, `code`, `name`, `page_num`, `num`, `status`, `note`, `district`, `ward`, `created_at`, `updated_at`) VALUES
('18571557070494', '18571557070494', 'dfdsf', 12, 12, 'watting_approval', 'mình có nhận xét', 'er', 'wer', 1557070494, 1557070494),
('224511557069383', '', 'dsfds', 324, 34534, 'watting_approval', 'dfsdfsd', 'df', 'dsfsd', 1557069383, 1557069383),
('263841557069910', '', 'hj', 1, 1, 'in_process', '', 'jhj', 'jhj', 1557069910, 1557069910),
('27611557068711', '', 'ten', 2, 423423, 'in_process', '', 'dfsd', 'ses', 1557068711, 1557068711),
('301641557069677', '', 'dfdgd', 1212, 12321, 'in_process', '', 'ewrew', 'were', 1557069677, 1557069677),
('30641557070324', '', 'dfdsf', 123, 123, 'in_process', '', 'fewrw', 'ewrwe', 1557070324, 1557070324),
('329561557052251', '', 'Luu van my', 234, 456, 'wait', '', 'dt', 'er', 1557052251, 1557052251),
('368961557068880', '', 'fdf', 12, 132, 'in_process', '', 'werew', 'efewf', 1557068880, 1557068880),
('382971557068793', '', 'ten', 2, 423423, 'in_process', '', 'dfsd', 'ses', 1557068793, 1557068793),
('515471557069252', '', 'fdsfd', 435344345, 435345, 'in_process', '', 'dsfd', 'dsfsdf', 1557069252, 1557069252),
('753721557070303', '', 'dfdsf1', 12313, 123, 'in_process', '', 'sdf', 'sds', 1557070303, 1557070303),
('804271557069824', '', 'dfdf', 1, 2, 'in_process', '', 'dgdf', 'gtreter', 1557069824, 1557069824),
('870541557069311', '', 'gdfg', 4534, 345, 'in_process', '', 'dfgd', 'fdgdf', 1557069311, 1557069311),
('899091557070620', '899091557070620', 'dfdsf', 1, 20, 'in_process', '', 'dfs', 'sdfsd', 1557070620, 1557070620),
('993131557052235', '', 'Luu van my', 234, 456, 'wait', '', 'dt', 'er', 1557052235, 1557052235),
('abc123', '', 'luu van my', 123, 1234, 'wait', '', 'quận 7', 'phường 3', 1557032352, 1557032352);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(254) NOT NULL,
  `name` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(254) NOT NULL,
  `type_user` varchar(254) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `type_user`) VALUES
('1557111037', 'Chuyên viên 001', 'chuyenvvien001@gmail.com', '$2y$10$gDXM1s4LfdZ57CU8AY3Eb.M1VmWV7dc/RnCiwJy4fYCaTqUhMH6ta', 'staff'),
('1557111038', 'Trưởng phòng', 'truongphong@gmail.com', '$2y$10$TXH.7d/7JKrGcuEMG3UwSecgADdc85jllgNwS.sgZ4K696G/NdIsK', 'manager');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `briefs`
--
ALTER TABLE `briefs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
