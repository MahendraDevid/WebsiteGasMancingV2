// server/src/controllers/placeController.js

const PlaceModel = require('../models/placeModel'); // Pastikan ini ada di paling atas
const placeModel = require('../models/placeModel'); // Opsional: Hapus duplikat ini jika sudah ada baris di atas

// 1. GET ALL PLACES
exports.getAllPlaces = async (req, res) => {
  try {
    const { mitra_id } = req.query;
    let places;
    if (mitra_id) {
      // Pastikan method getPlacesByMitraId ada di model, atau pakai findAll dengan filter manual
      // places = await placeModel.getPlacesByMitraId(mitra_id); 
      // Jika belum ada, gunakan findAll lalu filter di JS sementara:
      const all = await PlaceModel.findAll();
      places = all.filter(p => p.id_mitra == mitra_id);
    } else {
      places = await PlaceModel.findAll();
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
    const places = await PlaceModel.search(location, price, facilities);
    res.status(200).json({ success: true, count: places.length, data: places });
  } catch (error) {
    console.error("Error searchPlaces:", error);
    res.status(500).json({ success: false, message: "Terjadi Kesalahan", error: error.message });
  }
};

// 3. GET BY ID
exports.getPlaceById = async (req, res) => {
  try {
    const place = await PlaceModel.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, error: "Tempat tidak ditemukan" });
    }
    res.json({ success: true, data: place });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. CREATE PLACE (YANG DIPERBAIKI UNTUK MENANGANI JAM BUKA/TUTUP)
exports.createPlace = async (req, res) => {
  try {
    const data = req.body; 
    const file = req.file; 

    // Validasi ID Mitra
    if (!data.id_mitra) {
        return res.status(400).json({ success: false, message: "ID Mitra tidak ditemukan." });
    }

    // Parsing JSON
    let itemsParsed = [];
    let fasilitasParsed = [];
    if (data.items) itemsParsed = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
    if (data.fasilitas) fasilitasParsed = typeof data.fasilitas === 'string' ? JSON.parse(data.fasilitas) : data.fasilitas;

    // Handle Gambar
    let imageName = "default_place.jpg";
    if (file) imageName = file.filename;

    // === LOGIKA PENGGABUNGAN JAM KE DESKRIPSI ===
    let finalDescription = data.deskripsi || "";
    
    // Cek apakah ada input jam buka/tutup
    if (data.jamBuka && data.jamTutup) {
        // Tambahkan info jam di awal deskripsi singkat
        // Contoh hasil: "Buka: 08:00 - 17:00. Kolam pemancingan nyaman..."
        finalDescription = `Buka: ${data.jamBuka} - ${data.jamTutup}. ${finalDescription}`;
    }
    // ==============================================

    const placeData = {
        title: data.namaProperti,
        location: data.alamatProperti,
        base_price: data.hargaSewa,
        price_unit: data.satuanSewa,
        
        // Masukkan deskripsi yang sudah digabung tadi
        description: finalDescription, 
        full_description: data.deskripsi, // Deskripsi lengkap tetap original
        
        image_url: imageName,
        fasilitas: fasilitasParsed,
        item_sewa: itemsParsed,
        id_mitra: data.id_mitra
    };

    const newPlace = await PlaceModel.create(placeData);

    res.status(201).json({
        success: true,
        message: "Tempat berhasil ditambahkan",
        data: newPlace
    });

  } catch (error) {
    console.error("Create Place Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. UPDATE PLACE
exports.updatePlace = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    // === LOGIKA PENGGABUNGAN JAM KE DESKRIPSI (Sama seperti Create) ===
    let finalDescription = undefined; // undefined agar tidak diupdate jika user tidak kirim deskripsi
    
    // Jika user mengirim deskripsi atau jam, kita rakit ulang stringnya
    if (data.deskripsi || (data.jamBuka && data.jamTutup)) {
        const descText = data.deskripsi || ""; 
        // Jika jam diisi, gabungkan. Jika tidak, pakai deskripsi saja.
        if (data.jamBuka && data.jamTutup) {
            finalDescription = `Buka: ${data.jamBuka} - ${data.jamTutup}. ${descText}`;
        } else {
            finalDescription = descText;
        }
    }
    // =================================================================

    // Mapping dari Frontend (formData) ke Database Columns
    const updateData = {
        title: data.namaProperti,
        location: data.alamatProperti,
        base_price: data.hargaSewa,
        price_unit: data.satuanSewa,
        description: finalDescription,      // Deskripsi pendek + Jam
        full_description: data.deskripsi,   // Deskripsi lengkap (teks asli)
        // image_url: handle nanti jika ada upload
    };

    // Hapus key yang undefined/null agar tidak menimpa data lama dengan kosong
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const success = await PlaceModel.update(id, updateData);
    
    if (!success) {
        // Cek apakah ID-nya ada?
        const check = await PlaceModel.findById(id);
        if (!check) return res.status(404).json({ success: false, message: "Tempat tidak ditemukan" });
        
        // Jika ID ada tapi success false, berarti tidak ada perubahan data (tetap sukses secara teknis)
        return res.json({ success: true, message: "Tidak ada perubahan data" });
    }

    res.json({ success: true, message: "Berhasil update tempat" });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 6. DELETE PLACE
exports.deletePlace = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Panggil method delete di Model
    const success = await PlaceModel.delete(id);
    
    if (!success) {
        return res.status(404).json({ success: false, message: "Gagal hapus. Tempat tidak ditemukan." });
    }
    
    res.json({ success: true, message: "Berhasil menghapus tempat pemancingan." });
    
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller lainnya (getFacilities) biarkan saja jika ada
exports.getAllFacilities = async (req, res) => {
    const db = require('../config/database');
    try {
        const [facilities] = await db.query("SELECT id_fasilitas AS id, nama_fasilitas AS name FROM fasilitas");
        res.status(200).json({ success: true, data: facilities });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal ambil fasilitas" });
    }
};