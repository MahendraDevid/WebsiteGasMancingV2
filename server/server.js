// server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Tambahan agar aman baca form data

<<<<<<< HEAD
// ======== ROUTES IMPORT ========
// Pastikan nama file di folder src/routes/ sesuai dengan require ini
const authRoutes = require("./src/routes/auth"); 
=======
const authRoutes = require("./src/routes/auth");
>>>>>>> 666ec2c1e70a1fd9943cf655bfd84a7f435721b6
const placeRoutes = require("./src/routes/placeRoutes");
const ensiklopediaRoutes = require("./src/routes/ensiklopediaRoutes");
const itemSewaRoutes = require("./src/routes/itemSewaRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");

<<<<<<< HEAD
// --- PERBAIKAN DISINI (Tambahkan /routes/) ---
const mitraRoutes = require("./src/routes/mitraRoutes"); 
// --------------------------------------------

// ======== MOUNT ROUTES ========
=======

app.use("/api/", authRoutes);
>>>>>>> 666ec2c1e70a1fd9943cf655bfd84a7f435721b6
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/ensiklopedia", ensiklopediaRoutes);
app.use("/api/item_sewa", itemSewaRoutes);
app.use("/api/booking", bookingRoutes);

// Route Mitra
app.use("/api/mitra", mitraRoutes);

// ======== START SERVER ========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));