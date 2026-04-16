/* const express = require("express");
const router = express.Router();
const db = require("../db"); // your mysql connection

// cosine similarity
function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// weights
const weights = {
  wishlist: 3,
  cart: 5,
  purchase: 8,
};
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. get user interactions
    const [interactions] = await db.query(
      "SELECT * FROM user_interactions WHERE user_id = ?",
      [userId]
    );

    // 2. get all artworks with embeddings
    const [artworks] = await db.query(
      "SELECT * FROM artworks"
    );

    let userVector = null;
    let hasHistory = interactions.length > 0;

    // 3. build user vector if history exists
    if (hasHistory) {
      userVector = new Array(JSON.parse(artworks[0].embedding).length).fill(0);

      for (let inter of interactions) {
        const artwork = artworks.find(a => a.id === inter.artwork_id);
        if (!artwork) continue;

        const embedding = JSON.parse(artwork.embedding);
        const weight = weights[inter.type];

        userVector = userVector.map((v, i) => v + embedding[i] * weight);
      }
    }

    // 4. score artworks
    const recommendations = artworks
      .filter(a => {
        // exclude already interacted items
        return !interactions.some(i => i.artwork_id === a.id);
      })
      .map(a => {
        const embedding = JSON.parse(a.embedding);

        let score;

        if (hasHistory) {
          score = cosineSimilarity(userVector, embedding);
        } else {
          score = 0; // fallback later
        }

        return { ...a, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // 5. fallback if no history
    if (!hasHistory) {
      return res.json({
        message: "No history - fallback mode",
        recommendations: artworks.slice(0, 5)
      });
    }

    res.json({ recommendations });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recommendation error" });
  }
});

module.exports = router; */