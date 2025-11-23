// server/src/routes/mitraRoutes.js (VERSI FINAL & BENAR)

const express = require('express');
const router = express.Router();
const mitraController = require('../controllers/mitraController');

// 1. CREATE (Pendaftaran)
// Ubah '/' menjadi '/register' agar cocok dengan Frontend Vue
router.post('/register', mitraController.createMitra); 

// TAMBAHKAN ROUTE LOGIN INI:
router.post('/login', mitraController.login);

// 2. READ (Get By ID)
router.get('/:id', mitraController.getMitraById);

// 3. UPDATE
router.put('/:id', mitraController.updateMitra);

// 4. DELETE
router.delete('/:id', mitraController.deleteMitra);

module.exports = router;