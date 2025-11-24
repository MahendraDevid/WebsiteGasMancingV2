-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 24 Nov 2025 pada 08.19
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_gasmancing`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_pemesanan_item`
--

CREATE TABLE `detail_pemesanan_item` (
  `id_detail` int(11) NOT NULL,
  `id_pesanan` int(11) DEFAULT NULL,
  `id_item` int(11) DEFAULT NULL,
  `kuantitas` int(11) NOT NULL,
  `harga_satuan_saat_pesan` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `detail_pemesanan_item`
--

INSERT INTO `detail_pemesanan_item` (`id_detail`, `id_pesanan`, `id_item`, `kuantitas`, `harga_satuan_saat_pesan`, `subtotal`) VALUES
(1, 24, 1, 1, 25000.00, 25000.00),
(2, 24, 2, 2, 20000.00, 40000.00),
(3, 30, 1, 2, 25000.00, 50000.00),
(4, 30, 2, 1, 20000.00, 20000.00),
(5, 31, 1, 2, 25000.00, 50000.00),
(6, 31, 2, 2, 20000.00, 40000.00),
(7, 37, 2, 1, 20000.00, 20000.00),
(8, 39, 1, 1, 25000.00, 25000.00),
(9, 39, 2, 1, 20000.00, 20000.00),
(10, 43, 1, 1, 25000.00, 25000.00),
(11, 43, 2, 1, 20000.00, 20000.00),
(12, 44, 2, 1, 20000.00, 20000.00),
(13, 46, 1, 1, 25000.00, 25000.00),
(14, 46, 2, 1, 20000.00, 20000.00),
(15, 47, 2, 1, 20000.00, 20000.00),
(16, 59, 2, 2, 20000.00, 40000.00),
(17, 60, 1, 1, 25000.00, 25000.00),
(18, 60, 2, 1, 20000.00, 20000.00),
(19, 63, 1, 1, 25000.00, 25000.00),
(20, 63, 2, 1, 20000.00, 20000.00),
(21, 64, 2, 1, 20000.00, 20000.00),
(22, 65, 2, 1, 20000.00, 20000.00),
(23, 66, 2, 1, 20000.00, 20000.00),
(24, 67, 2, 1, 20000.00, 20000.00),
(25, 68, 1, 5, 25000.00, 125000.00),
(26, 68, 2, 5, 20000.00, 100000.00),
(27, 73, 2, 1, 20000.00, 20000.00),
(28, 94, 1, 1, 25000.00, 25000.00),
(29, 94, 2, 1, 20000.00, 20000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `ensiklopedia`
--

CREATE TABLE `ensiklopedia` (
  `id_artikel` int(11) NOT NULL,
  `id_kategori` int(11) DEFAULT NULL,
  `judul` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `tgl_terbit` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `ensiklopedia`
--

INSERT INTO `ensiklopedia` (`id_artikel`, `id_kategori`, `judul`, `description`, `image_url`, `tgl_terbit`) VALUES
(1, 1, 'Ikan Gabus', 'Tips Memancing Ikan Gabus:\r\n    1. Gunakan umpan hidup seperti katak atau ikan kecil.\r\n    2. Pilih waktu pagi atau sore hari....', '/img/fish.png', '2025-11-19'),
(2, 1, 'Ikan Mas', 'Ikan air tawar yang populer untuk memancing kolam. Sering menggunakan umpan pelet.', '/img/fishs.png', '2025-11-19'),
(3, 1, 'Ikan Lele', 'Ikan air tawar yang aktif di malam hari. Cocok menggunakan umpan cacing atau usus ayam.', '/img/fishss.png', '2025-11-19'),
(4, 1, 'Ikan Patin', 'Ikan tawar omnivora, pertarungan yang kuat. Umpan terbaik: pelet campuran.', '/img/fishsss.png', '2025-11-19'),
(5, 1, 'Ikan Bawal', 'Ikan dengan gigitan kuat. Hati-hati saat melepaskan kail. Umpan terbaik: daging atau pelet amis.', '/img/fishssss.png', '2025-11-19'),
(20, 2, 'Teknik Memancing', '🎣 Teknik Memancing Lengkap Untuk Semua Kondisi. 1. Teknik Casting. 2. Teknik Dasaran. 3. Teknik Fly Fishing...', '/img/produk1.png', '2025-11-19'),
(30, 3, 'Umpan Terbaik', '🎣 Umpan Terbaik Untuk Berbagai Ikan. 1. Ikan Lele — Gunakan umpan cacing tanah. 2. Ikan Gabus — Katak hidup...', '/img/umpan.jpg', '2025-11-19'),
(40, 4, 'Pancingan Terbaik', '🏆 Pancingan Terbaik untuk Berbagai Kondisi. 1. Joran Spinning. 2. Reel Baitcasting. 3. Senar PE...', '/img/pancingan.jpg', '2025-11-19'),
(50, 1, 'Jenis Ikan', '🐠 Jenis-Jenis Ikan Populer di Indonesia. 1. Ikan Air Tawar. 2. Ikan Air Payau. 3. Ikan Laut...', '/img/jenisikan.jpg', '2025-11-19'),
(60, NULL, 'Perawatan Reel', 'Panduan lengkap cara membersihkan dan melumasi reel pancing Anda agar selalu prima. Perawatan rutin meningkatkan umur reel.', '/img/pancingan.jpg', '2025-11-19'),
(70, NULL, 'Spot Muara', 'Tips menemukan spot memancing terbaik di area muara sungai, tempat pertemuan air tawar dan laut. Ikan yang sering didapat: Kakap, Barramundi, dan Kerapu.', '/img/jenisikan.jpg', '2025-11-19'),
(80, NULL, 'Joran Carbon', 'Keunggulan dan kekurangan menggunakan joran berbahan karbon fiber. Joran karbon ringan, sensitif, namun rentan patah jika salah perlakuan.', '/img/produk1.png', '2025-11-19'),
(90, NULL, 'Tali Senar PE', 'Jenis-jenis senar PE (Polyethylene) dan cara memilih ukuran yang tepat sesuai target ikan. Senar PE memiliki kekuatan tarikan yang sangat tinggi.', '/img/umpan.jpg', '2025-11-19');

-- --------------------------------------------------------

--
-- Struktur dari tabel `ensiklopedia_media`
--

CREATE TABLE `ensiklopedia_media` (
  `id_media` int(11) NOT NULL,
  `id_artikel` int(11) DEFAULT NULL,
  `media_type` enum('image','video') NOT NULL,
  `media_url` varchar(255) NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `ensiklopedia_media`
--

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

-- --------------------------------------------------------

--
-- Struktur dari tabel `fasilitas`
--

CREATE TABLE `fasilitas` (
  `id_fasilitas` int(11) NOT NULL,
  `nama_fasilitas` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `fasilitas`
--

INSERT INTO `fasilitas` (`id_fasilitas`, `nama_fasilitas`) VALUES
(2, 'Musholla'),
(3, 'Parkiran'),
(1, 'Toilet');

-- --------------------------------------------------------

--
-- Struktur dari tabel `item_sewa`
--

CREATE TABLE `item_sewa` (
  `id_item` int(11) NOT NULL,
  `nama_item` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `price_unit` varchar(50) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `tipe_item` enum('peralatan','layanan') DEFAULT NULL,
  `id_tempat` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `item_sewa`
--

INSERT INTO `item_sewa` (`id_item`, `nama_item`, `price`, `price_unit`, `image_url`, `tipe_item`, `id_tempat`) VALUES
(1, 'Joran Pancing\r\n', 25000.00, 'Item', '/img/peralatan/joran.jpeg', 'peralatan', 1),
(2, 'Reel Pancing\r\n', 20000.00, 'Item', '/img/peralatan/reel.jpeg', 'peralatan', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori_ensiklopedia`
--

CREATE TABLE `kategori_ensiklopedia` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kategori_ensiklopedia`
--

INSERT INTO `kategori_ensiklopedia` (`id_kategori`, `nama_kategori`) VALUES
(1, 'Jenis Ikan'),
(4, 'Peralatan Pancing'),
(2, 'Teknik Memancing'),
(3, 'Umpan');

-- --------------------------------------------------------

--
-- Struktur dari tabel `mitra`
--

CREATE TABLE `mitra` (
  `id_mitra` int(11) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `no_telepon` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `tgl_daftar` datetime DEFAULT current_timestamp(),
  `nama_bank` varchar(50) DEFAULT NULL,
  `no_rekening` varchar(50) DEFAULT NULL,
  `atas_nama_rekening` varchar(100) DEFAULT NULL,
  `foto_profil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `mitra`
--

INSERT INTO `mitra` (`id_mitra`, `nama_lengkap`, `email`, `password_hash`, `no_telepon`, `alamat`, `tgl_daftar`, `nama_bank`, `no_rekening`, `atas_nama_rekening`, `foto_profil`) VALUES
(1, 'asad', 'aku@gmail.com', '$2b$10$YboiEYjfTPz16sl0oTRqDO/tFjxI2XmWeQnCaa0luz5.OpEceXdxu', '12313', '12312', '2025-11-24 02:47:12', 'BCA', '123', 'asad', NULL),
(3, '2131', 'angjay@gmail.com', '$2b$10$23x.DCUiOAsB3hxPj3J9.OtAdo8dHbayZ.65ggpVizxDK25ut7pUm', '3113', 'saasd', '2025-11-24 02:50:08', 'Mandiri', '12312', 'qwq', NULL),
(4, 'Made', 'owalah@gmail.com', '$2b$10$GSLd.lyOZz464AkJbEeTn.SYMp1Hxqrq.kqFN8HaODyE3MfZPui9W', '123', 'sds', '2025-11-24 02:53:21', 'BCA', '213123', 'yeah', NULL),
(5, 'SiapaHayo', 'siapaaja@gmail.com', '$2b$10$8u2fwqzb0hYQ5NWutkKTW.owtkYTTCyWx3M8ySYKn4PVDOMlZndQ.', '0892921321', 'angjay', '2025-11-24 03:00:06', 'BCA', '12234', 'qwe', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembayaran`
--

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

--
-- Dumping data untuk tabel `pembayaran`
--

INSERT INTO `pembayaran` (`id_pembayaran`, `id_pesanan`, `kode_bayar`, `payment_method`, `jumlah_bayar`, `tgl_pembayaran`, `status_pembayaran`, `image_qris`) VALUES
(1, 75, 'PAY-1763831218928-75', 'qris', 50000.00, '2025-11-23 00:06:58', 'pending', '/img/qris_dummy.jpg'),
(2, 87, 'PAY-1763875247694-87', 'bri', 50000.00, '2025-11-23 12:16:05', 'pending', 'img/qris_dummy.jpg'),
(3, 89, 'PAY-1763876367111-89', 'bri', 50000.00, '2025-11-23 12:39:27', 'pending', '/img/qris_dummy.jpg'),
(4, 93, 'PAY-1763907170215-93', 'bri', 50000.00, '2025-11-23 21:09:26', 'pending', 'img/qris_dummy.jpg'),
(5, 94, 'PAY-1763907665627-94', 'bri', 95000.00, '2025-11-23 21:21:01', 'pending', 'img/qris_dummy.jpg'),
(6, 95, 'PAY-1763922133677-95', 'qris', 50000.00, '2025-11-24 01:22:13', 'pending', '/img/qris_dummy.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pemesanan`
--

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

--
-- Dumping data untuk tabel `pemesanan`
--

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
(31, 1, 1, 'B-453534703', '2025-11-21', '2025-12-06', 9, 2, 990000.00, 'Menunggu Pembayaran'),
(32, 1, 1, 'B-223915187', '2025-11-21', '2025-11-07', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(33, 1, 1, 'B-224179110', '2025-11-21', '2025-11-07', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(37, 1, 1, 'B-189102625', '2025-11-21', '2025-11-05', 1, 1, 70000.00, 'Menunggu Pembayaran'),
(39, 1, 1, 'B-372379742', '2025-11-21', '2025-12-03', 1, 1, 95000.00, 'Menunggu Pembayaran'),
(40, 1, 1, 'B-411554475', '2025-11-21', '2025-11-07', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(43, 1, 1, 'B-226890748', '2025-11-21', '2025-11-07', 1, 1, 95000.00, 'Menunggu Pembayaran'),
(44, 1, 1, 'B-248747457', '2025-11-21', '2025-11-07', 1, 1, 70000.00, 'Menunggu Pembayaran'),
(46, 1, 1, 'B-519548408', '2025-11-21', '2025-11-28', 1, 1, 95000.00, 'Menunggu Pembayaran'),
(47, 1, 1, 'B-693036944', '2025-11-21', '2025-11-13', 1, 1, 70000.00, 'Menunggu Pembayaran'),
(51, 1, 1, 'B-142357663', '2025-11-21', '2025-11-06', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(58, 1, 1, 'B-247851886', '2025-11-21', '2025-11-28', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(59, 1, 1, 'B-674275964', '2025-11-22', '2025-12-05', 1, 1, 90000.00, 'Menunggu Pembayaran'),
(60, 1, 1, 'B-321963874', '2025-11-22', '2025-11-11', 1, 1, 95000.00, 'Menunggu Pembayaran'),
(61, 5, 1, 'B-264409815', '2025-11-22', '2025-11-12', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(62, 5, 1, 'B-275852335', '2025-11-22', '2025-11-11', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(63, 5, 1, 'B-316367364', '2025-11-22', '2025-11-20', 1, 1, 95000.00, 'Menunggu Pembayaran'),
(64, 5, 1, 'B-373607590', '2025-11-22', '2025-11-22', 1, 1, 70000.00, 'Menunggu Pembayaran'),
(65, 5, 1, 'B-394126614', '2025-11-22', '2025-11-11', 1, 1, 70000.00, 'Menunggu Pembayaran'),
(66, 5, 1, 'B-723327882', '2025-11-22', '2025-11-22', 1, 1, 70000.00, 'Lunas'),
(67, 5, 1, 'B-430204710', '2025-11-22', '2025-11-19', 1, 1, 70000.00, 'Menunggu Pembayaran'),
(68, 5, 1, 'B-445802544', '2025-11-22', '2025-12-06', 5, 7, 1975000.00, 'Menunggu Pembayaran'),
(69, 5, 1, 'B-002536886', '2025-11-22', '2025-11-26', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(70, 5, 1, 'B-312109291', '2025-11-22', '2025-11-27', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(71, 5, 1, 'B-360143801', '2025-11-22', '2025-11-22', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(72, 5, 1, 'B-470428298', '2025-11-22', '2025-11-11', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(73, 5, 1, 'B-493499228', '2025-11-22', '2025-11-25', 1, 1, 70000.00, 'Menunggu Pembayaran'),
(75, 5, 1, 'B-215586246', '2025-11-23', '2025-11-13', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(87, 5, 1, 'B-703823461', '2025-11-23', '2025-11-24', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(88, 1, 1, 'ORDER-1763874821', '2025-11-23', '2026-01-01', 5, 4, 2000000.00, 'Menunggu Pembayaran'),
(89, 5, 1, 'B-366379390', '2025-11-23', '2025-11-20', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(90, 8, 1, 'B-712578317', '2025-11-23', '2025-11-21', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(91, 8, 1, 'B-814598142', '2025-11-23', '2025-11-29', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(92, 8, 1, 'B-479449614', '2025-11-23', '2025-11-29', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(93, 8, 1, 'B-269222107', '2025-11-23', '2025-11-22', 1, 1, 50000.00, 'Menunggu Pembayaran'),
(94, 8, 1, 'B-494884929', '2025-11-23', '2025-11-28', 1, 1, 95000.00, 'Menunggu Pembayaran'),
(95, 8, 1, 'B-128559660', '2025-11-24', '2025-11-28', 1, 1, 50000.00, 'Menunggu Pembayaran');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengguna`
--

CREATE TABLE `pengguna` (
  `id_pengguna` int(11) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `no_telepon` varchar(20) DEFAULT NULL,
  `tgl_daftar` datetime DEFAULT current_timestamp(),
  `tipe_user` enum('customer','admin') DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pengguna`
--

INSERT INTO `pengguna` (`id_pengguna`, `nama_lengkap`, `email`, `password_hash`, `no_telepon`, `tgl_daftar`, `tipe_user`) VALUES
(1, 'Madeu', 'test@gmail.com', '123', '3213', '2025-11-19 22:40:29', 'customer'),
(2, 'Ronggoi', 'ronggo@gmail.com', '321', '3213', '2025-11-19 22:51:48', 'customer'),
(3, 'gelomadejago', 'jago@example.com', '$2b$10$IcgkhzGXxqTZcoe7K6xXheX1jmifGt1KWbtq7llCDMSL8oBAi8Yh6', '08123456789', '2025-11-21 00:30:40', 'customer'),
(4, 'testqqweq', 'gacoer@gmail.com', '$2b$10$r2tCl8c2mQD.LhepeiCck.VXlvxbxdels5YWzISk8wu9fMixl9RfC', NULL, '2025-11-22 00:37:30', 'customer'),
(5, 'adminwpo', 'admin@gmail.com', '$2a$12$L8.dD9.F/m.l.E/7.g/6.u.f.C/5.d.E/8.f.G/9.h.I', '123123', '2025-11-22 16:04:39', 'customer'),
(6, 'gelomadejago', 'jago12345@example.com', '$2b$10$8BADRLGsuHOjRkEusrTM7uWqxaVOinCCMAKh06K/1ND0/tf.FM01m', '08123456789', '2025-11-23 00:42:49', 'customer'),
(7, 'testlagi', 'coba@gmail.com', '$2b$10$S9AXgvJXnzgu15CAYtJUKOpr8ZcVkorkID4X.mqPkz3T/KyUMtgEO', '123123', '2025-11-23 13:29:33', 'customer'),
(8, 'Gataucoba', 'aja@gmail.com', '$2b$10$siLZ.pVGDx4vKbt8LZYP2OqrW217KXFUXZ/ccvxt9IeETgFmED1l6', '1234', '2025-11-23 13:36:29', 'customer');

-- --------------------------------------------------------

--
-- Struktur dari tabel `review`
--

CREATE TABLE `review` (
  `id_review` int(11) NOT NULL,
  `id_tempat` int(11) DEFAULT NULL,
  `id_pengguna` int(11) DEFAULT NULL,
  `score` tinyint(4) NOT NULL,
  `comment` text DEFAULT NULL,
  `review_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `review`
--

INSERT INTO `review` (`id_review`, `id_tempat`, `id_pengguna`, `score`, `comment`, `review_date`) VALUES
(1, 1, 1, 3, '3sasdasdasdasd', '2025-11-19 22:40:45'),
(2, 1, 2, 5, 'asdsadsd', '2025-11-19 22:52:10'),
(3, 1, 1, 5, 'Gacor', '2025-11-22 17:56:19'),
(4, 1, 1, 5, '21', '2025-11-22 18:05:47'),
(5, 1, 1, 4, '12', '2025-11-22 18:06:33'),
(6, 1, 5, 5, '123', '2025-11-22 18:37:28');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tempat_fasilitas`
--

CREATE TABLE `tempat_fasilitas` (
  `id_tempat` int(11) NOT NULL,
  `id_fasilitas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tempat_fasilitas`
--

INSERT INTO `tempat_fasilitas` (`id_tempat`, `id_fasilitas`) VALUES
(1, 1),
(1, 2),
(1, 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tempat_pemancingan`
--

CREATE TABLE `tempat_pemancingan` (
  `id_tempat` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `price_unit` varchar(50) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `total_reviews_count` int(11) DEFAULT 0,
  `average_rating` decimal(2,1) DEFAULT 0.0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_mitra` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tempat_pemancingan`
--

INSERT INTO `tempat_pemancingan` (`id_tempat`, `title`, `location`, `base_price`, `price_unit`, `image_url`, `description`, `full_description`, `total_reviews_count`, `average_rating`, `created_at`, `updated_at`, `id_mitra`) VALUES
(1, 'Pantai Ancol', 'Ancol, Jakarta Utara\r\n', 50000.00, 'Hari', '/img/ancol.png\r\n', 'Tempat pemancingan laut yang populer dengan fasilitas lengkap dan suasana nyaman. Cocok untuk memancing harian.', 'Bayangkan sebuah spot memancing di laut lepas dengan latar belakang silhouette megah Jakarta skyline yang berdiri gagah di kejauhan...', 6, 4.5, '2025-11-19 14:49:45', '2025-11-22 11:37:28', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `detail_pemesanan_item`
--
ALTER TABLE `detail_pemesanan_item`
  ADD PRIMARY KEY (`id_detail`),
  ADD KEY `id_pesanan` (`id_pesanan`),
  ADD KEY `id_item` (`id_item`);

--
-- Indeks untuk tabel `ensiklopedia`
--
ALTER TABLE `ensiklopedia`
  ADD PRIMARY KEY (`id_artikel`),
  ADD KEY `id_kategori` (`id_kategori`);

--
-- Indeks untuk tabel `ensiklopedia_media`
--
ALTER TABLE `ensiklopedia_media`
  ADD PRIMARY KEY (`id_media`),
  ADD KEY `id_artikel` (`id_artikel`);

--
-- Indeks untuk tabel `fasilitas`
--
ALTER TABLE `fasilitas`
  ADD PRIMARY KEY (`id_fasilitas`),
  ADD UNIQUE KEY `nama_fasilitas` (`nama_fasilitas`);

--
-- Indeks untuk tabel `item_sewa`
--
ALTER TABLE `item_sewa`
  ADD PRIMARY KEY (`id_item`),
  ADD KEY `id_tempat` (`id_tempat`);

--
-- Indeks untuk tabel `kategori_ensiklopedia`
--
ALTER TABLE `kategori_ensiklopedia`
  ADD PRIMARY KEY (`id_kategori`),
  ADD UNIQUE KEY `nama_kategori` (`nama_kategori`);

--
-- Indeks untuk tabel `mitra`
--
ALTER TABLE `mitra`
  ADD PRIMARY KEY (`id_mitra`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id_pembayaran`),
  ADD UNIQUE KEY `id_pesanan` (`id_pesanan`);

--
-- Indeks untuk tabel `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD PRIMARY KEY (`id_pesanan`),
  ADD UNIQUE KEY `nomor_pesanan` (`nomor_pesanan`),
  ADD KEY `id_pengguna` (`id_pengguna`),
  ADD KEY `id_tempat` (`id_tempat`);

--
-- Indeks untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id_pengguna`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id_review`),
  ADD KEY `id_tempat` (`id_tempat`),
  ADD KEY `id_pengguna` (`id_pengguna`);

--
-- Indeks untuk tabel `tempat_fasilitas`
--
ALTER TABLE `tempat_fasilitas`
  ADD PRIMARY KEY (`id_tempat`,`id_fasilitas`),
  ADD KEY `id_fasilitas` (`id_fasilitas`);

--
-- Indeks untuk tabel `tempat_pemancingan`
--
ALTER TABLE `tempat_pemancingan`
  ADD PRIMARY KEY (`id_tempat`),
  ADD KEY `fk_tempat_mitra` (`id_mitra`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `detail_pemesanan_item`
--
ALTER TABLE `detail_pemesanan_item`
  MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT untuk tabel `ensiklopedia`
--
ALTER TABLE `ensiklopedia`
  MODIFY `id_artikel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT untuk tabel `ensiklopedia_media`
--
ALTER TABLE `ensiklopedia_media`
  MODIFY `id_media` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT untuk tabel `fasilitas`
--
ALTER TABLE `fasilitas`
  MODIFY `id_fasilitas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `item_sewa`
--
ALTER TABLE `item_sewa`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `kategori_ensiklopedia`
--
ALTER TABLE `kategori_ensiklopedia`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `mitra`
--
ALTER TABLE `mitra`
  MODIFY `id_mitra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `pemesanan`
--
ALTER TABLE `pemesanan`
  MODIFY `id_pesanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id_pengguna` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `review`
--
ALTER TABLE `review`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `tempat_pemancingan`
--
ALTER TABLE `tempat_pemancingan`
  MODIFY `id_tempat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `detail_pemesanan_item`
--
ALTER TABLE `detail_pemesanan_item`
  ADD CONSTRAINT `detail_pemesanan_item_ibfk_1` FOREIGN KEY (`id_pesanan`) REFERENCES `pemesanan` (`id_pesanan`),
  ADD CONSTRAINT `detail_pemesanan_item_ibfk_2` FOREIGN KEY (`id_item`) REFERENCES `item_sewa` (`id_item`);

--
-- Ketidakleluasaan untuk tabel `ensiklopedia`
--
ALTER TABLE `ensiklopedia`
  ADD CONSTRAINT `ensiklopedia_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_ensiklopedia` (`id_kategori`);

--
-- Ketidakleluasaan untuk tabel `ensiklopedia_media`
--
ALTER TABLE `ensiklopedia_media`
  ADD CONSTRAINT `ensiklopedia_media_ibfk_1` FOREIGN KEY (`id_artikel`) REFERENCES `ensiklopedia` (`id_artikel`);

--
-- Ketidakleluasaan untuk tabel `item_sewa`
--
ALTER TABLE `item_sewa`
  ADD CONSTRAINT `item_sewa_ibfk_1` FOREIGN KEY (`id_tempat`) REFERENCES `tempat_pemancingan` (`id_tempat`);

--
-- Ketidakleluasaan untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`id_pesanan`) REFERENCES `pemesanan` (`id_pesanan`);

--
-- Ketidakleluasaan untuk tabel `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD CONSTRAINT `pemesanan_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`),
  ADD CONSTRAINT `pemesanan_ibfk_2` FOREIGN KEY (`id_tempat`) REFERENCES `tempat_pemancingan` (`id_tempat`);

--
-- Ketidakleluasaan untuk tabel `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`id_tempat`) REFERENCES `tempat_pemancingan` (`id_tempat`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`);

--
-- Ketidakleluasaan untuk tabel `tempat_fasilitas`
--
ALTER TABLE `tempat_fasilitas`
  ADD CONSTRAINT `tempat_fasilitas_ibfk_1` FOREIGN KEY (`id_tempat`) REFERENCES `tempat_pemancingan` (`id_tempat`),
  ADD CONSTRAINT `tempat_fasilitas_ibfk_2` FOREIGN KEY (`id_fasilitas`) REFERENCES `fasilitas` (`id_fasilitas`);

--
-- Ketidakleluasaan untuk tabel `tempat_pemancingan`
--
ALTER TABLE `tempat_pemancingan`
  ADD CONSTRAINT `fk_tempat_mitra` FOREIGN KEY (`id_mitra`) REFERENCES `mitra` (`id_mitra`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
