const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

// --- SETUP MULTER (Sama seperti di mitraRoutes) ---
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)){ fs.mkdirSync(dir, { recursive: true }); }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// GET all places
router.get("/", placeController.getAllPlaces);

// GET search places
router.get("/search", placeController.searchPlaces);

// GET place by ID
router.get("/:id", placeController.getPlaceById);

// POST create new place
router.post("/", upload.single('fotoProperti'), placeController.createPlace);

router.put('/:id', placeController.updatePlace);    

router.delete('/:id', placeController.deletePlace);

module.exports = router;
