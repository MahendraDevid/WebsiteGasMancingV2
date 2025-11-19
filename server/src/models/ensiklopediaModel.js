// models/ensiklopediaModel.js

const db = require("../config/database");

class EnsiklopediaModel {
  // =======================================================
  // GET ALL ARTICLES
  // =======================================================
  static async getAll() {
    let query = `
        SELECT 
          id_artikel AS id,
          judul AS title,
          description AS description,
          image_url AS image,
          tgl_terbit
        FROM ensiklopedia
        ORDER BY tgl_terbit DESC
     `.trim();

    const [articles] = await db.query(query);

    if (articles.length === 0) return [];

    // Ambil media untuk setiap artikel
    for (let article of articles) {
      const mediaQuery = `
        SELECT 
          media_type AS type,
          media_url AS url,
          keterangan
        FROM ensiklopedia_media
        WHERE id_artikel = ?
        ORDER BY id_media ASC
      `.trim();

      const [mediaData] = await db.query(mediaQuery, [article.id]);

      article.description = article.description || "";
      article.details = article.description;
      article.media = mediaData;
    }

    return articles;
  }

  // =======================================================
  // GET ARTICLE BY ID
  // =======================================================
  static async findById(id) {
    const query = `
        SELECT 
          id_artikel AS id,
          judul AS title,
          description AS description,
          image_url AS image,  // <--- BARIS INI DIPERBAIKI
          tgl_terbit
        FROM ensiklopedia
        WHERE id_artikel = ?
     `.trim();

    const [articles] = await db.query(query, [id]);

    if (articles.length === 0) return null;

    const article = articles[0];

    // Ambil media artikel
    const mediaQuery = `
      SELECT
        media_type AS type,
        media_url AS url,
        keterangan
      FROM ensiklopedia_media
      WHERE id_artikel = ?
      ORDER BY id_media ASC
    `.trim();

    const [mediaData] = await db.query(mediaQuery, [id]);

    article.description = article.description || "";
    article.details = article.description;
    article.media = mediaData;

    return article;
  }
}

module.exports = EnsiklopediaModel;
