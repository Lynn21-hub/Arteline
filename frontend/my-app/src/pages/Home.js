import React from "react";
import homepageImg from "../assets/homepage.jpg"; // your uploaded image

function Home() {
  return (
    <div style={styles.container}>

      {/* HERO */}
      <div style={{ ...styles.hero, backgroundImage: `url(${homepageImg})` }}>
        <div style={styles.overlay} />

        <div style={styles.heroContent}>
          <h1 style={styles.title}>Arteline</h1>
          <p style={styles.subtitle}>
            Find the art that speaks to your soul
          </p>

          <div style={styles.searchBox}>
            <input placeholder="Search art..." style={styles.input} />
            <button style={styles.searchBtn}>🔍</button>
          </div>
        </div>
      </div>

      {/* CATEGORY */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Category</h2>

        <div style={styles.grid}>
          {["Painting", "Portrait", "Sculpture", "Calligraphy", "Drawing"].map((cat) => (
            <div key={cat} style={styles.card}>
              <p>{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BEST OF 2025 */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Best of 2025</h2>

        <div style={styles.grid}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} style={styles.artCard}>
              <p>Artwork #{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={styles.stats}>
        <div>
          <h2>5000+</h2>
          <p>Arts & Photos</p>
        </div>
        <div>
          <h2>100K+</h2>
          <p>Happy Clients</p>
        </div>
      </section>

      {/* ARTISTS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Artists</h2>

        <div style={styles.grid}>
          {["Artist 1", "Artist 2", "Artist 3", "Artist 4"].map((artist) => (
            <div key={artist} style={styles.artistCard}>
              <p>{artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2025 Artéline</p>
      </footer>

    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
  },

  hero: {
    height: "80vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
  },

  heroContent: {
    position: "relative",
    color: "white",
    textAlign: "center",
  },

  title: {
    fontSize: "60px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "18px",
    marginBottom: "20px",
  },

  searchBox: {
    display: "flex",
    justifyContent: "center",
  },

  input: {
    padding: "12px",
    width: "250px",
    borderRadius: "6px 0 0 6px",
    border: "none",
  },

  searchBtn: {
    padding: "12px",
    background: "#8a2be2",
    color: "white",
    border: "none",
    borderRadius: "0 6px 6px 0",
  },

  section: {
    padding: "60px 20px",
  },

  sectionTitle: {
    marginBottom: "20px",
    fontSize: "28px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#eee",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
  },

  artCard: {
    background: "#ddd",
    height: "200px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  artistCard: {
    background: "#ccc",
    height: "150px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  stats: {
    display: "flex",
    justifyContent: "space-around",
    padding: "40px",
    background: "#111",
    color: "white",
    textAlign: "center",
  },

  footer: {
    padding: "20px",
    textAlign: "center",
    background: "#000",
    color: "white",
  },
};

export default Home;