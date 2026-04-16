const db = require("../config/db");
const { getSearchIntent } = require("../services/bedrockService"); // adjust path if needed

async function searchArtworks(req, res) {
  try {
    console.log("🔥 SEARCH HIT:", req.query);

    const query = req.query.q;

    if (!query) {
      return res.json([]);
    }

    // 1. Get AI understanding of query
    let intent;

    try {
      intent = await getSearchIntent(query);
    } catch (err) {
      console.log("⚠️ Bedrock failed, falling back to basic search");
      intent = {
        keywords: [query],
        category: ""
      };
    }

    console.log("🧠 INTENT:", intent);

    // 2. Build search terms
    const keywords = intent.keywords?.length
      ? intent.keywords
      : [query];

    const category = intent.category || "";

    const likeQueries = keywords.map(k => `%${k.toLowerCase()}%`);

    // 3. Build dynamic SQL (keywords OR category boost)
    let sql = `
      SELECT * FROM artworks
      WHERE
    `;

    const conditions = [];

    keywords.forEach(() => {
      conditions.push(`
        LOWER(title) LIKE ?
        OR LOWER(description) LIKE ?
        OR LOWER(category) LIKE ?
        OR LOWER(artist_name) LIKE ?
      `);
    });

    sql += conditions.join(" OR ");

    const params = [];

    keywords.forEach(k => {
      const like = `%${k.toLowerCase()}%`;
      params.push(like, like, like, like);
    });

    db.query(sql, params, (err, rows) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      console.log("ROWS:", rows.length);

      // 4. Optional: boost category matches (simple ranking tweak)
      if (category) {
        rows.sort((a, b) => {
          const aMatch = (a.category || "").toLowerCase().includes(category.toLowerCase());
          const bMatch = (b.category || "").toLowerCase().includes(category.toLowerCase());

          return bMatch - aMatch;
        });
      }

      return res.json(rows);
    });

  } catch (e) {
    console.log("SERVER CRASH:", e);
    res.status(500).json({ error: e.message });
  }
}

module.exports = { searchArtworks };