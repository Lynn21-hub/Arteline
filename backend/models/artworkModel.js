const db = require("../config/db");

const Artwork = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO artworks 
      (title, description, category, format, price, inventory, artist_name, image_url, s3_key)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.title,
      data.description,
      data.category,
      data.format,
      data.price,
      data.inventory,
      data.artist_name,
      data.image_url,
      data.s3_key,
    ];
    db.query(sql, values, callback);
  },

  getAll: (callback) => {
    db.query("SELECT * FROM artworks ORDER BY created_at DESC", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM artworks WHERE id = ?", [id], callback);
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE artworks 
      SET title=?, description=?, category=?, format=?, price=?, inventory=?, artist_name=?
      WHERE id=?
    `;
    const values = [
      data.title,
      data.description,
      data.category,
      data.format,
      data.price,
      data.inventory,
      data.artist_name,
      id,
    ];
    db.query(sql, values, callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM artworks WHERE id = ?", [id], callback);
  },
};

module.exports = Artwork;