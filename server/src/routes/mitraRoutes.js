// server/src/routes/mitraRoutes.js (VERSI FINAL & BENAR)

const express = require('express');
const router = express.Router();
const mitraController = require('../controllers/mitraController');

// --- TAMBAHAN SETUP MULTER ---
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Format nama file: timestamp-namaasli.jpg
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 1. CREATE (Pendaftaran)
// Ubah '/' menjadi '/register' agar cocok dengan Frontend Vue
router.post('/register', upload.single('fotoProperti'), mitraController.createMitra); 

// TAMBAHKAN ROUTE LOGIN INI:
router.post('/login', mitraController.login);

// 2. READ (Get By ID)
router.get('/:id', mitraController.getMitraById);

// 3. UPDATE
router.put('/:id', mitraController.updateMitra);

// 4. DELETE
router.delete('/:id', mitraController.deleteMitra);

module.exports = router;