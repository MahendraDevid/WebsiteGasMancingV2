// routes/index.js

const express = require("express");
const router = express.Router();

// Import route modules
const userRoutes = require("./userRoutes");
const placeRoutes = require("./placeRoutes");
// === TAMBAHKAN INI ===
const ensiklopediaRoutes = require("./ensiklopediaRoutes");
// =====================

// Use route modules
router.use("/users", userRoutes);
router.use("/places", placeRoutes);
// === TAMBAHKAN INI ===
router.use("/ensiklopedia", ensiklopediaRoutes);
// =====================

module.exports = router;
