const db = require("../config/database");

class UserModel {
  // Get all users
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM users");
    return rows;
  }

  // Get user by ID
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }

  // Create new user
  static async create(userData) {
    const { name, email } = userData;
    const [result] = await db.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    return { id: result.insertId, name, email };
  }

  // Update user
  static async update(id, userData) {
    const { name, email } = userData;
    const [result] = await db.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id]
    );
    return result.affectedRows > 0;
  }

  // Delete user
  static async deleteById(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }
}

module.exports = UserModel;
