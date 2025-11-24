const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");

// GET all places
router.get("/", placeController.getAllPlaces);

// GET search places
router.get("/search", placeController.searchPlaces);

// GET place by ID
router.get("/:id", placeController.getPlaceById);

// POST create new place
router.post("/", placeController.createPlace);
    
module.exports = router;
