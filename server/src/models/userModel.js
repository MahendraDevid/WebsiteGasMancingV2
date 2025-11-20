// server/src/models/UserModel.js
const db = require("../config/database");

class UserModel {
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM pengguna WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  static async createUser({ nama_lengkap, email, password_hash, no_telepon }) {
    const [result] = await db.query(
      `INSERT INTO pengguna (nama_lengkap, email, password_hash, no_telepon)
       VALUES (?, ?, ?, ?)`,
      [nama_lengkap, email, password_hash, no_telepon]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query(
      "SELECT id_pengguna, nama_lengkap, email, no_telepon, tipe_user FROM pengguna WHERE id_pengguna = ?",
      [id]
    );
    return rows[0];
  }
}

module.exports = UserModel;
