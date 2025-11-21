// routes/index.js

const express = require("express");
const router = express.Router();

// Import route modules
const userRoutes = require("./userRoutes");
const placeRoutes = require("./placeRoutes");
const ensiklopediaRoutes = require("./ensiklopediaRoutes");
const bookingRoutes = require("./bookingRoutes");
const itemSewaRoutes = require("./itemSewaRoutes");
const reviewRoutes = require("./reviewRoutes");

// Use route modules
router.use("/users", userRoutes);
router.use("/places", placeRoutes);
router.use("/ensiklopedia", ensiklopediaRoutes);
router.use("/booking", bookingRoutes);
router.use("/item_sewa", itemSewaRoutes);
router.use("/review", reviewRoutes);

module.exports = router;
