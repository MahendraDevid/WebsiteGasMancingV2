// models/placeModel.js

const db = require("../config/database");

class PlaceModel {
  // 1. Get all places
  static async findAll() {
    const [places] = await db.query("SELECT * FROM places"); // Get related data for each place

    for (let place of places) {
      const [facilities] = await db.query(
        "SELECT name FROM facilities WHERE place_id = ?",
        [place.id]
      );
      place.facilities = facilities.map((f) => f.name);

      const [equipment] = await db.query(
        "SELECT name, price, image FROM equipment WHERE place_id = ?",
        [place.id]
      );
      place.equipment = equipment;

      const [reviews] = await db.query(
        "SELECT name, score, comment FROM reviews WHERE place_id = ?",
        [place.id]
      );
      place.reviews = reviews;
    }

    return places;
  } // 2. Get place by ID with all related data

  static async findById(id) {
    const [places] = await db.query("SELECT * FROM places WHERE id = ?", [id]);

    if (places.length === 0) {
      return null;
    }

    const place = places[0]; // Get facilities

    const [facilities] = await db.query(
      "SELECT name FROM facilities WHERE place_id = ?",
      [id]
    );
    place.facilities = facilities.map((f) => f.name); // Get equipment

    const [equipment] = await db.query(
      "SELECT name, price, image FROM equipment WHERE place_id = ?",
      [id]
    );
    place.equipment = equipment; // Get reviews

    const [reviews] = await db.query(
      "SELECT name, score, comment FROM reviews WHERE place_id = ?",
      [id]
    );
    place.reviews = reviews;

    return place;
  } // 3. Create new place with related data (Logika tidak diubah)

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
        SELECT p.*
        FROM places p
    `;
    let conditions = [];
    let params = [];

    // --- Kondisi Pencarian Lokasi/Kata Kunci (mencari di title, location, description) ---
    if (location && location !== "Semua Lokasi") {
      const searchTerm = `%${location}%`;
      conditions.push(
        `(p.title LIKE ? OR p.location LIKE ? OR p.description LIKE ? OR p.full_description LIKE ?)`
      );
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // --- Kondisi Pencarian Fasilitas (Menggunakan JOIN) ---
    if (facilities) {
      // Lakukan JOIN ke tabel facilities
      query += ` JOIN facilities f ON p.id = f.place_id`;
      // Tambahkan kondisi pencarian fasilitas
      conditions.push(`f.name LIKE ?`);
      params.push(`%${facilities}%`);

      query += ` GROUP BY p.id`; // GROUP BY diperlukan untuk menghindari duplikasi hasil dari JOIN
    }

    // --- Kondisi Pencarian Tanggal (Saat ini hanya placeholder karena tidak ada tabel bookings) ---
    if (date) {
      // Logika untuk filter berdasarkan ketersediaan tanggal akan ditambahkan di sini
      // Misalnya: conditions.push(`p.id NOT IN (SELECT place_id FROM bookings WHERE booking_date = ?)`);
      // Misalnya: params.push(date);
    } // Bangun klausa WHERE secara dinamis

    if (conditions.length > 0) {
      query = query.trim() + ` WHERE ` + conditions.join(" AND ");
    }

    // Tambahkan urutan
    query += ` ORDER BY p.rating DESC`; // Eksekusi query utama

    const [places] = await db.query(query, params);

    if (places.length === 0) return []; // Fetch related data for each place (Fasilitas, Equipment, Reviews)

    for (let place of places) {
      // Facilities
      const [facilitiesData] = await db.query(
        "SELECT name FROM facilities WHERE place_id = ?",
        [place.id]
      );
      place.facilities = facilitiesData.map((f) => f.name); // Equipment

      const [equipment] = await db.query(
        "SELECT name, price, image FROM equipment WHERE place_id = ?",
        [place.id]
      );
      place.equipment = equipment; // Reviews

      const [reviews] = await db.query(
        "SELECT name, score, comment FROM reviews WHERE place_id = ?",
        [place.id]
      );
      place.reviews = reviews;
    }

    return places;
  }
}

module.exports = PlaceModel;
