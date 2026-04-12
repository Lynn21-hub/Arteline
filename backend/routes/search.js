const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /search?q=keyword
router.get('/', (req, res) => {
  const q = req.query.q;
  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const sql = `
    SELECT *,
      CASE
        WHEN title LIKE ? THEN 4
        WHEN category LIKE ? THEN 3
        WHEN artist_name LIKE ? THEN 3
        WHEN description LIKE ? THEN 2
        WHEN format LIKE ? THEN 1
        ELSE 0
      END AS score
    FROM artworks
    WHERE title LIKE ?
       OR description LIKE ?
       OR category LIKE ?
       OR artist_name LIKE ?
       OR format LIKE ?
    ORDER BY score DESC, created_at DESC
  `;

  const param = `%${q}%`;

  db.all(sql, [
    param, param, param, param, param,
    param, param, param, param, param
  ], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Search failed' });
    }
    res.json(rows);
  });
});

module.exports = router;