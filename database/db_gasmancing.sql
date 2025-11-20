-- phpMyAdmin SQL Dump
-- Versi Server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

-- 1. PENGATURAN AWAL
CREATE DATABASE IF NOT EXISTS db_gasmancing;
USE db_gasmancing;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
-- Matikan pemeriksaan Foreign Key sementara untuk import data yang memiliki urutan terbalik
SET FOREIGN_KEY_CHECKS = 0;


-- 2. PEMBUATAN DATABASE
CREATE DATABASE IF NOT EXISTS db_gasmancing;
USE db_gasmancing;


-- ==========================================================
-- 3. CREATE TABLE STRUCTURES
-- ==========================================================

-- Tabel: pengguna (Users)
CREATE TABLE `pengguna` (
  `id_pengguna` int(11) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `no_telepon` varchar(20) DEFAULT NULL,
  `tgl_daftar` datetime DEFAULT current_timestamp(),
  `tipe_user` enum('customer','admin') DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: fasilitas
CREATE TABLE `fasilitas` (
  `id_fasilitas` int(11) NOT NULL,
  `nama_fasilitas` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: tempat_pemancingan (Places)
CREATE TABLE `tempat_pemancingan` (
  `id_tempat` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `price_unit` varchar(50) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `open_hours` TIME DEFAULT NULL,
  `close_hours` TIME DEFAULT NULL,
  `total_reviews_count` int(11) DEFAULT 0,
  `average_rating` decimal(2,1) DEFAULT 0.0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_mitra` INT(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: tempat_fasilitas (Many-to-Many Place <-> Facility)
CREATE TABLE `tempat_fasilitas` (
  `id_tempat` int(11) NOT NULL,
  `id_fasilitas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: review
CREATE TABLE `review` (
  `id_review` int(11) NOT NULL,
  `id_tempat` int(11) DEFAULT NULL,
  `id_pengguna` int(11) DEFAULT NULL,
  `score` tinyint(4) NOT NULL,
  `comment` text DEFAULT NULL,
  `review_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: pemesanan (Bookings)
CREATE TABLE `pemesanan` (
  `id_pesanan` int(11) NOT NULL,
  `id_pengguna` int(11) DEFAULT NULL,
  `id_tempat` int(11) DEFAULT NULL,
  `nomor_pesanan` varchar(50) NOT NULL,
  `tgl_pesan` date DEFAULT curdate(),
  `tgl_mulai_sewa` date NOT NULL,
  `durasi_sewa_jam` int(11) DEFAULT NULL,
  `num_people` int(11) DEFAULT NULL,
  `total_biaya` decimal(12,2) NOT NULL,
  `status_pesanan` enum('Menunggu Pembayaran','Lunas','Dibatalkan','Selesai') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: pembayaran
CREATE TABLE `pembayaran` (
  `id_pembayaran` int(11) NOT NULL,
  `id_pesanan` int(11) DEFAULT NULL,
  `kode_bayar` varchar(50) DEFAULT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `jumlah_bayar` decimal(12,2) NOT NULL,
  `tgl_pembayaran` datetime DEFAULT current_timestamp(),
  `status_pembayaran` enum('pending','sukses','gagal') NOT NULL,
  `image_qris` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: item_sewa (Equipment)
CREATE TABLE `item_sewa` (
  `id_item` int(11) NOT NULL,
  `nama_item` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `price_unit` varchar(50) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `tipe_item` enum('peralatan','layanan') DEFAULT NULL,
  `id_tempat` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: detail_pemesanan_item (Booking Details)
CREATE TABLE `detail_pemesanan_item` (
  `id_detail` int(11) NOT NULL,
  `id_pesanan` int(11) DEFAULT NULL,
  `id_item` int(11) DEFAULT NULL,
  `kuantitas` int(11) NOT NULL,
  `harga_satuan_saat_pesan` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: kategori_ensiklopedia (Parent table)
CREATE TABLE `kategori_ensiklopedia` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: ensiklopedia (Child table)
CREATE TABLE `ensiklopedia` (
  `id_artikel` int(11) NOT NULL,
  `id_kategori` int(11) DEFAULT NULL,
  `judul` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `tgl_terbit` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: ensiklopedia_media
CREATE TABLE `ensiklopedia_media` (
  `id_media` int(11) NOT NULL,
  `id_artikel` int(11) DEFAULT NULL,
  `media_type` enum('image','video') NOT NULL,
  `media_url` varchar(255) NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: mitra
CREATE TABLE mitra (
  `id_mitra` INT(11) NOT NULL,
  `nama_lengkap` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `no_telepon` VARCHAR(20),
  `alamat` TEXT,
  `tgl_daftar` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `nama_bank` VARCHAR(50) DEFAULT NULL,
  `no_rekening` VARCHAR(50) DEFAULT NULL,
  `atas_nama_rekening` VARCHAR(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ==========================================================
-- 4. INSERT DUMMY DATA (Perbaikan Foreign Key pada Kategori Ensiklopedia)
-- ==========================================================

-- Data: pengguna
INSERT INTO `pengguna` (`id_pengguna`, `nama_lengkap`, `email`, `password_hash`, `no_telepon`, `tgl_daftar`, `tipe_user`) VALUES
(1, 'Madeu', 'test@gmail.com', '123', '3213', '2025-11-19 22:40:29', 'customer'),
(2, 'Ronggoi', 'ronggo@gmail.com', '321', '3213', '2025-11-19 22:51:48', 'customer');

-- Data: fasilitas
INSERT INTO `fasilitas` (`id_fasilitas`, `nama_fasilitas`) VALUES
(2, 'Musholla'),
(3, 'Parkiran'),
(1, 'Toilet');

-- Data: tempat_pemancingan
INSERT INTO `tempat_pemancingan` (`id_tempat`, `title`, `location`, `base_price`, `price_unit`, `image_url`, `description`, `full_description`, `open_hours`, `close_hours`, `total_reviews_count`, `average_rating`, `created_at`, `updated_at`, `id_mitra`) VALUES
(1, 'Pantai Ancol', 'Ancol, Jakarta Utara\r\n', 50000.00, 'Hari', '/img/ancol.png\r\n', 'Tempat pemancingan laut yang populer dengan fasilitas lengkap dan suasana nyaman. Cocok untuk memancing harian.', 'Bayangkan sebuah spot memancing di laut lepas dengan latar belakang silhouette megah Jakarta skyline yang berdiri gagah di kejauhan...', '09:00:00', '21:00:00', 300, 4.2, '2025-11-19 14:49:45', '2025-11-19 15:09:50', 1);

-- Data: tempat_fasilitas
INSERT INTO `tempat_fasilitas` (`id_tempat`, `id_fasilitas`) VALUES
(1, 1),
(1, 2),
(1, 3);

-- Data: review
INSERT INTO `review` (`id_review`, `id_tempat`, `id_pengguna`, `score`, `comment`, `review_date`) VALUES
(1, 1, 1, 3, '3sasdasdasdasd', '2025-11-19 22:40:45'),
(2, 1, 2, 5, 'asdsadsd', '2025-11-19 22:52:10');

-- Data: item_sewa
INSERT INTO `item_sewa` (`id_item`, `nama_item`, `price`, `price_unit`, `image_url`, `tipe_item`, `id_tempat`) VALUES
(1, 'Joran Pancing\r\n', 25000.00, 'Item', '/img/peralatan/joran.jpeg', 'peralatan', 1),
(2, 'Reel Pancing\r\n', 20000.00, 'Item', '/img/peralatan/reel.jpeg', 'peralatan', 1);

-- Data: kategori_ensiklopedia (HARUS DULUAN DARI ENSIKLOPEDIA)
INSERT INTO `kategori_ensiklopedia` (`id_kategori`, `nama_kategori`) VALUES
(1, 'Jenis Ikan'),
(2, 'Teknik Memancing'),
(3, 'Umpan'),
(4, 'Peralatan Pancing');

-- Data: ensiklopedia
INSERT INTO `ensiklopedia` (`id_artikel`, `id_kategori`, `judul`, `description`, `image_url`, `tgl_terbit`) VALUES
(1, 1, 'Ikan Gabus', 'Tips Memancing Ikan Gabus:\r\n    1. Gunakan umpan hidup seperti katak atau ikan kecil.\r\n    2. Pilih waktu pagi atau sore hari....', '/img/fish.png', '2025-11-19 15:45:43'),
(2, 1, 'Ikan Mas', 'Ikan air tawar yang populer untuk memancing kolam. Sering menggunakan umpan pelet.', '/img/fishs.png', '2025-11-19 15:45:43'),
(3, 1, 'Ikan Lele', 'Ikan air tawar yang aktif di malam hari. Cocok menggunakan umpan cacing atau usus ayam.', '/img/fishss.png', '2025-11-19 15:45:43'),
(4, 1, 'Ikan Patin', 'Ikan tawar omnivora, pertarungan yang kuat. Umpan terbaik: pelet campuran.', '/img/fishsss.png', '2025-11-19 15:45:43'),
(5, 1, 'Ikan Bawal', 'Ikan dengan gigitan kuat. Hati-hati saat melepaskan kail. Umpan terbaik: daging atau pelet amis.', '/img/fishssss.png', '2025-11-19 15:45:43'),
(20, 2, 'Teknik Memancing', '🎣 Teknik Memancing Lengkap Untuk Semua Kondisi. 1. Teknik Casting. 2. Teknik Dasaran. 3. Teknik Fly Fishing...', '/img/produk1.png', '2025-11-19 15:45:43'),
(30, 3, 'Umpan Terbaik', '🎣 Umpan Terbaik Untuk Berbagai Ikan. 1. Ikan Lele — Gunakan umpan cacing tanah. 2. Ikan Gabus — Katak hidup...', '/img/umpan.jpg', '2025-11-19 15:45:43'),
(40, 4, 'Pancingan Terbaik', '🏆 Pancingan Terbaik untuk Berbagai Kondisi. 1. Joran Spinning. 2. Reel Baitcasting. 3. Senar PE...', '/img/pancingan.jpg', '2025-11-19 15:45:43'),
(50, 1, 'Jenis Ikan', '🐠 Jenis-Jenis Ikan Populer di Indonesia. 1. Ikan Air Tawar. 2. Ikan Air Payau. 3. Ikan Laut...', '/img/jenisikan.jpg', '2025-11-19 15:45:43'),
(60, NULL, 'Perawatan Reel', 'Panduan lengkap cara membersihkan dan melumasi reel pancing Anda agar selalu prima. Perawatan rutin meningkatkan umur reel.', '/img/pancingan.jpg', '2025-11-19 16:04:46'),
(70, NULL, 'Spot Muara', 'Tips menemukan spot memancing terbaik di area muara sungai, tempat pertemuan air tawar dan laut. Ikan yang sering didapat: Kakap, Barramundi, dan Kerapu.', '/img/jenisikan.jpg', '2025-11-19 16:04:46'),
(80, NULL, 'Joran Carbon', 'Keunggulan dan kekurangan menggunakan joran berbahan karbon fiber. Joran karbon ringan, sensitif, namun rentan patah jika salah perlakuan.', '/img/produk1.png', '2025-11-19 16:04:46'),
(90, NULL, 'Tali Senar PE', 'Jenis-jenis senar PE (Polyethylene) dan cara memilih ukuran yang tepat sesuai target ikan. Senar PE memiliki kekuatan tarikan yang sangat tinggi.', '/img/umpan.jpg', '2025-11-19 16:04:46');

-- Data: ensiklopedia_media
INSERT INTO `ensiklopedia_media` (`id_media`, `id_artikel`, `media_type`, `media_url`, `keterangan`) VALUES
(1, 1, 'image', '/img/fishs.png', 'Gabus siap menyambar'),
(2, 1, 'video', 'https://www.youtube.com/embed/KA2-caMdYlM?si=nUxTHNJbOO3qrBzt', 'Video cara casting gabus'),
(3, 1, 'image', '/img/fishs.png', 'Gabus besar'),
(4, 1, 'image', '/img/gabus3.jpg', 'Spot mancing gabus'),
(5, 1, 'image', '/img/gabus4.jpg', 'Gabus di rawa-rawa'),
(6, 20, 'image', '/img/produk1.png', 'Ilustrasi teknik casting'),
(7, 20, 'video', 'https://www.youtube.com/embed/Uvg0R0kPGYM', 'Video tutorial teknik dasaran'),
(8, 20, 'image', '/img/produk1.png', 'Ilustrasi teknik dasaran'),
(9, 30, 'image', '/img/umpan1.jpg', 'Umpan cacing tanah'),
(10, 30, 'video', 'https://www.youtube.com/embed/H6hErwPTKGo', 'Video membuat umpan pelet'),
(11, 30, 'image', '/img/umpan2.jpg', 'Adonan pelet'),
(12, 30, 'image', '/img/umpan3.jpg', 'Umpan buatan (lure)'),
(13, 40, 'image', '/img/pancing1.jpg', 'Joran spinning'),
(14, 40, 'video', 'https://www.youtube.com/embed/o5jIGxZzJ9Q', 'Video review reel baitcasting'),
(15, 40, 'image', '/img/pancing2.jpg', 'Reel baitcasting'),
(16, 50, 'image', '/img/ikanair.jpg', 'Ikan air tawar'),
(17, 50, 'image', '/img/ikanlaut.jpg', 'Ikan laut'),
(18, 50, 'video', 'https://www.youtube.com/embed/hvR1hGQkKq8', 'Video jenis-jenis ikan di Indonesia'),
(19, 60, 'image', '/img/pancing1.jpg', 'Alat-alat penting untuk membersihkan reel'),
(20, 60, 'video', 'https://www.youtube.com/embed/P-qK7s8-E4E', 'Video tutorial pelumasan reel pancing'),
(21, 70, 'image', '/img/ikanlaut.jpg', 'Pemandangan spot mancing di muara'),
(22, 70, 'video', 'https://www.youtube.com/embed/5k5eJkQo-a8', 'Mancing Kakap Merah di muara'),
(23, 80, 'image', '/img/pancing2.jpg', 'Joran karbon dengan desain minimalis'),
(24, 90, 'image', '/img/umpan1.jpg', 'Aneka ukuran senar PE untuk berbagai teknik');

-- Data: mitra
INSERT INTO `mitra` (`id_mitra`, `nama_lengkap`, `email`, `password_hash`, `no_telepon`, `alamat`, `tgl_daftar`, `nama_bank`, `no_rekening`, `atas_nama_rekening`) VALUES
(1, 'Budi Santoso', 'budi.ancol@mail.com', 'adminAncol123', '081211112222', 'Jalan Marina, Jakarta Utara', NOW(), 'BCA', '123456789', 'PT ANCOL JAYA ABADI'),
(2, 'Rini Kartika', 'rini.cibiru@mail.com', 'adminCibiru123', '081233334444', 'Komplek Cibiru Indah, Bandung', NOW(), 'Mandiri', '987654321', 'CV CIBIRU MANCING');


INSERT INTO `pemesanan` (`id_pesanan`, `id_pengguna`, `id_tempat`, `nomor_pesanan`, `tgl_pesan`, `tgl_mulai_sewa`, `durasi_sewa_jam`, `num_people`, `total_biaya`, `status_pesanan`) VALUES
(1, 1, 1, 'B-291478729', '2025-11-20', '2025-11-06', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(2, 1, 1, 'B-295234960', '2025-11-20', '2025-11-06', 1, 1, 60000.00, 'Menunggu Pembayaran'),
(3, 1, 1, 'B-403269696', '2025-11-20', '2025-11-20', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(4, 1, 1, 'B-543918631', '2025-11-20', '2025-11-13', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(5, 1, 1, 'B-552964274', '2025-11-20', '2025-11-14', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(6, 1, 1, 'B-096454166', '2025-11-20', '2025-11-21', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(7, 1, 1, 'B-170969408', '2025-11-20', '2025-11-21', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(8, 1, 1, 'B-178858288', '2025-11-20', '2025-11-21', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(9, 1, 1, 'B-482349294', '2025-11-20', '2025-11-07', 1, 1, 140000.00, 'Menunggu Pembayaran'),
(10, 1, 1, 'B-355804865', '2025-11-20', '2025-11-29', 2, 2, 345000.00, 'Menunggu Pembayaran'),
(11, 1, 1, 'B-391796605', '2025-11-20', '2025-11-28', 2, 4, 610000.00, 'Menunggu Pembayaran'),
(12, 1, 1, 'B-120532787', '2025-11-20', '0000-00-00', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(13, 1, 1, 'B-139927629', '2025-11-20', '2025-11-18', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(14, 1, 1, 'B-260733392', '2025-11-20', '2025-11-28', 1, 1, 100000.00, 'Menunggu Pembayaran'),
(15, 1, 1, 'B-517380309', '2025-11-20', '2025-11-28', 1, 1, 100000.00, 'Menunggu Pembayaran'),
(16, 1, 1, 'B-538685739', '2025-11-20', '2025-11-19', 3, 2, 310000.00, 'Menunggu Pembayaran'),
(17, 1, 1, 'B-320209530', '2025-11-20', '2025-11-29', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(18, 1, 1, 'B-783093834', '2025-11-20', '2025-11-12', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(19, 1, 1, 'B-779007594', '2025-11-20', '2025-11-07', 1, 1, 95000.00, 'Menunggu Pembayaran'),
(20, 1, 1, 'B-821219969', '2025-11-20', '2025-11-08', 1, 1, 70000.00, 'Menunggu Pembayaran'),
(21, 1, 1, 'B-623829657', '2025-11-20', '2025-11-22', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(22, 1, 1, 'B-097281720', '2025-11-20', '2025-11-12', 1, 1, 70000.00, 'Menunggu Pembayaran'),
(23, 1, 1, 'B-111103716', '2025-11-20', '2025-11-14', 1, 1, 70000.00, 'Menunggu Pembayaran'),
(24, 1, 1, 'B-987654321', '2025-11-20', '2025-11-25', 3, 2, 450000.00, 'Menunggu Pembayaran'),
(25, 1, 1, 'B-113955306', '2025-11-20', '2025-11-06', 1, 1, 70000.00, 'Menunggu Pembayaran'),
(26, 1, 1, 'B-930474977', '2025-11-20', '2025-11-29', 1, 1, 120000.00, 'Menunggu Pembayaran'),
(27, 1, 1, 'B-140870390', '2025-11-21', '2025-11-27', 1, 1, 145000.00, 'Menunggu Pembayaran'),
(28, 1, 1, 'B-229735870', '2025-11-21', '2025-12-04', 1, 1, 90000.00, 'Menunggu Pembayaran'),
(29, 1, 1, 'B-254180301', '2025-11-21', '2025-12-04', 1, 1, 115000.00, 'Menunggu Pembayaran'),
(30, 1, 1, 'B-389211863', '2025-11-21', '2025-11-19', 1, 1, 120000.00, 'Menunggu Pembayaran'),
(31, 1, 1, 'B-453534703', '2025-11-21', '2025-12-06', 9, 2, 990000.00, 'Menunggu Pembayaran');

INSERT INTO `detail_pemesanan_item` (`id_detail`, `id_pesanan`, `id_item`, `kuantitas`, `harga_satuan_saat_pesan`, `subtotal`) VALUES
(1, 24, 1, 1, 25000.00, 25000.00),
(2, 24, 2, 2, 20000.00, 40000.00),
(3, 30, 1, 2, 25000.00, 50000.00),
(4, 30, 2, 1, 20000.00, 20000.00),
(5, 31, 1, 2, 25000.00, 50000.00),
(6, 31, 2, 2, 20000.00, 40000.00);

-- ==========================================================
-- 5. PRIMARY KEYS (Indeks)
-- ==========================================================

ALTER TABLE `detail_pemesanan_item` ADD PRIMARY KEY (`id_detail`), ADD KEY `id_pesanan` (`id_pesanan`), ADD KEY `id_item` (`id_item`);
ALTER TABLE `ensiklopedia` ADD PRIMARY KEY (`id_artikel`), ADD KEY `id_kategori` (`id_kategori`);
ALTER TABLE `ensiklopedia_media` ADD PRIMARY KEY (`id_media`), ADD KEY `id_artikel` (`id_artikel`);
ALTER TABLE `fasilitas` ADD PRIMARY KEY (`id_fasilitas`), ADD UNIQUE KEY `nama_fasilitas` (`nama_fasilitas`);
ALTER TABLE `item_sewa` ADD PRIMARY KEY (`id_item`), ADD KEY `id_tempat` (`id_tempat`);
ALTER TABLE `kategori_ensiklopedia` ADD PRIMARY KEY (`id_kategori`), ADD UNIQUE KEY `nama_kategori` (`nama_kategori`);
ALTER TABLE `pembayaran` ADD PRIMARY KEY (`id_pembayaran`), ADD UNIQUE KEY `id_pesanan` (`id_pesanan`);
ALTER TABLE `pemesanan` ADD PRIMARY KEY (`id_pesanan`), ADD UNIQUE KEY `nomor_pesanan` (`nomor_pesanan`), ADD KEY `id_pengguna` (`id_pengguna`), ADD KEY `id_tempat` (`id_tempat`);
ALTER TABLE `pengguna` ADD PRIMARY KEY (`id_pengguna`), ADD UNIQUE KEY `email` (`email`);
ALTER TABLE `review` ADD PRIMARY KEY (`id_review`), ADD KEY `id_tempat` (`id_tempat`), ADD KEY `id_pengguna` (`id_pengguna`);
ALTER TABLE `tempat_fasilitas` ADD PRIMARY KEY (`id_tempat`,`id_fasilitas`), ADD KEY `id_fasilitas` (`id_fasilitas`);
ALTER TABLE `tempat_pemancingan` ADD PRIMARY KEY (`id_tempat`);
ALTER TABLE `mitra` ADD PRIMARY KEY (`id_mitra`), ADD UNIQUE KEY `email` (`email`);


-- ==========================================================
-- 6. AUTO INCREMENTS
-- ==========================================================

ALTER TABLE `detail_pemesanan_item` MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `ensiklopedia` MODIFY `id_artikel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91; -- Disesuaikan dengan data terakhir
ALTER TABLE `ensiklopedia_media` MODIFY `id_media` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25; -- Disesuaikan dengan data terakhir
ALTER TABLE `fasilitas` MODIFY `id_fasilitas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
ALTER TABLE `item_sewa` MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE `kategori_ensiklopedia` MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5; -- Disesuaikan dengan data terakhir
ALTER TABLE `pembayaran` MODIFY `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `pemesanan` MODIFY `id_pesanan` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `pengguna` MODIFY `id_pengguna` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE `review` MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE `tempat_pemancingan` MODIFY `id_tempat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
ALTER TABLE `mitra` MODIFY `id_mitra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;


-- ==========================================================
-- 7. FOREIGN KEY CONSTRAINTS (Ketidakleluasaan)
-- ==========================================================

-- Aktifkan kembali pemeriksaan Foreign Key
SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE `detail_pemesanan_item` ADD CONSTRAINT `detail_pemesanan_item_ibfk_1` FOREIGN KEY (`id_pesanan`) REFERENCES `pemesanan` (`id_pesanan`), ADD CONSTRAINT `detail_pemesanan_item_ibfk_2` FOREIGN KEY (`id_item`) REFERENCES `item_sewa` (`id_item`);
ALTER TABLE `ensiklopedia` ADD CONSTRAINT `ensiklopedia_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_ensiklopedia` (`id_kategori`);
ALTER TABLE `ensiklopedia_media` ADD CONSTRAINT `ensiklopedia_media_ibfk_1` FOREIGN KEY (`id_artikel`) REFERENCES `ensiklopedia` (`id_artikel`);
ALTER TABLE `item_sewa` ADD CONSTRAINT `item_sewa_ibfk_1` FOREIGN KEY (`id_tempat`) REFERENCES `tempat_pemancingan` (`id_tempat`);
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`id_pesanan`) REFERENCES `pemesanan` (`id_pesanan`);
ALTER TABLE `pemesanan` ADD CONSTRAINT `pemesanan_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`), ADD CONSTRAINT `pemesanan_ibfk_2` FOREIGN KEY (`id_tempat`) REFERENCES `tempat_pemancingan` (`id_tempat`);
ALTER TABLE `review` ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`id_tempat`) REFERENCES `tempat_pemancingan` (`id_tempat`), ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`);
ALTER TABLE `tempat_fasilitas` ADD CONSTRAINT `tempat_fasilitas_ibfk_1` FOREIGN KEY (`id_tempat`) REFERENCES `tempat_pemancingan` (`id_tempat`), ADD CONSTRAINT `tempat_fasilitas_ibfk_2` FOREIGN KEY (`id_fasilitas`) REFERENCES `fasilitas` (`id_fasilitas`);
ALTER TABLE `tempat_pemancingan` ADD CONSTRAINT `tempat_pemancingan_ibfk_3` FOREIGN KEY (`id_mitra`) REFERENCES `mitra` (`id_mitra`) ON DELETE SET NULL;

COMMIT;