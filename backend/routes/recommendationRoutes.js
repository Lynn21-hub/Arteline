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
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  // Query 1: Get user interactions
  db.query(
    "SELECT * FROM user_interactions WHERE user_id = ?",
    [userId],
    (err, interactions) => {
      if (err) {
        // If table doesn't exist, return empty recommendations
        if (err.code === "ER_NO_SUCH_TABLE") {
          return res.json({ recommendations: [] });
        }
        console.error("Recommendation error:", err);
        return res.status(500).json({ error: "Recommendation error" });
      }

      // Query 2: Get all artworks
      db.query("SELECT * FROM artworks", (err2, artworks) => {
        if (err2) {
          console.error("Artworks query error:", err2);
          return res.status(500).json({ error: "Artworks query error" });
        }

        if (!artworks || artworks.length === 0) {
          return res.json({ recommendations: [] });
        }

        const hasHistory = interactions && interactions.length > 0;

        // ----------------------
        // map for speed
        // ----------------------
        const artworkMap = new Map(artworks.map(a => [a.id, a]));

        // ----------------------
        // build user vector
        // ----------------------
        let userVector = null;

        if (hasHistory) {
          // Get embedding length from first artwork (assuming all have same dimension)
          const firstEmbedding = artworks.find(a => a.embedding);
          if (!firstEmbedding) {
            // If no embeddings exist, return random recommendations
            const recs = artworks
              .sort(() => Math.random() - 0.5)
              .slice(0, 5);
            return res.json({ recommendations: recs });
          }

          const dim = JSON.parse(firstEmbedding.embedding).length;
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
          .filter(a => !interactions || !interactions.some(i => i.artwork_id === a.id))
          .map(a => {
            if (!a.embedding) return { ...a, score: 0 };

            try {
              const embedding = JSON.parse(a.embedding);

              const score = hasHistory
                ? cosineSimilarity(userVector, embedding)
                : 0;

              return { ...a, score };
            } catch (parseErr) {
              return { ...a, score: 0 };
            }
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
      });
    }
  );
});

module.exports = router;
