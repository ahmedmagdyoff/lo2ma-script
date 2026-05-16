-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 16, 2026 at 11:33 AM
-- Server version: 8.4.8-8
-- PHP Version: 8.1.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lo2mascript`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `image`, `created_at`) VALUES
(1, 'Classic Smash Burger', 'Double smashed patties, cheddar, caramelised onions & secret sauce.', 9.99, 'burgers', 'photo-1568901346375-23c9450c58cd.jpg', '2026-05-15 00:41:50'),
(2, 'Crispy Chicken Burger', 'Buttermilk fried chicken, pickles, sriracha mayo & brioche bun.', 10.49, 'burgers', 'photo-1606755962773-d324e0a13086.jpg', '2026-05-15 00:41:50'),
(3, 'Mushroom Swiss Melt', 'Beef patty, sautéed mushrooms, Swiss cheese & garlic aioli.', 11.29, 'burgers', 'photo-1553979459-d2229ba7433b.jpg', '2026-05-15 00:41:50'),
(4, 'Margherita Classica', 'San Marzano tomato, fresh mozzarella, basil & extra-virgin olive oil.', 12.99, 'pizza', 'photo-1574071318508-1cdbab80d002.jpg', '2026-05-15 00:41:50'),
(5, 'Pepperoni Blaze', 'Double pepperoni, smoked mozzarella, chilli flakes & honey drizzle.', 14.49, 'pizza', 'photo-1628840042765-356cda07504e.jpg', '2026-05-15 00:41:50'),
(6, 'Truffle Mushroom', 'White truffle base, wild mushrooms, fontina & fresh thyme.', 15.99, 'pizza', 'photo-1565299624946-b28f40a0ae38.jpg', '2026-05-15 00:41:50'),
(7, 'Watermelon Lemonade', 'Fresh watermelon, squeezed lemon, mint & a pinch of sea salt.', 4.49, 'drinks', 'photo-1497534446932-c925b458314e.jpg', '2026-05-15 00:41:50'),
(8, 'Cold Brew Float', 'Double-strength cold brew topped with salted-caramel ice cream.', 5.99, 'drinks', 'photo-1461023058943-07fcbe16d735.jpg', '2026-05-15 00:41:50'),
(9, 'Mango Chili Smoothie', 'Ripe mango, coconut milk, lime juice & a hint of chilli.', 5.49, 'drinks', 'photo-1623065422902-30a2d299bbe4.jpg', '2026-05-15 00:41:50'),
(10, 'Burnt Basque Cheesecake', 'Caramelised crust, silky cream-cheese centre & berry coulis.', 6.99, 'desserts', 'photo-1533134242443-d4fd215305ad.jpg', '2026-05-15 00:41:50'),
(11, 'Molten Lava Cake', 'Warm dark-chocolate cake with a gooey centre & vanilla bean ice cream.', 7.49, 'desserts', 'photo-1606313564200-e75d5e30476c.jpg', '2026-05-15 00:41:50'),
(12, 'Pistachio Knafeh', 'Crispy shredded pastry, sweet cheese, rose water & crushed pistachios.', 6.49, 'desserts', 'photo-1579954115545-a95591f28bfc.jpg', '2026-05-15 00:41:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
