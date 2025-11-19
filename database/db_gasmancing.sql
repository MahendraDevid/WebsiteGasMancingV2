-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 19 Nov 2025 pada 17.22
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

CREATE DATABASE IF NOT EXISTS db_gasmancing;
USE db_gasmancing;

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
(2, 'Ronggoi', 'ronggo@gmail.com', '321', '3213', '2025-11-19 22:51:48', 'customer');

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
(2, 1, 2, 5, 'asdsadsd', '2025-11-19 22:52:10');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tempat_pemancingan`
--

INSERT INTO `tempat_pemancingan` (`id_tempat`, `title`, `location`, `base_price`, `price_unit`, `image_url`, `description`, `full_description`, `total_reviews_count`, `average_rating`, `created_at`, `updated_at`) VALUES
(1, 'Pantai Ancol', 'Ancol, Jakarta Utara\r\n', 50000.00, 'Hari', '/img/ancol.png\r\n', 'Tempat pemancingan laut yang populer dengan fasilitas lengkap dan suasana nyaman. Cocok untuk memancing harian.', 'Bayangkan sebuah spot memancing di laut lepas dengan latar belakang silhouette megah Jakarta skyline yang berdiri gagah di kejauhan. Dari atas kapal atau dermaga, para pemancing dapat menyaksikan gedung-gedung pencakar langit yang berkilauan ditimpa cahaya matahari sore, menciptakan pemandangan kontras antara kehidupan perkotaan yang sibuk dengan ketenangan laut biru yang membentang luas.', 300, 4.2, '2025-11-19 14:49:45', '2025-11-19 15:09:50');

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
  ADD PRIMARY KEY (`id_tempat`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `detail_pemesanan_item`
--
ALTER TABLE `detail_pemesanan_item`
  MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `ensiklopedia`
--
ALTER TABLE `ensiklopedia`
  MODIFY `id_artikel` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `ensiklopedia_media`
--
ALTER TABLE `ensiklopedia_media`
  MODIFY `id_media` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pemesanan`
--
ALTER TABLE `pemesanan`
  MODIFY `id_pesanan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id_pengguna` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `review`
--
ALTER TABLE `review`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
