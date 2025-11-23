// controllers/mitraController.js
const MitraModel = require('../models/mitraModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Pastikan SECRET_KEY sama dengan yang ada di authController user biasa
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara_api'; 

exports.createMitra = async (req, res) => {
    try {
        console.log("1. Request masuk ke Create Mitra");
        const data = req.body;
        console.log("2. Data diterima:", data);

        // Validasi
        if (!data.nama_lengkap || !data.email || !data.password_hash) {
             console.log("3. Validasi gagal");
             return res.status(400).json({ success: false, message: "Data tidak lengkap." });
        }

        console.log("3. Validasi sukses, mulai hashing password...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password_hash, salt);
        console.log("4. Hashing sukses");

        const mitraData = { ...data, password_hash: hashedPassword };

        console.log("5. Mencoba insert ke Database...");
        const newId = await MitraModel.create(mitraData);
        console.log("6. Insert DB sukses, ID baru:", newId);

        const token = jwt.sign({ id: newId, role: 'mitra', email: data.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

        res.status(201).json({ 
            success: true, 
            message: "Registrasi Mitra berhasil.",
            data: { token, mitra: { id: newId, ...data } } 
        });

    } catch (error) {
        // INI YANG PALING PENTING: LIHAT ERRORNYA DI TERMINAL
        console.error("!!! ERROR FATAL DI CREATE MITRA !!!"); 
        console.error(error); 
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: "Email sudah terdaftar." });
        }
        res.status(500).json({ success: false, error: error.message }); // Kirim pesan error ke frontend
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Cek apakah email ada di tabel MITRA
        const mitra = await MitraModel.findByEmail(email);
        
        if (!mitra) {
            return res.status(404).json({ success: false, message: "Email tidak ditemukan atau Anda bukan Mitra." });
        }

        // 2. Cek Password
        const isMatch = await bcrypt.compare(password, mitra.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Password salah." });
        }

        // 3. Buat Token
        const token = jwt.sign(
            { 
                id: mitra.id_mitra, 
                role: 'mitra', // Tandai sebagai mitra
                email: mitra.email 
            }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // 4. Kirim Response
        res.json({
            success: true,
            message: "Login Mitra Berhasil",
            data: {
                token: token,
                mitra: { // Sesuaikan struktur object agar sama dengan authStore
                    id_mitra: mitra.id_mitra,
                    nama_lengkap: mitra.nama_lengkap,
                    email: mitra.email,
                    role: 'mitra',
                    tipe_user: 'mitra'
                }
            }
        });

    } catch (error) {
        console.error("Login Mitra Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// 2. Get Mitra By ID
exports.getMitraById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await MitraModel.findById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: "Mitra tidak ditemukan." });
        }

        res.json({ success: true, data: data });
    } catch (error) {
        console.error("Error getMitraById:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// 3. Update Mitra
exports.updateMitra = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const isUpdated = await MitraModel.update(id, data);

        if (!isUpdated) {
            // Bisa jadi ID tidak ketemu, atau tidak ada data yang berubah
            const checkUser = await MitraModel.findById(id);
            if (!checkUser) {
                return res.status(404).json({ success: false, message: "Mitra tidak ditemukan." });
            }
            return res.json({ success: true, message: "Tidak ada perubahan data." });
        }

        res.json({ success: true, message: "Data mitra berhasil diperbarui." });
    } catch (error) {
        console.error("Error updateMitra:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// 4. Delete Mitra
exports.deleteMitra = async (req, res) => {
    try {
        const { id } = req.params;
        const isDeleted = await MitraModel.delete(id);

        if (!isDeleted) {
            return res.status(404).json({ success: false, message: "Mitra tidak ditemukan." });
        }

        res.json({ success: true, message: "Mitra berhasil dihapus." });
    } catch (error) {
        console.error("Error deleteMitra:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};