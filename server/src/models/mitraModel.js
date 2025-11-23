// models/mitraModel.js

const db = require('../config/database');

class MitraModel {
    /**
     * Membuat Mitra Baru
     */
    static async create(data) {
        const query = `
            INSERT INTO mitra 
            (nama_lengkap, email, password_hash, no_telepon, alamat, nama_bank, no_rekening, atas_nama_rekening, tgl_daftar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `.trim();

        // Catatan: Di real app, password_hash harus di-enkripsi (misal pakai bcrypt)
        const values = [
            data.nama_lengkap,
            data.email,
            data.password_hash, 
            data.no_telepon,
            data.alamat,
            data.nama_bank,
            data.no_rekening,
            data.atas_nama_rekening
        ];

        const [result] = await db.query(query, values);
        return result.insertId;
    }

    /**
     * Mencari Mitra berdasarkan ID
     */
    static async findById(id) {
        const query = `SELECT * FROM mitra WHERE id_mitra = ?`;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    static async findByEmail(email) {
        const query = `SELECT * FROM mitra WHERE email = ?`;
        const [rows] = await db.query(query, [email]);
        return rows[0];
    }

    /**
     * Mengupdate Data Mitra
     * Fitur: Hanya mengupdate kolom yang dikirim saja (Dynamic Query)
     */
    static async update(id, data) {
        // Siapkan field yang mau diupdate
        const fields = [];
        const values = [];

        // Cek satu per satu inputan, jika ada baru dimasukkan ke query
        if (data.nama_lengkap) { fields.push('nama_lengkap = ?'); values.push(data.nama_lengkap); }
        if (data.email) { fields.push('email = ?'); values.push(data.email); }
        if (data.password_hash) { fields.push('password_hash = ?'); values.push(data.password_hash); }
        if (data.no_telepon) { fields.push('no_telepon = ?'); values.push(data.no_telepon); }
        if (data.alamat) { fields.push('alamat = ?'); values.push(data.alamat); }
        if (data.nama_bank) { fields.push('nama_bank = ?'); values.push(data.nama_bank); }
        if (data.no_rekening) { fields.push('no_rekening = ?'); values.push(data.no_rekening); }
        if (data.atas_nama_rekening) { fields.push('atas_nama_rekening = ?'); values.push(data.atas_nama_rekening); }

        // Jika tidak ada data yang dikirim untuk diupdate
        if (fields.length === 0) return false;

        // Tambahkan ID ke values array untuk WHERE clause
        values.push(id);

        const query = `UPDATE mitra SET ${fields.join(', ')} WHERE id_mitra = ?`;
        
        const [result] = await db.query(query, values);
        return result.affectedRows > 0;
    }

    /**
     * Menghapus Mitra
     * Efek: id_mitra di tabel tempat_pemancingan akan jadi NULL (sesuai settingan DB Anda)
     */
    static async delete(id) {
        const query = `DELETE FROM mitra WHERE id_mitra = ?`;
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = MitraModel;