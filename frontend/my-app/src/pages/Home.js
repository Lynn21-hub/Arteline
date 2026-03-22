import React from 'react';
import heroImage from '../assets/homepage.jpg';
function Home() {
  return (
    <div>

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>
            Discover Art That Speaks to You
          </h1>
          <p style={styles.heroSubtitle}>
            Explore curated collections from emerging and established artists
          </p>
          <button style={styles.heroButton}>Explore Art</button>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={styles.categories}>
        {["Painting", "Photography", "Sculpture", "Drawing"].map((cat) => (
          <div key={cat} style={styles.categoryCard}>
            {cat}
          </div>
        ))}
      </div>

      {/* FEATURED ARTWORKS */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Artworks</h2>

        <div style={styles.grid}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} style={styles.card}>
              <div style={styles.image}></div>
              <h3 style={styles.artTitle}>Abstract Piece #{item}</h3>
              <p style={styles.artist}>by Artist Name</p>
              <p style={styles.price}>$250</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

const styles = {
  hero: {
    height: "70vh",
    backgroundImage:
      `url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  heroOverlay: {
    background: "rgba(0,0,0,0.5)",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    color: "white",
  },

  heroTitle: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  heroSubtitle: {
    fontSize: "16px",
    marginBottom: "20px",
  },

  heroButton: {
    padding: "12px 24px",
    backgroundColor: "#ff6b35",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },

  categories: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: "40px",
  },

  categoryCard: {
    padding: "20px 30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },

  section: {
    padding: "40px",
  },

  sectionTitle: {
    fontSize: "24px",
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },

  card: {
    border: "1px solid #eee",
    borderRadius: "10px",
    padding: "10px",
  },

  image: {
    height: "200px",
    background:
      "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
    backgroundSize: "cover",
    borderRadius: "8px",
  },

  artTitle: {
    marginTop: "10px",
    fontSize: "16px",
  },

  artist: {
    fontSize: "14px",
    color: "#777",
  },

  price: {
    fontWeight: "bold",
    marginTop: "5px",
  },
};

export default Home;