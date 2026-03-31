import React from "react";
import homepageImg from "../assets/homepage.jpg";

function Home() {
  const categories = ["Painting", "Portrait", "Sculpture", "Calligraphy", "Drawing"];
  const artworks = [1, 2, 3, 4];
  const artists = ["Artist 1", "Artist 2", "Artist 3", "Artist 4"];

  return (
    <div style={styles.container}>

      {/* HERO */}
      <div style={{ ...styles.hero, backgroundImage: `url(${homepageImg})` }}>
        <div style={styles.overlay} />

        <div style={styles.heroContent}>

          <p style={styles.badge}>Discover timeless creativity</p>
          <h1 style={styles.title}>Artéline</h1>
          <p style={styles.subtitle}>
            Find the art that speaks to your soul and explore unique creations
            from artists around the world.
          </p>

          <div style={styles.searchBox}>
            <input placeholder="Search art..." style={styles.input} />

            <button style={styles.searchBtn}>Search</button>
          </div>

          <div style={styles.heroButtons}>
            <button style={styles.primaryBtn}>Explore Collection</button>
            <button style={styles.secondaryBtn}>Meet Artists</button>

          </div>
        </div>
      </div>

      {/* CATEGORY */}
      <section style={styles.section}>

        <div style={styles.sectionHeader}>
          <p style={styles.sectionLabel}>Browse</p>
          <h2 style={styles.sectionTitle}>Categories</h2>
          <p style={styles.sectionText}>
            Explore different styles and mediums curated for every art lover.
          </p>
        </div>

        <div style={styles.grid}>
          {categories.map((cat) => (
            <div key={cat} style={styles.card}>
              <div style={styles.cardIcon}>✦</div>
              <p style={styles.cardTitle}>{cat}</p>

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


      {/* BEST OF 2025 */}
      <section style={{ ...styles.section, ...styles.altSection }}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionLabel}>Featured</p>
          <h2 style={styles.sectionTitle}>Best of 2025</h2>
          <p style={styles.sectionText}>
            A handpicked selection of standout works for this year.
          </p>
        </div>

        <div style={styles.grid}>
          {artworks.map((item) => (
            <div key={item} style={styles.artCard}>
              <div style={styles.artImagePlaceholder}>
                <span style={styles.artTag}>Featured</span>
              </div>
              <div style={styles.artInfo}>
                <h3 style={styles.artTitle}>Artwork #{item}</h3>
                <p style={styles.artArtist}>by Emerging Artist</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={styles.statsWrapper}>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <h2 style={styles.statNumber}>5000+</h2>
            <p style={styles.statText}>Arts & Photos</p>
          </div>
          <div style={styles.statItem}>
            <h2 style={styles.statNumber}>100K+</h2>
            <p style={styles.statText}>Happy Clients</p>
          </div>
          <div style={styles.statItem}>
            <h2 style={styles.statNumber}>1200+</h2>
            <p style={styles.statText}>Verified Artists</p>
          </div>
        </div>
      </section>

      {/* ARTISTS */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionLabel}>Community</p>
          <h2 style={styles.sectionTitle}>Featured Artists</h2>
          <p style={styles.sectionText}>
            Meet talented creators shaping the future of visual expression.
          </p>
        </div>

        <div style={styles.grid}>
          {artists.map((artist, index) => (
            <div key={artist} style={styles.artistCard}>
              <div style={styles.artistAvatar}>{index + 1}</div>
              <p style={styles.artistName}>{artist}</p>
              <p style={styles.artistRole}>Contemporary Artist</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Start Your Art Journey Today</h2>
        <p style={styles.ctaText}>
          Discover inspiring artworks, support artists, and bring creativity into your world.
        </p>
        <button style={styles.primaryBtn}>Get Started</button>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <h3 style={styles.footerLogo}>Artéline</h3>
        <p style={styles.footerText}>
          A curated space for art, beauty, and inspiration.
        </p>
        <p style={styles.footerCopy}>© 2025 Artéline. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {

    fontFamily: "'Poppins', Arial, sans-serif",
    backgroundColor: "#f8f6f2",
    color: "#1f1f1f",
  },

  hero: {
    height: "90vh",
    minHeight: "650px",

    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 20px",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55))",
  },

  heroContent: {
    position: "relative",
    color: "white",
    textAlign: "center",
    maxWidth: "750px",
    zIndex: 2,
  },

  badge: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(8px)",
    marginBottom: "18px",
    fontSize: "14px",
    letterSpacing: "0.5px",
  },

  title: {
    fontSize: "clamp(48px, 8vw, 86px)",
    marginBottom: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
  },

  subtitle: {
    fontSize: "18px",
    lineHeight: "1.7",
    marginBottom: "28px",
    color: "rgba(255,255,255,0.92)",
    maxWidth: "620px",
    marginInline: "auto",
  },

  searchBox: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "520px",
    margin: "0 auto 22px",
    background: "white",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 10px 35px rgba(0,0,0,0.18)",
  },

  input: {
    flex: 1,
    padding: "16px 18px",
    border: "none",
    outline: "none",
    fontSize: "15px",
  },

  searchBtn: {
    padding: "16px 24px",
    background: "#8b5e3c",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  heroButtons: {
    display: "flex",
    gap: "14px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  primaryBtn: {
    padding: "14px 26px",
    borderRadius: "999px",
    border: "none",
    background: "#1f1f1f",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  },

  secondaryBtn: {
    padding: "14px 26px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    backdropFilter: "blur(8px)",
  },

  section: {
    padding: "90px 8%",
  },

  altSection: {
    background: "#f1ece6",
  },

  sectionHeader: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto 40px",
  },

  sectionLabel: {
    color: "#8b5e3c",
    fontWeight: "600",
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontSize: "13px",
    marginBottom: "10px",
  },

  sectionTitle: {
    marginBottom: "12px",
    fontSize: "38px",
    fontWeight: "700",
  },

  sectionText: {
    color: "#666",
    fontSize: "16px",
    lineHeight: "1.7",

  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "white",
    padding: "32px 24px",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
    transition: "transform 0.2s ease",
  },

  cardIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    margin: "0 auto 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3ede6",
    color: "#8b5e3c",
    fontSize: "22px",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  },

  artCard: {
    background: "white",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },

  artImagePlaceholder: {
    height: "240px",
    background: "linear-gradient(135deg, #d8c3a5, #8b5e3c)",
    position: "relative",
  },

  artTag: {
    position: "absolute",
    top: "16px",
    left: "16px",
    background: "rgba(255,255,255,0.9)",
    color: "#222",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  artInfo: {
    padding: "20px",
  },

  artTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
  },

  artArtist: {
    margin: 0,
    color: "#777",
    fontSize: "14px",
  },

  statsWrapper: {
    padding: "20px 8% 0",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    background: "#1c1c1c",
    color: "white",
    borderRadius: "28px",
    padding: "40px 30px",
    boxShadow: "0 16px 35px rgba(0,0,0,0.15)",
  },

  statItem: {
    textAlign: "center",
  },

  statNumber: {
    fontSize: "36px",
    marginBottom: "8px",
  },

  statText: {
    color: "rgba(255,255,255,0.75)",
    margin: 0,
  },

  artistCard: {
    background: "white",
    minHeight: "220px",
    borderRadius: "22px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
    padding: "24px",
    textAlign: "center",
  },

  artistAvatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "#e9dfd2",
    color: "#8b5e3c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "16px",
  },

  artistName: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 6px",
  },

  artistRole: {
    margin: 0,
    color: "#777",
  },

  ctaSection: {
    margin: "90px 8%",
    background: "linear-gradient(135deg, #2c2c2c, #8b5e3c)",
    color: "white",
    borderRadius: "30px",
    textAlign: "center",
    padding: "70px 20px",
  },

  ctaTitle: {
    fontSize: "40px",
    marginBottom: "14px",
  },

  ctaText: {
    maxWidth: "650px",
    margin: "0 auto 24px",
    lineHeight: "1.7",
    color: "rgba(255,255,255,0.9)",
  },

  footer: {
    padding: "40px 20px",
    textAlign: "center",
    background: "#111",
    color: "white",
  },

  footerLogo: {
    fontSize: "26px",
    marginBottom: "10px",
  },

  footerText: {
    color: "rgba(255,255,255,0.75)",
    marginBottom: "10px",
  },

  footerCopy: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "14px",

  },
};

export default Home;