// server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Tambahan agar aman baca form data

const authRoutes = require("./src/routes/auth");
const placeRoutes = require("./src/routes/placeRoutes");
const ensiklopediaRoutes = require("./src/routes/ensiklopediaRoutes");
const itemSewaRoutes = require("./src/routes/itemSewaRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const userRoutes = require("./src/routes/userRoutes");
const pesananRoutes = require("./src/routes/pesananRoutes");

const reviewRoutes = require("./src/routes/reviewRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
// --- PERBAIKAN DISINI (Tambahkan /routes/) ---
const mitraRoutes = require("./src/routes/mitraRoutes"); 
// --------------------------------------------

// ======== MOUNT ROUTES ========

app.use("/api/", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/ensiklopedia", ensiklopediaRoutes);
app.use("/api/item_sewa", itemSewaRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/pesanan", pesananRoutes);
app.use("/api/users", userRoutes);


app.use("/api/review", reviewRoutes);
app.use("/api/payment", paymentRoutes);
// Route Mitra
app.use("/api/mitra", mitraRoutes);

// ======== START SERVER ========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));