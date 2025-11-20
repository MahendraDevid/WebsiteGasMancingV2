const placeModel = require("../models/placeModel");

// Get all places
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await placeModel.findAll();
    res.json({ success: true, data: places });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get place by ID
exports.getPlaceById = async (req, res) => {
  try {
    const place = await placeModel.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, error: "Place not found" });
    }
    res.json({ success: true, data: place });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new place
exports.createPlace = async (req, res) => {
  try {
    const newPlace = await placeModel.create(req.body);
    res.status(201).json({ success: true, data: newPlace });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Search places
exports.searchPlaces = async (req, res) => {
  try {
   // Ambil ketiga parameter dari query
   const { location, date, facilities } = req.query; 

   // Pastikan setidaknya satu kriteria ada, jika tidak, kita bisa anggap itu 'getAll'
   if (!location && !date && !facilities) {
    return res
     .status(400)
     .json({ success: false, error: "At least one search query required" });
   }
    
   // Panggil model search dengan ketiga parameter
   const places = await placeModel.search(location, date, facilities); 
   res.json({ success: true, data: places });
  } catch (error) {
   res.status(500).json({ success: false, error: error.message });
  }
};
