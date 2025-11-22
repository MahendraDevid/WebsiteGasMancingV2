// models/pesananModel.js
const db = require("../config/database");

class PesananModel {
  // ======================================
  // 1. GET ALL PESANAN BY USER ID
  // ======================================
  static async findAllByUserId(userId) {
    try {
      // 1) Ambil semua pesanan user
      const [orders] = await db.query(
        `SELECT 
        p.id_pesanan,
        p.id_tempat,
        p.tgl_pesan,
        p.status_pesanan,
        p.total_biaya,
        p.num_people,
        p.tgl_mulai_sewa,
        p.durasi_sewa_jam,
        p.nomor_pesanan,
        t.title,
        t.location,
        t.image_url,
        t.average_rating,
        t.total_reviews_count
      FROM pemesanan p
      JOIN tempat_pemancingan t ON p.id_tempat = t.id_tempat
      WHERE p.id_pengguna = ?
      ORDER BY p.tgl_pesan DESC`,
        [userId]
      );

      if (orders.length === 0) return [];

      const orderIds = orders.map((o) => o.id_pesanan);

      // 2) Ambil semua item
      const [allItems] = await db.query(
        `SELECT 
        d.id_pesanan,
        d.kuantitas AS quantity,
        i.nama_item AS name,
        d.harga_satuan_saat_pesan AS price,
        d.subtotal
      FROM detail_pemesanan_item d
      JOIN item_sewa i ON d.id_item = i.id_item
      WHERE d.id_pesanan IN (?)`,
        [orderIds]
      );

      // 3) Kelompokkan item per pesanan
      const itemsByOrder = {};
      allItems.forEach((item) => {
        if (!itemsByOrder[item.id_pesanan]) {
          itemsByOrder[item.id_pesanan] = [];
        }
        itemsByOrder[item.id_pesanan].push({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        });
      });

      // 4) Susun output akhir
      return orders.map((order) => ({
        id: order.id_pesanan,
        id_pesanan: order.id_pesanan,
        nomor_pesanan: order.nomor_pesanan,
        place_name: order.title,
        place_location: order.location,
        place_image: order.image_url,
        place_rating: order.average_rating || 0,
        place_review_count: order.total_reviews_count || 0,
        tanggal_mulai: order.tgl_mulai_sewa,
        tanggal_selesai: null,
        durasi_jam: order.durasi_sewa_jam,
        jumlah_orang: order.num_people,
        status: order.status_pesanan,
        total_harga: order.total_biaya,
        items: itemsByOrder[order.id_pesanan] || [],
      }));
    } catch (error) {
      console.error("Error in findAllByUserId:", error);
      throw error;
    }
  }

  // ======================================
  // 2. CANCEL PESANAN
  // ======================================
  static async cancelOrder(orderId, userId) {
    try {
      // 1. Cek pesanan dan status
      const [rows] = await db.query(
        "SELECT status_pesanan FROM id_pesanan WHERE id_pesanan = ? AND id_pengguna = ?",
        [orderId, userId]
      );

      if (rows.length === 0) {
        return {
          success: false,
          message: "Pesanan tidak ditemukan atau Anda tidak memiliki izin.",
        };
      }

      const currentStatus = rows[0].status_pesanan;

      // Validasi Status
      if (currentStatus !== "Menunggu Pembayaran") {
        return {
          success: false,
          message: `Pesanan dengan status ${currentStatus} tidak dapat dibatalkan.`,
        };
      }

      // 2. Update status menjadi "Dibatalkan"
      await db.query(
        "UPDATE id_pesanan SET status_pesanan = 'Dibatalkan' WHERE id_pesanan = ?",
        [orderId]
      );

      // 3. Ambil data pesanan yang dibatalkan
      const [updatedOrder] = await db.query(
        `SELECT 
          p.id_pesanan, 
          p.status_pesanan, 
          p.total_biaya, 
          t.title 
        FROM id_pesanan p
        JOIN tempat_pemancingan t ON p.id_tempat = t.id_tempat
        WHERE p.id_pesanan = ?`,
        [orderId]
      );

      return {
        success: true,
        order: updatedOrder[0],
      };
    } catch (error) {
      console.error("Error in cancelOrder:", error);
      throw error;
    }
  }

  // ======================================
  // 3. CREATE PESANAN
  // ======================================
  static async create(pesananData, items) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const {
        id_pengguna,
        id_tempat,
        tgl_mulai_sewa,
        durasi_sewa_jam,
        num_people,
        total_biaya,
      } = pesananData;

      // Generate nomor pesanan
      const nomorPesanan = "B-" + Date.now();

      // 1. Insert ke tabel id_pesanan
      const [result] = await connection.query(
        `INSERT INTO id_pesanan (
          id_pengguna, 
          id_tempat, 
          nomor_pesanan,
          tgl_pesan, 
          status_pesanan, 
          tgl_mulai_sewa, 
          durasi_sewa_jam, 
          num_people, 
          total_biaya
        ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)`,
        [
          id_pengguna,
          id_tempat,
          nomorPesanan,
          "Menunggu Pembayaran",
          tgl_mulai_sewa,
          durasi_sewa_jam,
          num_people,
          total_biaya,
        ]
      );

      const pesananId = result.insertId;

      // 2. Insert Item Pesanan ke id_detail
      if (items && items.length > 0) {
        for (const item of items) {
          const subtotal = item.quantity * item.price_at_order;
          await connection.query(
            `INSERT INTO detail_pemesanan_item 
            (id_pesanan, id_item, kuantitas, harga_satuan_saat_pesan, subtotal) 
            VALUES (?, ?, ?, ?, ?)`,
            [
              pesananId,
              item.id_item,
              item.quantity,
              item.price_at_order,
              subtotal,
            ]
          );
        }
      }

      await connection.commit();
      return pesananId;
    } catch (error) {
      await connection.rollback();
      console.error("Error in create:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = PesananModel;
