const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ----------------------
// cosine similarity
// ----------------------
function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  if (magA === 0 || magB === 0) return 0;

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// ----------------------
// weights
// ----------------------
const weights = {
  wishlist: 3,
  cart: 5,
  purchase: 8,
};

// ----------------------
// route
// ----------------------
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [interactions] = await db.query(
      "SELECT * FROM user_interactions WHERE user_id = ?",
      [userId]
    );

    const [artworks] = await db.query("SELECT * FROM artworks");

    if (!artworks.length) {
      return res.json({ recommendations: [] });
    }

    const hasHistory = interactions.length > 0;

    // ----------------------
    // map for speed
    // ----------------------
    const artworkMap = new Map(artworks.map(a => [a.id, a]));

    // ----------------------
    // build user vector
    // ----------------------
    let userVector = null;

    if (hasHistory) {
      const dim = JSON.parse(artworks[0].embedding).length;
      userVector = new Array(dim).fill(0);

      for (const inter of interactions) {
        const artwork = artworkMap.get(inter.artwork_id);
        if (!artwork || !artwork.embedding) continue;

        const embedding = JSON.parse(artwork.embedding);
        const weight = weights[inter.type] || 1;

        for (let i = 0; i < dim; i++) {
          userVector[i] += embedding[i] * weight;
        }
      }
    }

    // ----------------------
    // scoring
    // ----------------------
    let recommendations = artworks
      .filter(a => !interactions.some(i => i.artwork_id === a.id))
      .map(a => {
        if (!a.embedding) return { ...a, score: 0 };

        const embedding = JSON.parse(a.embedding);

        const score = hasHistory
          ? cosineSimilarity(userVector, embedding)
          : 0;

        return { ...a, score };
      });

    // ----------------------
    // fallback for cold start
    // ----------------------
    if (!hasHistory) {
      recommendations = recommendations.sort(() => Math.random() - 0.5);
    }

    // ----------------------
    // final ranking
    // ----------------------
    recommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json({ recommendations });

  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: "Recommendation error" });
  }
});

module.exports = router;
