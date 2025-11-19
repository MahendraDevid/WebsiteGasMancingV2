// placeModel.js
const db = require("../config/database");

class PlaceModel {
  // ... findAll, findById, create (tetap sama) ...

  // SEARCH places with full related data
  static async search(location, date, facilities) {
    let query = `
        SELECT p.*
        FROM places p
    `;
    let conditions = [];
    let params = [];

    // --- 1. Kondisi Pencarian Lokasi (title, location, description) ---
    if (location && location !== "Semua Lokasi") {
      const searchTerm = `%${location}%`;
      conditions.push(
        `(p.title LIKE ? OR p.location LIKE ? OR p.description LIKE ? OR p.full_description LIKE ?)`
      );
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // --- 2. Kondisi Pencarian Fasilitas ---
    if (facilities) {
      // Lakukan JOIN ke tabel facilities
      query += ` JOIN facilities f ON p.id = f.place_id`; // Perbaiki penambahan string: pastikan ada spasi di awal
      // Tambahkan kondisi pencarian fasilitas
      conditions.push(`f.name LIKE ?`);
      params.push(`%${facilities}%`);

      query += ` GROUP BY p.id`; // Pastikan ada spasi di awal
    }

    // --- 3. Kondisi Pencarian Tanggal (Placeholder) ---
    if (date) {
      // Jika ada tabel bookings, logika JOIN akan ditambahkan di sini
    } // Bangun klausa WHERE: Hapus karakter tak terlihat (tab/enter) di sekeliling `query`

    // Kami menggunakan trim() untuk membersihkan whitespace berlebihan pada string template.
    if (conditions.length > 0) {
      query = query.trim() + ` WHERE ` + conditions.join(" AND ");
    }

    // Batasi dan Urutkan
    query += ` ORDER BY p.rating DESC`;

    console.log("SQL Query:", query); // ✅ Tambahkan ini untuk debugging di console // Eksekusi query utama

    const [places] = await db.query(query, params);

    if (places.length === 0) return []; // Fetch related data for each place (Fasilitas, Equipment, Reviews) - TETAP SAMA

    for (let place of places) {
      // ... (Logika pengambilan fasilitas, equipment, review tetap sama) ...
      const [facilitiesData] = await db.query(
        "SELECT name FROM facilities WHERE place_id = ?",
        [place.id]
      );
      place.facilities = facilitiesData.map((f) => f.name);

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
  }
}

module.exports = PlaceModel;
