// routes/pesanan.routes.js - Mendefinisikan endpoint API untuk entitas Pesanan.

const express = require("express");
const router = express.Router();
const pesananController = require("../controllers/pesananController");

// Asumsi: Di aplikasi nyata, Anda akan memiliki middleware autentikasi (e.g., checkAuth)
// yang diletakkan sebelum controller untuk memverifikasi req.userId.

// ===================================
// Rute untuk Pengelolaan Pesanan
// ===================================

// GET /api/pesanan/my-orders
// Mengambil semua pesanan untuk pengguna yang sedang login.
router.get("/my-orders", pesananController.getAllPesananByUserId);

// POST /api/pesanan/create
// Membuat pesanan baru.
router.post("/create", pesananController.createPesanan);

// POST /api/pesanan/cancel/:id
// Membatalkan pesanan berdasarkan ID.
router.post("/cancel/:id", pesananController.cancelPesanan);

module.exports = router;
