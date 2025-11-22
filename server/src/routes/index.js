const express = require("express");
const router = express.Router();

// Import route modules
const userRoutes = require("./userRoutes");
const placeRoutes = require("./placeRoutes");
const ensiklopediaRoutes = require("./ensiklopediaRoutes");
const bookingRoutes = require("./bookingRoutes");
const itemSewaRoutes = require("./itemSewaRoutes");
const authRoutes = require("./auth");
const pesananRoutes = require("./pesananRoutes");

// Use route modules
router.use("/users", userRoutes);
router.use("/places", placeRoutes);
router.use("/ensiklopedia", ensiklopediaRoutes);
router.use("/booking", bookingRoutes);
router.use("/item_sewa", itemSewaRoutes);
router.use("/auth", authRoutes);
router.use("/pesanan", pesananRoutes);

module.exports = router;
