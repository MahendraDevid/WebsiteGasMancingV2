const db = require("../config/database");

class PlaceModel {
  // Get all places
  static async findAll() {
    const [places] = await db.query("SELECT * FROM places");

    // Get related data for each place
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
  }

  // Get place by ID with all related data
  static async findById(id) {
    const [places] = await db.query("SELECT * FROM places WHERE id = ?", [id]);

    if (places.length === 0) {
      return null;
    }

    const place = places[0];

    // Get facilities
    const [facilities] = await db.query(
      "SELECT name FROM facilities WHERE place_id = ?",
      [id]
    );
    place.facilities = facilities.map((f) => f.name);

    // Get equipment
    const [equipment] = await db.query(
      "SELECT name, price, image FROM equipment WHERE place_id = ?",
      [id]
    );
    place.equipment = equipment;

    // Get reviews
    const [reviews] = await db.query(
      "SELECT name, score, comment FROM reviews WHERE place_id = ?",
      [id]
    );
    place.reviews = reviews;

    return place;
  }

  // Create new place with related data
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
    } = placeData;

    // Insert place
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

    const placeId = result.insertId;

    // Insert facilities
    if (facilities && facilities.length > 0) {
      const facilityValues = facilities.map((f) => [placeId, f]);
      await db.query("INSERT INTO facilities (place_id, name) VALUES ?", [
        facilityValues,
      ]);
    }

    // Insert equipment
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
    }

    // Insert reviews
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
  }

  // Search places
  static async search(keyword) {
    const searchTerm = `%${keyword}%`;
    const [places] = await db.query(
      "SELECT * FROM places WHERE title LIKE ? OR location LIKE ? OR description LIKE ?",
      [searchTerm, searchTerm, searchTerm]
    );

    // Get related data for each place
    for (let place of places) {
      const [facilities] = await db.query(
        "SELECT name FROM facilities WHERE place_id = ?",
        [place.id]
      );
      place.facilities = facilities.map((f) => f.name);
    }

    return places;
  }
}

module.exports = PlaceModel;
