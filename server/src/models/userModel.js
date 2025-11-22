const db = require("../config/database");

class UserModel {
  // Find user by email
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM pengguna WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT id_pengguna, nama_lengkap, email, no_telepon, tipe_user, tgl_daftar FROM pengguna WHERE id_pengguna = ?",
      [id]
    );
    return rows[0];
  }

  // Create user
  static async createUser(userData) {
    const { nama_lengkap, email, password_hash, no_telepon } = userData;
    const [result] = await db.query(
      "INSERT INTO pengguna (nama_lengkap, email, password_hash, no_telepon, tipe_user) VALUES (?, ?, ?, ?, ?)",
      [nama_lengkap, email, password_hash, no_telepon || null, "customer"]
    );
    return result.insertId;
  }
}

module.exports = UserModel;
