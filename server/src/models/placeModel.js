// models/placeModel.js (FINAL & OPTIMIZED)

const db = require("../config/database");

class PlaceModel {
  // ======================================
  // 1. GET ALL TEMPAT PEMANCINGAN (OPTIMIZED N+1)
  // ======================================
  static async findAll() {
    // Q1: Ambil semua tempat utama
    const [places] = await db.query("SELECT * FROM tempat_pemancingan");

    if (places.length === 0) return [];

    const placeIds = places.map((p) => p.id_tempat);

    // Q2: Ambil SEMUA fasilitas untuk SEMUA tempat
    const [allFacilities] = await db.query(
      `SELECT tf.id_tempat, 
            f.nama_fasilitas 
            FROM tempat_fasilitas tf
            JOIN fasilitas f ON tf.id_fasilitas = f.id_fasilitas
            WHERE tf.id_tempat IN (?)`,
      [placeIds]
    );

    // Q3: Ambil SEMUA item sewa untuk SEMUA tempat
    const [allItems] = await db.query(
      `SELECT id_tempat, id_item, nama_item, price, price_unit, image_url, tipe_item
             FROM item_sewa
             WHERE id_tempat IN (?)`,
      [placeIds]
    );

    // Q4: Ambil SEMUA review untuk SEMUA tempat
    const [allReviews] = await db.query(
      `SELECT 
                r.id_tempat, r.score, r.comment, r.review_date, u.nama_lengkap AS reviewer
             FROM review r
             LEFT JOIN pengguna u ON r.id_pengguna = u.id_pengguna
             WHERE r.id_tempat IN (?)`,
      [placeIds]
    );

    // MAPPING (Mengelompokkan data terkait di Node.js)
    const mappedFacilities = {};
    allFacilities.forEach((f) => {
      if (!mappedFacilities[f.id_tempat]) mappedFacilities[f.id_tempat] = [];
      mappedFacilities[f.id_tempat].push(f.nama_fasilitas);
    });

    const mappedItems = {};
    allItems.forEach((i) => {
      if (!mappedItems[i.id_tempat]) mappedItems[i.id_tempat] = [];
      mappedItems[i.id_tempat].push(i);
    });

    const mappedReviews = {};
    allReviews.forEach((r) => {
      if (!mappedReviews[r.id_tempat]) mappedReviews[r.id_tempat] = [];
      mappedReviews[r.id_tempat].push(r);
    });

    // Final Assembly: Menggabungkan tempat utama dengan data terkait
    return places.map((place) => ({
      ...place,
      fasilitas: mappedFacilities[place.id_tempat] || [],
      item_sewa: mappedItems[place.id_tempat] || [],
      reviews: mappedReviews[place.id_tempat] || [],
    }));
  } // End findAll()

  // -------------------------------------------------------------
  // 2. GET TEMPAT BY ID (Efisien untuk ID tunggal)
  // -------------------------------------------------------------
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
    place.fasilitas = facilities.map((f) => f.nama_fasilitas);

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

