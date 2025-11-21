// models/pesanan.model.js - Model untuk operasi CRUD pada tabel pesanan dan turunannya.

// Asumsi: db adalah instance koneksi database (misalnya, mysql2 pool) yang diimpor dari config/database
const db = require("../config/database");

class PesananModel {
  // ======================================
  // 1. GET ALL PESANAN BY USER ID (OPTIMIZED N+1)
  // ======================================
  /**
   * Mengambil semua detail pesanan untuk pengguna tertentu.
   * Menggunakan batch fetching untuk menghindari masalah N+1 saat mengambil item sewa.
   * @param {string} userId - ID pengguna.
   * @returns {Promise<Array>} Daftar pesanan lengkap.
   */
  static async findAllByUserId(userId) {
    // Q1: Ambil semua pesanan utama milik pengguna
    const [orders] = await db.query(
      `SELECT 
                p.id_pesanan, p.id_tempat, p.tanggal_pemesanan, p.status, p.total_harga,
                p.jumlah_orang, p.tanggal_mulai, p.tanggal_selesai,
                t.title, t.location, t.image_url, t.average_rating AS rating, t.review_count AS reviewCount
             FROM pesanan p
             JOIN tempat_pemancingan t ON p.id_tempat = t.id_tempat
             WHERE p.id_pengguna = ?
             ORDER BY p.tanggal_pemesanan DESC`,
      [userId]
    );

    if (orders.length === 0) return [];

    const orderIds = orders.map((o) => o.id_pesanan);

    // Q2: Ambil SEMUA item sewa yang dipesan untuk SEMUA pesanan
    const [allRentedItems] = await db.query(
      `SELECT 
                ip.id_pesanan,
                ip.quantity,
                i.nama_item,
                i.price,
                i.price_unit,
                i.tipe_item
             FROM item_pesanan ip
             JOIN item_sewa i ON ip.id_item = i.id_item
             WHERE ip.id_pesanan IN (?)`,
      [orderIds]
    );

    // Q3: Ambil status review untuk SEMUA pesanan
    // Cek apakah ada review untuk pesanan tersebut
    const [reviewedStatuses] = await db.query(
      `SELECT id_pesanan FROM review WHERE id_pesanan IN (?)`,
      [orderIds]
    );

    const reviewedOrderIds = new Set(reviewedStatuses.map((r) => r.id_pesanan));

    // MAPPING (Mengelompokkan data terkait di Node.js)
    const mappedRentedItems = {};
    allRentedItems.forEach((item) => {
      if (!mappedRentedItems[item.id_pesanan])
        mappedRentedItems[item.id_pesanan] = [];
      mappedRentedItems[item.id_pesanan].push(item);
    });

    // Final Assembly: Menggabungkan pesanan utama dengan item sewa yang dipesan
    return orders.map((order) => ({
      id_pesanan: order.id_pesanan,
      id_tempat: order.id_tempat,
      title: order.title,
      location: order.location,
      rating: order.rating,
      reviewCount: order.reviewCount,
      order_date: order.tanggal_pemesanan,
      status: order.status,
      total_amount: order.total_harga,
      num_people: order.jumlah_orang,
      tanggal_mulai: order.tanggal_mulai,
      tanggal_selesai: order.tanggal_selesai,
      image_url: order.image_url,
      // Tambahkan flag review
      is_reviewed: reviewedOrderIds.has(order.id_pesanan),
      // Mengubah format item sewa agar mirip dengan payload sebelumnya (jika perlu)
      rented_equipment: mappedRentedItems[order.id_pesanan] || [],
    }));
  } // End findAllByUserId()

  // ======================================
  // 2. CANCEL PESANAN
  // ======================================
  /**
   * Membatalkan pesanan (mengubah status).
   * @param {number} orderId - ID pesanan.
   * @param {string} userId - ID pengguna untuk verifikasi kepemilikan.
   * @returns {Promise<Object|null>} Pesanan yang dibatalkan, atau null jika gagal.
   */
  static async cancelOrder(orderId, userId) {
    // 1. Cek pesanan dan status saat ini
    const [rows] = await db.query(
      "SELECT status FROM pesanan WHERE id_pesanan = ? AND id_pengguna = ?",
      [orderId, userId]
    );

    if (rows.length === 0) {
      return {
        success: false,
        message: "Pesanan tidak ditemukan atau Anda tidak memiliki izin.",
      };
    }

    const currentStatus = rows[0].status;

    // Validasi Status Pembatalan
    if (
      currentStatus !== "Menunggu Pembayaran" &&
      currentStatus !== "Diproses"
    ) {
      return {
        success: false,
        message: `Pesanan dengan status ${currentStatus} tidak dapat dibatalkan.`,
      };
    }

    // 2. Update status menjadi 'Dibatalkan'
    await db.query(
      "UPDATE pesanan SET status = 'Dibatalkan' WHERE id_pesanan = ?",
      [orderId]
    );

    // 3. Ambil ulang data pesanan yang baru dibatalkan untuk respons
    // Gunakan fungsi findById jika ada, atau buat query cepat untuk mengambil data yang diperbarui.
    const [updatedOrder] = await db.query(
      `SELECT 
                p.id_pesanan, p.status, p.total_harga, t.title 
             FROM pesanan p
             JOIN tempat_pemancingan t ON p.id_tempat = t.id_tempat
             WHERE p.id_pesanan = ?`,
      [orderId]
    );

    return { success: true, order: updatedOrder[0] };
  }

  // ======================================
  // 3. CREATE PESANAN
  // ======================================
  /**
   * Membuat pesanan baru, termasuk entri ke tabel item_pesanan.
   * @param {Object} pesananData - Data pesanan.
   * @param {Array} items - Array item sewa yang dipesan.
   * @returns {Promise<number>} ID pesanan yang baru dibuat.
   */
  static async create(pesananData, items) {
    // Mulai transaksi
    await db.query("START TRANSACTION");

    try {
      const {
        id_pengguna,
        id_tempat,
        tanggal_mulai,
        tanggal_selesai,
        jumlah_orang,
        total_harga,
      } = pesananData;

      // 1. Insert ke tabel Pesanan
      const [result] = await db.query(
        `INSERT INTO pesanan (
                    id_pengguna, id_tempat, tanggal_pemesanan, status, 
                    tanggal_mulai, tanggal_selesai, jumlah_orang, total_harga
                ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)`,
        [
          id_pengguna,
          id_tempat,
          "Menunggu Pembayaran", // Status awal
          tanggal_mulai,
          tanggal_selesai,
          jumlah_orang,
          total_harga,
        ]
      );

      const pesananId = result.insertId;

      // 2. Insert Item Pesanan
      if (items && items.length > 0) {
        const itemValues = items.map((item) => [
          pesananId,
          item.id_item, // Pastikan ini adalah ID item_sewa
          item.quantity,
          item.price_at_order, // Harga item saat dipesan (untuk history)
        ]);

        await db.query(
          `INSERT INTO item_pesanan (id_pesanan, id_item, quantity, price_at_order) VALUES ?`,
          [itemValues]
        );
      }

      // Commit transaksi
      await db.query("COMMIT");
      return pesananId;
    } catch (error) {
      // Rollback jika terjadi kesalahan
      await db.query("ROLLBACK");
      throw error;
    }
  }
}

module.exports = PesananModel;
