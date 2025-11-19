const express = require("express");
const router = express.Router();

// Import route modules
const userRoutes = require("./userRoutes");
const placeRoutes = require("./placeRoutes");

// Use route modules
router.use("/users", userRoutes);
router.use("/places", placeRoutes);

module.exports = router;
