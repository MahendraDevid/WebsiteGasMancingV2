// models/placeModel.js

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
  } // 2. Get place by ID with all related data

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

  static async create(placeData) {
    const {
      image,
      title,
      location,
      description,
      fullDescription,
      price,
      rating,
      reviewCount,
      totalReviews,
      facilities,
      equipment,
      reviews,
    } = placeData; // Insert place

    const [result] = await db.query(
      `INSERT INTO places (image, title, location, description, full_description, price, rating, review_count, total_reviews)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        image,
        title,
        location,
        description,
        fullDescription,
        price,
        rating || 0,
        reviewCount || 0,
        totalReviews || 0,
      ]
    );

    const placeId = result.insertId; // Insert facilities

    if (facilities && facilities.length > 0) {
      const facilityValues = facilities.map((f) => [placeId, f]);
      await db.query("INSERT INTO facilities (place_id, name) VALUES ?", [
        facilityValues,
      ]);
    } // Insert equipment

    if (equipment && equipment.length > 0) {
      const equipmentValues = equipment.map((e) => [
        placeId,
        e.name,
        e.price,
        e.image,
      ]);
      await db.query(
        "INSERT INTO equipment (place_id, name, price, image) VALUES ?",
        [equipmentValues]
      );
    } // Insert reviews

    if (reviews && reviews.length > 0) {
      const reviewValues = reviews.map((r) => [
        placeId,
        r.name,
        r.score,
        r.comment,
      ]);
      await db.query(
        "INSERT INTO reviews (place_id, name, score, comment) VALUES ?",
        [reviewValues]
      );
    }

    return this.findById(placeId);
  } // 4. SEARCH places with full related data (Menggunakan multi-kriteria: location, date, facilities)

  static async search(location, date, facilities) {
    let query = `
      SELECT DISTINCT p.*
      FROM tempat_pemancingan p
    `;
    
    let conditions = [];
    let params = [];

    // -----------------------------------------
    // 1. Filter lokasi / keyword
    // -----------------------------------------
    if (location && location !== "Semua Lokasi") {
      const searchTerm = `%${location}%`;
      conditions.push(`
        (p.title LIKE ? 
        OR p.location LIKE ? 
        OR p.description LIKE ? 
        OR p.full_description LIKE ?)`);
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // -----------------------------------------
    // 2. Filter fasilitas (many-to-many)
    // -----------------------------------------
    if (facilities) {
      query += `
        JOIN tempat_fasilitas tf ON p.id_tempat = tf.id_tempat
        JOIN fasilitas f ON tf.id_fasilitas = f.id_fasilitas
      `;
      conditions.push(`f.nama_fasilitas LIKE ?`);
      params.push(`%${facilities}%`);
    }

    // -----------------------------------------
    // 3. Filter tanggal (belum ada)
    // -----------------------------------------
    if (date) {
      // Nanti bisa ditambah filter tanggal
    }

    // Build WHERE
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Sort by rating
    query += " ORDER BY p.average_rating DESC";

    // Eksekusi query
    const [places] = await db.query(query, params);
    if (places.length === 0) return [];

    // -----------------------------------------
    // 4. Fetch data terkait
    // -----------------------------------------
    for (let place of places) {

      // Ambil fasilitas
      const [facilitiesData] = await db.query(`
        SELECT f.nama_fasilitas
        FROM fasilitas f
        JOIN tempat_fasilitas tf ON f.id_fasilitas = tf.id_fasilitas
        WHERE tf.id_tempat = ?
      `, [place.id_tempat]);
      place.fasilitas = facilitiesData.map(f => f.nama_fasilitas);

      // Ambil item_sewa (karena sudah ada id_tempat)
      const [equipment] = await db.query(`
        SELECT nama_item, price, price_unit, image_url, tipe_item
        FROM item_sewa
        WHERE id_tempat = ?
      `, [place.id_tempat]);
      place.item_sewa = equipment;

      // Ambil review
      const [reviews] = await db.query(`
        SELECT r.score, r.comment, r.review_date, u.nama_lengkap AS reviewer
        FROM review r
        LEFT JOIN pengguna u ON r.id_pengguna = u.id_pengguna
        WHERE r.id_tempat = ?
      `, [place.id_tempat]);
      place.reviews = reviews;
    }

    return places;
  }


}

module.exports = PlaceModel;
