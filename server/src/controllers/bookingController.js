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
        message: "Pemesanan tidak ditemukan" 
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
  try {
    const bookingData = req.body;
    
    // Validasi data required
    if (!bookingData.id_pengguna || !bookingData.id_tempat || 
        !bookingData.nomor_pesanan || !bookingData.tgl_mulai_sewa ||
        !bookingData.total_biaya) {
      return res.status(400).json({ 
        success: false, 
        message: "Data pemesanan tidak lengkap" 
      });
    }

    const insertId = await BookingModel.create(bookingData);
    
    res.status(201).json({ 
      success: true, 
      message: "Pemesanan berhasil dibuat",
      data: { id: insertId }
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
    const validStatuses = ['Menunggu Pembayaran', 'Lunas', 'Dibatalkan', 'Selesai'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Status tidak valid" 
      });
    }

    const updated = await BookingModel.updateStatus(id, status);
    
    if (updated) {
      res.json({ 
        success: true, 
        message: "Status pemesanan berhasil diupdate" 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: "Pemesanan tidak ditemukan" 
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
        message: "Pemesanan berhasil dihapus" 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: "Pemesanan tidak ditemukan" 
      });
    }
  } catch (error) {
    console.error("Error in Booking Controller (delete):", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};