const placeModel = require("../models/placeModel");

// 1. GET ALL PLACES (Dipakai HomeView & Dashboard Mitra)
exports.getAllPlaces = async (req, res) => {
  try {
    const { mitra_id } = req.query;

    let places;
    // 1. Jika Request dari Dashboard Mitra
    if (mitra_id) {
      places = await placeModel.getPlacesByMitraId(mitra_id);
    } 
    // 2. Jika Request dari Home (Customer)
    else {
      // Ini akan memanggil findAll canggih Anda tadi
      places = await placeModel.findAll();
    }

    res.json({ success: true, data: places });
  } catch (error) {
    console.error("Error getAllPlaces:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. SEARCH PLACES
exports.searchPlaces = async (req, res) => {
  try {
    const { location, price, facilities } = req.query;

    console.log("Search Params:", { location, price, facilities }); // Debugging
    
    // Jika tidak ada parameter search, kembalikan error atau kosong
    if (!location && !price && !facilities) {
       // Opsional: Bisa return getAllPlaces() jika mau fallback
       return res.status(400).json({ success: false, error: "Parameter pencarian kosong" });
    }

    const places = await placeModel.search(location, price, facilities);
    res.status(200).json({ success: true, count: places.length, data: places });
  } catch (error) {
    console.error("Error searchPlaces:", error);
    res.status(500).json({ success: false, message: "Terjadi Kesalahan", error: error.message });
  }
};

// 3. GET BY ID
exports.getPlaceById = async (req, res) => {
  try {
    const place = await placeModel.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, error: "Tempat tidak ditemukan" });
    }
    res.json({ success: true, data: place });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. CREATE PLACE (Dipakai AddPlace.vue)
exports.createPlace = async (req, res) => {
  try {
    console.log("Data Create:", req.body);
    const newPlace = await placeModel.create(req.body);
    res.status(201).json({ success: true, data: newPlace });
  } catch (error) {
    console.error("Error Create:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5. UPDATE PLACE (Dipakai EditPlace.vue - WAJIB ADA)
exports.updatePlace = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await placeModel.update(id, req.body);
    
    if (!success) {
        return res.status(404).json({ success: false, message: "Gagal update" });
    }
    res.json({ success: true, message: "Berhasil update" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 6. DELETE PLACE (Dipakai Delete di Properti.vue - WAJIB ADA)
exports.deletePlace = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await placeModel.delete(id);
    
    if (!success) {
        return res.status(404).json({ success: false, message: "Gagal hapus" });
    }
    res.json({ success: true, message: "Berhasil hapus" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};