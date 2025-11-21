// controllers/mitraController.js

const MitraModel = require('../models/mitraModel');

// 1. Create Mitra
exports.createMitra = async (req, res) => {
    try {
        const data = req.body;

        // Validasi dasar
        if (!data.nama_lengkap || !data.email || !data.password_hash) {
            return res.status(400).json({ success: false, message: "Nama, Email, dan Password wajib diisi." });
        }

        const newId = await MitraModel.create(data);
        
        res.status(201).json({ 
            success: true, 
            message: "Mitra berhasil dibuat.",
            data: { id_mitra: newId, ...data } 
        });
    } catch (error) {
        console.error("Error createMitra:", error);
        // Handle error duplikat email (kode error MySQL untuk duplicate entry biasanya 1062)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: "Email sudah terdaftar." });
        }
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