const db = require("../config/db");
const { getSearchIntent } = require("../services/bedrockService");

async function searchArtworks(req, res) {
  try {
    console.log("🔥 SEARCH HIT:", req.query);

    const query = req.query.q;
    console.log("🔥 SEARCH QUERY:", query || req.body.query);

    if (!query) {
      return res.json([]);
    }

    // 1. Get AI intent
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

    // 2. Build search terms (FIXED ORDER)
    const keywords = intent.keywords?.length
      ? intent.keywords
      : [query];

    const category = intent.category || "";

    console.log("🧠 KEYWORDS:", keywords);
    console.log("🏷️ CATEGORY:", category);

    const likeQueries = keywords.map(k => `%${k.toLowerCase()}%`);

    // 3. Build SQL
    let sql = `
      SELECT * FROM artworks
      WHERE
    `;

    const conditions = keywords.map(() => `
      (
        LOWER(title) LIKE ?
        OR LOWER(description) LIKE ?
        OR LOWER(category) LIKE ?
        OR LOWER(artist_name) LIKE ?
      )
    `);

    sql += conditions.join(" OR ");

    const params = [];

    keywords.forEach(k => {
      const like = `%${k.toLowerCase()}%`;
      params.push(like, like, like, like);
    });

    // 4. Execute query
    db.query(sql, params, (err, rows) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      console.log("ROWS:", rows.length);

      // 5. Optional ranking boost
      if (category) {
        rows.sort((a, b) => {
          const aMatch = (a.category || "")
            .toLowerCase()
            .includes(category.toLowerCase());

          const bMatch = (b.category || "")
            .toLowerCase()
            .includes(category.toLowerCase());

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