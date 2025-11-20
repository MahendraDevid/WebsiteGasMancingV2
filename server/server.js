// server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ======== ROUTES IMPORT ========
const authRoutes = require("./src/routes/auth");
const placeRoutes = require("./src/routes/placeRoutes");
const ensiklopediaRoutes = require("./src/routes/ensiklopediaRoutes");

// ======== MOUNT ROUTES ========
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/ensiklopedia", ensiklopediaRoutes);

// ======== START SERVER ========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
