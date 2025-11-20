// controllers/bookingController.js

const BookingModel = require("../models/bookingModel");

// =======================================================
// GET ALL BOOKINGS
// =======================================================
exports.getAll = async (req, res) => {
  try {
    const data = await BookingModel.getAll();
    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Error in Booking Controller (getAll):", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// =======================================================
// GET BOOKING BY ID
// =======================================================
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await BookingModel.findById(id);

    if (data) {
      res.json({ success: true, data: data });
    } else {
      res.status(404).json({
        success: false,
        message: "Pemesanan tidak ditemukan",
      });
    }
  } catch (error) {
    console.error("Error in Booking Controller (getById):", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// =======================================================
// GET BOOKINGS BY USER ID
// =======================================================
exports.getByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await BookingModel.findByUserId(userId);

    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Error in Booking Controller (getByUserId):", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// =======================================================
// CREATE NEW BOOKING
// =======================================================
exports.create = async (req, res) => {
  // Pisahkan detail_items dari payload utama
  const { detail_items, ...bookingData } = req.body;

  // Gunakan transaksi untuk memastikan semua tersimpan atau tidak sama sekali
  // (Penting, tapi kita lewati kode transaksi di sini untuk fokus pada logika insert)

  try {
    // Validasi data required (Perluas validasi untuk durasi_sewa_jam dan num_people)
    if (
      !bookingData.id_pengguna ||
      !bookingData.id_tempat ||
      !bookingData.nomor_pesanan ||
      !bookingData.tgl_mulai_sewa ||
      !bookingData.total_biaya ||
      !bookingData.durasi_sewa_jam ||
      !bookingData.num_people
    ) {
      return res.status(400).json({
        success: false,
        message: "Data pemesanan tidak lengkap (Field wajib tidak terisi)",
      });
    }

    // 1. SIMPAN PESANAN UTAMA & DAPATKAN ID
    const insertId = await BookingModel.create(bookingData);

    // 2. SIMPAN DETAIL ITEM JIKA ADA
    if (detail_items && detail_items.length > 0) {
      const itemPromises = detail_items.map(async (item) => {
        // --- Cek di sini: Apakah item memiliki properti yang benar? ---
        if (!item.id_item || !item.qty || item.price === undefined) {
          console.error("Payload detail item tidak lengkap:", item);
          // Anda bisa melempar error di sini jika perlu
          return;
        }

        const itemDetailPayload = {
          id_pesanan: insertId, // ID dari pemesanan utama
          id_item: item.id_item, // ✅ Ambil ID dari payload frontend
          kuantitas: item.qty,
          harga_satuan_saat_pesan: item.price,
          subtotal: item.qty * item.price, // Hitung subtotal
        };

        // Panggil model untuk menyimpan ke DB
        await BookingModel.createDetailItem(itemDetailPayload);
      });

      // Tunggu semua proses penyimpanan detail selesai
      await Promise.all(itemPromises);
      console.log(`Berhasil menyimpan ${detail_items.length} item detail.`);
    } else {
      console.log("Tidak ada item detail untuk disimpan.");
    }

    // 3. KIRIM RESPON SUKSES
    res.status(201).json({
      success: true,
      message: "Pemesanan berhasil dibuat dan item detail disimpan",
      data: { id_pesanan: insertId },
    });
  } catch (error) {
    console.error("Error in Booking Controller (create):", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// =======================================================
// UPDATE BOOKING STATUS
// =======================================================
exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    // Validasi status
    const validStatuses = [
      "Menunggu Pembayaran",
      "Lunas",
      "Dibatalkan",
      "Selesai",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid",
      });
    }

    const updated = await BookingModel.updateStatus(id, status);

    if (updated) {
      res.json({
        success: true,
        message: "Status pemesanan berhasil diupdate",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Pemesanan tidak ditemukan",
      });
    }
  } catch (error) {
    console.error("Error in Booking Controller (updateStatus):", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// =======================================================
// DELETE BOOKING
// =======================================================
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await BookingModel.delete(id);

    if (deleted) {
      res.json({
        success: true,
        message: "Pemesanan berhasil dihapus",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Pemesanan tidak ditemukan",
      });
    }
  } catch (error) {
    console.error("Error in Booking Controller (delete):", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
