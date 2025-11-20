// server/src/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { nama_lengkap, email, password, no_telepon } = req.body;
    if (!nama_lengkap || !email || !password) {
      return res.status(400).json({ message: "Lengkapi semua field" });
    }

    const existing = await UserModel.findByEmail(email);
    if (existing)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    const password_hash = await bcrypt.hash(password, 10);
    const id = await UserModel.createUser({
      nama_lengkap,
      email,
      password_hash,
      no_telepon,
    });
    return res.json({ message: "Registrasi berhasil", id_pengguna: id });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password dibutuhkan" });

    const user = await UserModel.findByEmail(email);
    if (!user)
      return res.status(400).json({ message: "Email tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      { id_pengguna: user.id_pengguna, tipe_user: user.tipe_user },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    return res.json({
      message: "Login sukses",
      token,
      user: {
        id_pengguna: user.id_pengguna,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        tipe_user: user.tipe_user,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
});

// Protected sample route
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token missing" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id_pengguna);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res
      .status(401)
      .json({ message: "Invalid token", details: err.message });
  }
});

module.exports = router;
