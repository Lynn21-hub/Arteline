const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /search?q=keyword
router.get('/', (req, res) => {
  const q = req.query.q;
  if (!q || !q.trim()) return res.status(400).json({ error: 'Query is required' });

  const sql = `SELECT * FROM artwork
               WHERE title LIKE ? OR description LIKE ? OR tags LIKE ?`;
  const param = `%${q}%`;
  db.all(sql, [param, param, param], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Search failed' });
    res.json(rows);
  });
});

module.exports = router;