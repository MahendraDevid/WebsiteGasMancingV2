// File: routes/bookingRoutes.js

// File: routes/bookingRoutes.js (Pastikan urutannya seperti ini!)

const router = require('express').Router();
const bookingController = require('../controllers/bookingController');

// 1. ROUTE POST (Karena Anda menggunakan '/create')
router.post('/create', bookingController.create);

// 2. ROUTE SPESIFIK DENGAN STRING STATIS DULU
// Jika route ini di bawah '/:id', maka 'user' akan dianggap sebagai ID
router.get('/user/:userId', bookingController.getByUserId); 
router.patch('/:id/status', bookingController.updateStatus); // Ini juga harus spesifik

// 3. ROUTE UMUM DENGAN PARAMETER DINAMIS
router.get('/:id', bookingController.getById);

// 4. ROUTE PALING UMUM
router.get('/', bookingController.getAll); 
router.delete('/:id', bookingController.delete);

module.exports = router;