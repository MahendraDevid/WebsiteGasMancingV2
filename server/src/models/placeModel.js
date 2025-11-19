const db = require("../config/database");

class PlaceModel {

  // ======================================
  // GET ALL TEMPAT PEMANCINGAN
  // ======================================
  static async findAll() {
    const [places] = await db.query("SELECT * FROM tempat_pemancingan");

    for (let place of places) {

      // FASILITAS (many-to-many)
      const [facilities] = await db.query(
        `SELECT f.nama_fasilitas 
         FROM fasilitas f
         JOIN tempat_fasilitas tf 
           ON f.id_fasilitas = tf.id_fasilitas
         WHERE tf.id_tempat = ?`,
        [place.id_tempat]
      );
      place.fasilitas = facilities.map(f => f.nama_fasilitas);

      // ITEM SEWA (peralatan & layanan)
      const [items] = await db.query(
        `SELECT id_item, nama_item, price, price_unit, image_url, tipe_item
         FROM item_sewa
         WHERE id_item IN (
            SELECT id_item FROM detail_pemesanan_item WHERE id_pesanan IN (
               SELECT id_pesanan FROM pemesanan WHERE id_tempat = ?
            )
         )`,
        [place.id_tempat]
      );
      place.item_sewa = items;

      // REVIEW
      const [reviews] = await db.query(
        `SELECT r.score, r.comment, r.review_date, u.nama_lengkap AS reviewer
         FROM review r
         LEFT JOIN pengguna u ON r.id_pengguna = u.id_pengguna
         WHERE r.id_tempat = ?`,
        [place.id_tempat]
      );

      place.reviews = reviews;
    }

    return places;
  }

  // ======================================
  // GET TEMPAT BY ID
  // ======================================
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM tempat_pemancingan WHERE id_tempat = ?",
      [id]
    );

    if (rows.length === 0) return null;

    const place = rows[0];

    // Fasilitas
    const [facilities] = await db.query(
      `SELECT f.nama_fasilitas 
       FROM fasilitas f
       JOIN tempat_fasilitas tf 
         ON f.id_fasilitas = tf.id_fasilitas
       WHERE tf.id_tempat = ?`,
      [id]
    );
    place.fasilitas = facilities.map(f => f.nama_fasilitas);

    // Item sewa
    const [items] = await db.query(
      `SELECT id_item, nama_item, price, price_unit, image_url, tipe_item
      FROM item_sewa
      WHERE id_tempat = ?`,
      [place.id_tempat]
    );
    place.item_sewa = items;

    // Review
    const [reviews] = await db.query(
      `SELECT r.score, r.comment, r.review_date, u.nama_lengkap AS reviewer
       FROM review r
       LEFT JOIN pengguna u ON r.id_pengguna = u.id_pengguna
       WHERE r.id_tempat = ?`,
      [id]
    );
    place.reviews = reviews;

    return place;
  }

  // ======================================
  // SEARCH TEMPAT
  // ======================================
  static async search(keyword) {
    const term = `%${keyword}%`;

    const [places] = await db.query(
      `SELECT * FROM tempat_pemancingan
       WHERE title LIKE ? 
          OR location LIKE ?
          OR description LIKE ?`,
      [term, term, term]
    );

    // Tambahkan fasilitas
    for (let place of places) {
      const [facilities] = await db.query(
        `SELECT f.nama_fasilitas 
         FROM fasilitas f
         JOIN tempat_fasilitas tf 
           ON f.id_fasilitas = tf.id_fasilitas
         WHERE tf.id_tempat = ?`,
        [place.id_tempat]
      );
      place.fasilitas = facilities.map(f => f.nama_fasilitas);
    }

    return places;
  }

}

module.exports = PlaceModel;
