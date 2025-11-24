// server/src/models/placeModel.js (FINAL VERSION)

const db = require("../config/database");

class PlaceModel {
  // ======================================
  // 1. GET ALL TEMPAT PEMANCINGAN (OPTIMIZED N+1) - [TIDAK DIUBAH]
  // ======================================
  static async findAll() {
    try {
      console.log("--- DEBUG: Memulai findAll Sederhana ---");
      
      // Kita ambil data tempatnya saja dulu (Tanpa Fasilitas/Review)
      // Tujuannya biar HomeView JALAN DULU
      const query = "SELECT * FROM tempat_pemancingan ORDER BY created_at DESC";
      
      const [places] = await db.query(query);
      
      console.log(`--- DEBUG: Berhasil ambil ${places.length} tempat ---`);
      
      // Return data mentah
      return places;

    } catch (error) {
      console.error("FATAL ERROR di Model findAll:", error);
      throw error; 
    }
  }

  // -------------------------------------------------------------
  // 2. GET TEMPAT BY ID (Efisien untuk ID tunggal) - [TIDAK DIUBAH]
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
  // [BARU] 2.5 GET PLACES BY MITRA ID (Untuk Dashboard Mitra)
  // -------------------------------------------------------------
  static async getPlacesByMitraId(mitraId) {
    // Hanya ambil tempat yang id_mitra-nya cocok
    const query = `
        SELECT * FROM tempat_pemancingan 
        WHERE id_mitra = ? 
        ORDER BY created_at DESC
    `;
    const [rows] = await db.query(query, [mitraId]);
    return rows;
  }

  // -------------------------------------------------------------
  // 3. CREATE TEMPAT PEMANCINGAN - [DIUPDATE UNTUK ID_MITRA]
  // -------------------------------------------------------------
  static async create(placeData) {
    // 1. LAKUKAN MAPPING DARI FRONTEND (INDO) KE DATABASE (INGGRIS)
    const title = placeData.title || placeData.namaProperti;
    const location = placeData.location || placeData.alamatProperti;
    const base_price = placeData.base_price || placeData.hargaSewa;
    const price_unit = placeData.price_unit || placeData.satuanSewa;
    
    // Default image jika kosong
    const image_url = placeData.image_url || 'https://placehold.co/600x400?text=No+Image'; 
    
    // Ambil sisa datanya
    const {
      description,
      full_description,
      id_mitra,
      fasilitas = [],
      item_sewa = [],
      jamBuka,
      jamTutup
    } = placeData;

    // 2. VALIDASI SEDERHANA
    if (!title) throw new Error("Nama Properti (title) wajib diisi.");
    if (!id_mitra) throw new Error("ID Mitra tidak ditemukan.");
    
    // 3. INSERT KE DATABASE
    // Pastikan urutan kolom dan values SAMA PERSIS
    const [result] = await db.query(
      `INSERT INTO tempat_pemancingan (
          title, location, base_price, price_unit, image_url, 
          description, full_description, id_mitra, jam_buka, jam_tutup, created_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title,          // Sudah dimapping dari namaProperti
        location,       // Sudah dimapping dari alamatProperti
        base_price,     // Sudah dimapping dari hargaSewa
        price_unit,     // Sudah dimapping dari satuanSewa
        image_url,
        description,
        full_description || description, // Fallback jika full_desc kosong
        id_mitra,
        jamBuka || '08:00:00',
        jamTutup || '17:00:00'
      ]
    );

    const placeId = result.insertId;

    // 4. INSERT FASILITAS (Sama seperti sebelumnya)
    if (fasilitas.length > 0) {
      // Cek ID Fasilitas berdasarkan nama (jika frontend kirim nama)
      // Atau jika frontend sudah kirim ID, langsung pakai.
      // Kode di bawah asumsi frontend kirim ID atau Nama yang valid.
      // Untuk keamanan, kita filter fasilitas yang valid dulu.
      const [existingFacilities] = await db.query(
        `SELECT id_fasilitas FROM fasilitas WHERE id_fasilitas IN (?)`,
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

    // 5. INSERT ITEM SEWA (Sama seperti sebelumnya)
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

    return this.findById(placeId);
  }


  // -------------------------------------------------------------
  // [BARU] 3.5 UPDATE TEMPAT
  // -------------------------------------------------------------
  static async update(id, data) {
    const fields = [];
    const values = [];

    // Mapping dari nama field Frontend (EditPlace.vue) ke Database
    if (data.namaProperti) { fields.push('title = ?'); values.push(data.namaProperti); }
    if (data.alamatProperti) { fields.push('location = ?'); values.push(data.alamatProperti); }
    if (data.hargaSewa) { fields.push('base_price = ?'); values.push(data.hargaSewa); }
    if (data.satuanSewa) { fields.push('price_unit = ?'); values.push(data.satuanSewa); }
    if (data.deskripsi) { fields.push('description = ?'); values.push(data.deskripsi); }
    
    // Cek kolom jam buka tutup jika ada di DB (sesuaikan nama kolom DB Anda)
    if (data.jamBuka) { fields.push('jam_buka = ?'); values.push(data.jamBuka); }
    if (data.jamTutup) { fields.push('jam_tutup = ?'); values.push(data.jamTutup); }

    if (fields.length === 0) return false; // Tidak ada yang diupdate

    values.push(id); // Parameter terakhir untuk WHERE id_tempat

    const query = `UPDATE tempat_pemancingan SET ${fields.join(', ')} WHERE id_tempat = ?`;
    
    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  }

  // -------------------------------------------------------------
  // [BARU] 3.6 DELETE TEMPAT
  // -------------------------------------------------------------
  static async delete(id) {
    // Hapus data anak dulu (Fasilitas & Item) biar bersih
    await db.query("DELETE FROM tempat_fasilitas WHERE id_tempat = ?", [id]);
    await db.query("DELETE FROM item_sewa WHERE id_tempat = ?", [id]);
    
    // Baru hapus induknya
    const [result] = await db.query("DELETE FROM tempat_pemancingan WHERE id_tempat = ?", [id]);
    return result.affectedRows > 0;
  }

  // -------------------------------------------------------------
  // 4. SEARCH places (OPTIMIZED N+1) - [TIDAK DIUBAH]
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
      conditions.push(`f.nama_fasilitas LIKE ?`);
      params.push(`%${facilities}%`);
    }

    // Build WHERE
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY p.average_rating DESC";

    const [places] = await db.query(query, params);
    if (places.length === 0) return [];

    // 4. Batch Fetching data terkait (Sama seperti findAll)
    const placeIds = places.map((p) => p.id_tempat);

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

    // MAPPING
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