  // -------------------------------------------------------------
  // 3. CREATE TEMPAT PEMANCINGAN (Disesuaikan dengan skema DB)
  // -------------------------------------------------------------
  static async create(placeData) {
    const {
      title,
      location,
      base_price, // Menggunakan base_price dari skema DB
      price_unit,
      image_url,
      description,
      full_description,
      // reviewCount dan rating diurus oleh DB/Review logic
      fasilitas = [], // Gunakan nama fasilitas
      item_sewa = [], // Item sewa baru
    } = placeData;

    // 1. Insert Tempat Pemancingan
    const [result] = await db.query(
      `INSERT INTO tempat_pemancingan (title, location, base_price, price_unit, image_url, description, full_description)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        location,
        base_price,
        price_unit,
        image_url,
        description,
        full_description,
      ]
    );

    const placeId = result.insertId;

    // 2. Insert Fasilitas (membutuhkan id_fasilitas)
    if (fasilitas.length > 0) {
      // Asumsi: Fasilitas yang dikirim adalah nama, kita perlu ID-nya
      const [existingFacilities] = await db.query(
        `SELECT id_fasilitas FROM fasilitas WHERE nama_fasilitas IN (?)`,
        [fasilitas]
      );

      if (existingFacilities.length > 0) {
        const facilityValues = existingFacilities.map((f) => [
          placeId,
          f.id_fasilitas,
        ]);
        await db.query(
          "INSERT INTO tempat_fasilitas (id_tempat, id_fasilitas) VALUES ?",
          [facilityValues]
        );
      }
    }

    // 3. Insert Item Sewa
    if (item_sewa.length > 0) {
      const equipmentValues = item_sewa.map((e) => [
        e.nama_item,
        e.price,
        e.price_unit,
        e.image_url || null,
        e.tipe_item || "peralatan",
        placeId,
      ]);

      await db.query(
        `INSERT INTO item_sewa (nama_item, price, price_unit, image_url, tipe_item, id_tempat) VALUES ?`,
        [equipmentValues]
      );
    }

    // Tidak perlu memasukkan reviews saat create, reviews dibuat terpisah

    return this.findById(placeId);
  }

  // -------------------------------------------------------------
  // 4. SEARCH places (OPTIMIZED N+1)
  // -------------------------------------------------------------
  static async search(location, date, facilities) {
    let query = `
            SELECT DISTINCT p.*
            FROM tempat_pemancingan p
        `;

    let conditions = [];
    let params = [];

    // 1. Filter lokasi / keyword
    if (location && location !== "Semua Lokasi") {
      const searchTerm = `%${location}%`;
      conditions.push(`
                (p.title LIKE ? 
                OR p.location LIKE ? 
                OR p.description LIKE ? 
                OR p.full_description LIKE ?)`);
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // 2. Filter fasilitas (many-to-many)
    if (facilities) {
      query += `
                JOIN tempat_fasilitas tf ON p.id_tempat = tf.id_tempat
                JOIN fasilitas f ON tf.id_fasilitas = f.id_fasilitas
            `;
      // Asumsi: facilities adalah string tunggal yang dicari
      conditions.push(`f.nama_fasilitas LIKE ?`);
      params.push(`%${facilities}%`);
    }

    // 3. Filter tanggal (Diabaikan sementara, belum ada logic DB)

    // Build WHERE
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Sort by rating
    query += " ORDER BY p.average_rating DESC";

    // Eksekusi query
    const [places] = await db.query(query, params);
    if (places.length === 0) return [];

    // 4. Batch Fetching data terkait (Sama seperti findAll)
    const placeIds = places.map((p) => p.id_tempat);

    // Q-Batch: Ambil SEMUA data terkait
    const [allFacilities] = await db.query(
      `SELECT tf.id_tempat, f.nama_fasilitas 
             FROM tempat_fasilitas tf JOIN fasilitas f ON tf.id_fasilitas = f.id_fasilitas
             WHERE tf.id_tempat IN (?)`,
      [placeIds]
    );
    const [allItems] = await db.query(
      `SELECT id_tempat, nama_item, price, price_unit, image_url, tipe_item
             FROM item_sewa WHERE id_tempat IN (?)`,
      [placeIds]
    );
    const [allReviews] = await db.query(
      `SELECT r.id_tempat, r.score, r.comment, r.review_date, u.nama_lengkap AS reviewer
             FROM review r LEFT JOIN pengguna u ON r.id_pengguna = u.id_pengguna
             WHERE r.id_tempat IN (?)`,
      [placeIds]
    );

    // MAPPING (Sama seperti findAll)
    const mappedFacilities = {};
    allFacilities.forEach((f) => {
      if (!mappedFacilities[f.id_tempat]) mappedFacilities[f.id_tempat] = [];
      mappedFacilities[f.id_tempat].push(f.nama_fasilitas);
    });

    const mappedItems = {};
    allItems.forEach((i) => {
      if (!mappedItems[i.id_tempat]) mappedItems[i.id_tempat] = [];
      mappedItems[i.id_tempat].push(i);
    });

    const mappedReviews = {};
    allReviews.forEach((r) => {
      if (!mappedReviews[r.id_tempat]) mappedReviews[r.id_tempat] = [];
      mappedReviews[r.id_tempat].push(r);
    });

    // Final Assembly
    return places.map((place) => ({
      ...place,
      fasilitas: mappedFacilities[place.id_tempat] || [],
      item_sewa: mappedItems[place.id_tempat] || [],
      reviews: mappedReviews[place.id_tempat] || [],
    }));
  }
}

module.exports = PlaceModel;
