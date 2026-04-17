import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllArtworks } from "../api/artworkAPI";
import { getFeaturedArtists } from "../api/artistAPI";

/* ─── Category images (Unsplash) ─── */
const CATEGORY_IMAGES = {
  Painting: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=500&q=75",
  Portrait: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=500&q=75",
  Sculpture: "https://images.unsplash.com/photo-1620503374956-c942862f0372?w=500&q=75",
  Calligraphy: "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=500&q=75",
  Drawing: "https://images.unsplash.com/photo-1612957590778-39f7f7a45577?w=500&q=75",
};

/* ─── Inject Google Fonts once ─── */
if (!document.getElementById("arteline-fonts")) {
  const link = document.createElement("link");
  link.id = "arteline-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
}

/* ─── Global CSS injected once ─── */
if (!document.getElementById("arteline-global")) {
  const style = document.createElement("style");
  style.id = "arteline-global";
  style.textContent = `
    .al-cat-card:hover img { transform:scale(1.08); }
    .al-art-card:hover .al-art-img { transform:scale(1.04); }
    .al-art-card:hover .al-quick-buy { transform:translateY(0) !important; }
    .al-art-card:hover .al-wish { opacity:1 !important; }
    .al-how-card:hover { background:rgba(201,168,76,0.05);border-color:rgba(201,168,76,0.25) !important; }
    .al-how-card:hover .al-how-num { color:rgba(201,168,76,0.35) !important; }
    .al-test-card:hover { border-color:#c9a84c !important;box-shadow:0 8px 32px rgba(201,168,76,0.1) !important; }
    .al-artist-card:hover { border-color:#c9a84c !important;transform:translateY(-4px); }
    .al-sell-btn:hover { background:#b8922e !important; }
    .al-outline-btn:hover { background:#0d0c0a !important;color:#fff !important; }
    .al-cat-card:hover .al-cat-overlay { background:linear-gradient(to top,rgba(13,12,10,0.92) 0%,rgba(13,12,10,0.25) 60%,transparent 100%) !important; }
    @keyframes al-fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes al-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
    .al-reveal { opacity:0;transform:translateY(28px);transition:opacity 0.7s ease,transform 0.7s ease; }
    .al-reveal.visible { opacity:1;transform:translateY(0); }
    .al-delay-1 { transition-delay:0.1s; }
    .al-delay-2 { transition-delay:0.2s; }
    .al-delay-3 { transition-delay:0.3s; }
    .al-spin { animation: al-spin 1s linear infinite; }
    @keyframes al-spin { to{transform:rotate(360deg)} }
  `;
  document.head.appendChild(style);
}

export default function Home() {
  const navigate = useNavigate();

  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );

    document.querySelectorAll(".al-reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  useEffect(() => {
    (async () => {
      try {
        const [artworksData, artistsData] = await Promise.all([
          getAllArtworks(),
          getFeaturedArtists(),
        ]);
        setArtworks(artworksData || []);
        setArtists(artistsData || []);
      } catch (err) {
        console.error("Error fetching artworks:", err);
        setArtworks([]);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const base = ["Painting", "Portrait", "Sculpture", "Calligraphy", "Drawing"];
    return base.map((name) => ({
      name,
      count: artworks.filter((a) => a.category === name).length,
    }));
  }, [artworks]);

  const featuredArtworks = useMemo(() => artworks.slice(0, 4), [artworks]);

  const featuredArtists = useMemo(() => artists.slice(0, 4), [artists]);

  const totalArtists = useMemo(
    () => new Set(artworks.map((a) => a.artist_name).filter(Boolean)).size,
    [artworks]
  );

  const availableCount = useMemo(
    () => artworks.filter((a) => Number(a.inventory) > 0).length,
    [artworks]
  );

  const handleSearch = () => {
    const q = search.trim();
    navigate(q ? `/artworks?search=${encodeURIComponent(q)}` : "/artworks");
  };

  return (
    <div style={s.container}>
      {/* ── HERO ── */}
      <section
        style={{
          ...s.hero,
          backgroundImage:
            "url(https://img.freepik.com/free-vector/pastel-coloured-hand-painted-watercolour-background_1048-19244.jpg?semt=ais_hybrid&w=740&q=80)",
        }}
      >
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <div style={s.heroBadge}>
            <span style={s.heroBadgeDot} />
            <span style={s.heroBadgeText}>The Art Marketplace</span>
          </div>

          <h1 style={s.heroTitle}>
            Where <em style={{ fontStyle: "italic", color: "#c9a84c" }}>Art</em>
            <br />
            Finds Its
            <br />
            True Home
          </h1>

          <p style={s.heroSub}>
            A marketplace built for creators &amp; collectors. No galleries,
            <br />
            no gatekeepers — just art and the people who love it.
          </p>

          <div style={s.searchBox}>
            <span style={s.searchIcon}>⌕</span>
            <input
              style={s.searchInput}
              placeholder="Search by artist, style, medium…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button style={s.searchBtn} onClick={handleSearch}>
              Search
            </button>
          </div>

          <div style={s.heroButtons}>
            <button style={s.btnGold} onClick={() => navigate("/artworks")}>
              Explore Collection
            </button>
            <button style={s.btnGhost} onClick={() => navigate("/artworks")}>
              Meet Artists
            </button>
          </div>
        </div>

        <div style={s.heroScroll}>
          <span style={s.heroScrollText}>Scroll</span>
          <div style={s.heroScrollLine} />
        </div>
      </section>

      {/* ── INTRO STRIP ── */}
      <section style={s.introStrip} className="al-reveal">
        <div style={s.introText}>
          <span style={s.introLabel}>Why Artéline</span>
          <h2 style={s.introTitle}>
            Art has always deserved a{" "}
            <em style={{ fontStyle: "italic", color: "#c9a84c" }}>better</em> marketplace.
          </h2>
          <p style={s.introBody}>
            We connect independent artists directly with collectors worldwide — no middlemen, no inflated commissions.
            Artists keep <strong style={{ color: "#0d0c0a" }}>90% of every sale</strong> and set their own prices.
            Buyers get one-of-a-kind originals, signed prints, and commissions with a certificate of authenticity on every piece.
          </p>
        </div>

        <div style={s.introStats}>
          {[
            [artworks.length ? `${artworks.length}+` : "5K+", "Original Artworks"],
            [totalArtists ? `${totalArtists}+` : "1.8K+", "Verified Artists"],
            ["90%", "Revenue to Artists"],
          ].map(([num, label]) => (
            <div key={label} style={s.istat}>
              <div style={s.istatNum}>{num}</div>
              <div style={s.istatLabel}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={s.how}>
        <div style={s.howHeader} className="al-reveal">
          <span style={s.secLabelLight}>For Artists &amp; Buyers</span>
          <h2 style={s.howTitle}>
            A Marketplace Built on <em style={{ fontStyle: "italic", color: "#c9a84c" }}>Respect</em>
          </h2>
        </div>

        <div style={s.howGrid}>
          {[
            {
              n: "01",
              icon: "🎨",
              title: "Artists Post & Price Freely",
              desc: "Upload in minutes, set your own price, tell your story. No approval gatekeepers — your art, your rules.",
              role: "For Artists",
              delay: "",
            },
            {
              n: "02",
              icon: "🔍",
              title: "Buyers Discover Authentic Work",
              desc: "Every artwork ships with a certificate of authenticity. Buy with confidence — we guarantee originality or your money back.",
              role: "For Buyers",
              delay: "al-delay-1",
            },
            {
              n: "03",
              icon: "💸",
              title: "Artists Earn 90% of Every Sale",
              desc: "We charge just 10% — the lowest in the industry. Instant payouts, no monthly fees, no subscription walls.",
              role: "For Artists",
              delay: "al-delay-2",
            },
          ].map((c) => (
            <div key={c.n} className={`al-how-card al-reveal ${c.delay}`} style={s.howCard}>
              <div className="al-how-num" style={s.howNum}>{c.n}</div>
              <div style={s.howIcon}>{c.icon}</div>
              <h3 style={s.howCardTitle}>{c.title}</h3>
              <p style={s.howCardDesc}>{c.desc}</p>
              <span style={s.howRole}>{c.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={s.section}>
        <div style={s.secHeaderRow} className="al-reveal">
          <div>
            <span style={s.secLabel}>Browse by</span>
            <h2 style={s.secTitle}>
              Shop by <em style={{ fontStyle: "italic", color: "#c9a84c" }}>Category</em>
            </h2>
          </div>
          <span style={s.linkArrow} onClick={() => navigate("/artworks")}>
            View all →
          </span>
        </div>

        <div style={s.catGrid} className="al-reveal al-delay-1">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="al-cat-card"
              style={s.catCard}
              onClick={() => navigate(`/artworks?category=${encodeURIComponent(cat.name)}`)}
            >
              <img src={CATEGORY_IMAGES[cat.name]} alt={cat.name} style={s.catImg} />
              <div className="al-cat-overlay" style={s.catOverlay}>
                <p style={s.catName}>{cat.name}</p>
                <p style={s.catCount}>
                  {cat.count} artwork{cat.count !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED ARTWORKS ── */}
      <section style={{ ...s.section, background: "#f1ece6" }}>
        <div style={s.secHeaderRow} className="al-reveal">
          <div>
            <span style={s.secLabel}>Handpicked</span>
            <h2 style={s.secTitle}>
              Best of <em style={{ fontStyle: "italic", color: "#c9a84c" }}>2025</em>
            </h2>
          </div>
          <span style={s.linkArrow} onClick={() => navigate("/artworks")}>
            Browse all →
          </span>
        </div>

        {loading ? (
          <div style={s.loadingBox}>
            <div style={{ fontSize: 28, marginBottom: 12 }} className="al-spin">◌</div>
            Loading artworks…
          </div>
        ) : featuredArtworks.length === 0 ? (
          <div style={s.loadingBox}>No artworks available yet.</div>
        ) : (
          <div style={s.artGrid}>
            {featuredArtworks.map((art, i) => (
              <div
                key={art.id}
                className={`al-art-card al-reveal al-delay-${i}`}
                style={s.artCard}
                onClick={() => navigate(`/artworks/${art.id}`)}
              >
                <div style={s.artImgWrap}>
                  <img
                    className="al-art-img"
                    src={art.image_url}
                    alt={art.title}
                    style={s.artImg}
                  />
                  <span style={s.artTagBadge}>{art.category || "Featured"}</span>
                  <button
                    className="al-wish"
                    style={s.artWish}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ♡
                  </button>
                  <div className="al-quick-buy" style={s.quickBuy}>
                    View Artwork →
                  </div>
                </div>

                <div style={s.artInfo}>
                  <h3 style={s.artTitle}>{art.title}</h3>
                  <p style={s.artArtist}>by {art.artist_name || "Unknown Artist"}</p>
                  <div style={s.artBottom}>
                    <span style={s.artPrice}>${Number(art.price).toLocaleString()}</span>
                    {art.category && <span style={s.artMedium}>{art.category}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── STATS BAR ── */}
      <section style={s.statsBar} className="al-reveal">
        {[
          [artworks.length ? `${artworks.length}+` : "—", "Artworks"],
          [totalArtists ? `${totalArtists}+` : "—", "Artists"],
          [availableCount ? `${availableCount}+` : "—", "Available Pieces"],
          ["90%", "Revenue to Artists"],
        ].map(([num, label], i) => (
          <div
            key={label}
            style={{
              ...s.statItem,
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
          >
            <div style={s.statNum}>{num}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURED ARTISTS ── */}
      <section style={s.section}>
        <div style={s.secHeaderRow} className="al-reveal">
          <div>
            <span style={s.secLabel}>Community</span>
            <h2 style={s.secTitle}>
              Featured <em style={{ fontStyle: "italic", color: "#c9a84c" }}>Artists</em>
            </h2>
          </div>
          <span style={s.linkArrow} onClick={() => navigate("/artworks")}>
            Meet all →
          </span>
        </div>

        {featuredArtists.length === 0 ? (
          <div style={s.loadingBox}>No artists available yet.</div>
        ) : (
          <div style={s.artistGrid}>
            {featuredArtists.map((artist, idx) => (
              <div
                key={artist.creatorSub || artist.name}
                className={`al-artist-card al-reveal al-delay-${idx}`}
                style={s.artistCard}
                onClick={() => navigate(`/artworks?search=${encodeURIComponent(artist.displayName || artist.name)}`)}
              >
                {artist.avatarUrl ? (
                  <img src={artist.avatarUrl} alt={artist.displayName || artist.name} style={s.artistAvatarImg} />
                ) : (
                  <div style={s.artistAvatar}>
                    {(artist.displayName || artist.name || "A").charAt(0).toUpperCase()}
                  </div>
                )}
                <p style={s.artistName}>{artist.displayName || artist.name}</p>
                <p style={s.artistRole}>{artist.location || "Featured Artist"}</p>
                <p style={s.artistCount}>{artist.artworksCount || artist.count || 0} work{(artist.artworksCount || artist.count || 0) !== 1 ? "s" : ""}</p>
                {artist.bio && <p style={s.artistBio}>{artist.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── WHY US ── */}
      <div style={s.whyStrip} className="al-reveal">
        {[
          { icon: "🔒", title: "Secure Payments", desc: "Escrow-protected. Funds released only after delivery." },
          { icon: "📜", title: "Certificate of Authenticity", desc: "Every original ships with a signed, verified certificate." },
          { icon: "🚚", title: "Insured Global Shipping", desc: "Professionally packed and fully insured from studio to door." },
          { icon: "↩️", title: "14-Day Returns", desc: "Not what you expected? Free returns, no questions asked." },
        ].map((w, i) => (
          <div
            key={w.title}
            style={{
              ...s.whyItem,
              borderRight: i < 3 ? "1px solid rgba(13,12,10,0.08)" : "none",
            }}
          >
            <span style={s.whyIcon}>{w.icon}</span>
            <div>
              <p style={s.whyTitle}>{w.title}</p>
              <p style={s.whyDesc}>{w.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── SELL CTA ── */}
      <div style={s.sellCta} className="al-reveal">
        <img
          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1400&q=80"
          alt="Artist at work"
          style={s.sellCtaImg}
        />
        <div style={s.sellCtaOverlay}>
          <div style={s.sellCtaContent}>
            <span style={s.sellCtaTag}>For Artists</span>
            <h2 style={s.sellCtaTitle}>
              Your Studio.
              <br />
              Your <em style={{ fontStyle: "italic", color: "#c9a84c" }}>Price.</em>
              <br />
              Your Income.
            </h2>
            <p style={s.sellCtaBody}>
              Set up your Artéline shop in under 10 minutes. We handle payments, shipping logistics,
              and buyer trust — so you can focus on making great art.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="al-sell-btn" style={s.btnGoldLg} onClick={() => navigate("/artist/artworks/new")}>
                Start Selling Free
              </button>
              <button className="al-outline-btn" style={s.btnWhiteOutline} onClick={() => navigate("/artworks")}>
                Browse the Market
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA SECTION ── */}
      <section style={s.ctaSection} className="al-reveal">
        <span style={s.ctaLabel}>Ready to Begin?</span>
        <h2 style={s.ctaTitle}>
          Start Your Art Journey <em style={{ fontStyle: "italic" }}>Today</em>
        </h2>
        <p style={s.ctaText}>
          Discover inspiring artworks, support independent artists, and bring creativity into your world.
        </p>
        <button style={s.ctaBtn} onClick={() => navigate("/artworks")}>
          Explore the Collection
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerTop}>
          <div>
            <p style={s.footerLogo}>
              Arté<span style={{ color: "#c9a84c", fontStyle: "italic" }}>line</span>
            </p>
            <p style={s.footerTagline}>
              A curated marketplace where creators sell directly and buyers discover work that matters.
            </p>
          </div>

          {[
            [
              "Discover",
              [
                ["Paintings", "/artworks?category=Painting"],
                ["Sculptures", "/artworks?category=Sculpture"],
                ["Portraits", "/artworks?category=Portrait"],
                ["Drawing", "/artworks?category=Drawing"],
                ["New Arrivals", "/artworks"],
              ],
            ],
            [
              "Sell",
              [
                ["Start Selling", "/artist/artworks/new"],
                ["My Inventory", "/artist/inventory"],
                ["Artist Community", "/artworks"],
              ],
            ],
            [
              "Company",
              [
                ["About Us", "/"],
                ["Contact", "/profile"],
              ],
            ],
          ].map(([col, links]) => (
            <div key={col}>
              <p style={s.footerColTitle}>{col}</p>
              {links.map(([label, path]) => (
                <span key={label} style={s.footerLink} onClick={() => navigate(path)}>
                  {label}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div style={s.footerBottom}>
          <span style={s.footerCopy}>© 2025 Artéline. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <span key={t} style={s.footerLegal}>{t}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

const C = {
  parchment: "#f7f3ed",
  ink: "#0d0c0a",
  gold: "#c9a84c",
  muted: "#7a756e",
  white: "#ffffff",
  border: "rgba(13,12,10,0.09)",
};

const s = {
  container: { fontFamily: "'Outfit', 'Poppins', Arial, sans-serif", background: C.parchment, color: C.ink, overflowX: "hidden" },

  hero: { height: "100vh", minHeight: 650, backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", alignItems: "flex-end", padding: "0 56px 88px", overflow: "hidden" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,12,10,0.88) 0%, rgba(13,12,10,0.25) 55%, transparent 100%)" },
  heroContent: { position: "relative", zIndex: 2, maxWidth: 680, animation: "al-fadeUp 0.9s ease both" },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 },
  heroBadgeDot: { width: 8, height: 8, background: C.gold, borderRadius: "50%", animation: "al-pulse 2s infinite" },
  heroBadgeText: { fontSize: 12, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", fontWeight: 500 },
  heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(44px,7vw,80px)", fontWeight: 700, lineHeight: 1.03, color: C.white, letterSpacing: -1, marginBottom: 20 },
  heroSub: { fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.72)", marginBottom: 32, fontWeight: 300 },
  searchBox: { display: "flex", alignItems: "center", background: C.white, borderRadius: 3, overflow: "hidden", maxWidth: 520, marginBottom: 24, boxShadow: "0 10px 40px rgba(0,0,0,0.22)" },
  searchIcon: { fontSize: 20, color: C.muted, padding: "0 14px", flexShrink: 0 },
  searchInput: { flex: 1, border: "none", outline: "none", fontFamily: "'Outfit', sans-serif", fontSize: 15, color: C.ink, padding: "16px 0", background: "transparent" },
  searchBtn: { padding: "16px 28px", background: C.ink, color: C.white, border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.4px", flexShrink: 0, transition: "background 0.2s" },
  heroButtons: { display: "flex", gap: 14, flexWrap: "wrap" },
  heroScroll: { position: "absolute", right: 48, bottom: 88, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  heroScrollText: { fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" },
  heroScrollLine: { width: 1, height: 52, background: "rgba(255,255,255,0.25)" },

  btnGold: { padding: "15px 34px", background: C.gold, color: C.ink, border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, borderRadius: 2, letterSpacing: "0.3px", transition: "background 0.2s, transform 0.2s" },
  btnGhost: { padding: "15px 34px", background: "transparent", color: C.white, border: "1.5px solid rgba(255,255,255,0.38)", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, borderRadius: 2, transition: "border-color 0.2s" },
  btnGoldLg: { padding: "16px 40px", background: C.gold, color: C.ink, border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, borderRadius: 2, transition: "background 0.2s" },
  btnWhiteOutline: { padding: "16px 40px", background: "transparent", color: C.white, border: "1.5px solid rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, borderRadius: 2, transition: "all 0.2s" },

  introStrip: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, padding: "80px 56px", background: C.white, borderBottom: `1px solid ${C.border}`, alignItems: "center" },
  introLabel: { display: "block", fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: C.gold, fontWeight: 500, marginBottom: 14 },
  introTitle: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,3vw,38px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 18, color: C.ink },
  introBody: { fontSize: 15, lineHeight: 1.9, color: C.muted, fontWeight: 300 },
  introStats: { display: "flex", flexDirection: "column", gap: 28 },
  istat: { borderLeft: `3px solid ${C.gold}`, paddingLeft: 20 },
  istatNum: { fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: C.ink, lineHeight: 1 },
  istatLabel: { fontSize: 13, color: C.muted, marginTop: 4, letterSpacing: "0.5px" },

  how: { padding: "100px 56px", background: C.ink },
  howHeader: { textAlign: "center", maxWidth: 560, margin: "0 auto 72px" },
  howTitle: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 700, lineHeight: 1.1, color: C.white },
  howGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 },
  howCard: { padding: "48px 36px", border: "1px solid rgba(255,255,255,0.06)", transition: "background 0.3s, border-color 0.3s", cursor: "default" },
  howNum: { fontFamily: "'Playfair Display', serif", fontSize: 64, fontWeight: 700, color: "rgba(201,168,76,0.15)", lineHeight: 1, marginBottom: 20, transition: "color 0.3s" },
  howIcon: { fontSize: 28, marginBottom: 16 },
  howCardTitle: { fontSize: 18, fontWeight: 600, marginBottom: 12, color: C.white },
  howCardDesc: { fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", fontWeight: 300 },
  howRole: { display: "inline-block", marginTop: 16, fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: C.gold, fontWeight: 500, padding: "4px 10px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 2 },
  secLabelLight: { display: "block", fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: C.gold, fontWeight: 500, marginBottom: 14 },

  section: { padding: "90px 56px" },
  secHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 },
  secLabel: { display: "block", fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: C.gold, fontWeight: 500, marginBottom: 10 },
  secTitle: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 700, lineHeight: 1.1, color: C.ink },
  linkArrow: { fontSize: 13, color: C.muted, cursor: "pointer", borderBottom: "1px solid transparent", transition: "color 0.2s", paddingBottom: 2 },

  catGrid: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 },
  catCard: { position: "relative", height: 220, overflow: "hidden", borderRadius: 3, cursor: "pointer" },
  catImg: { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s ease" },
  catOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,12,10,0.82) 0%, rgba(13,12,10,0.08) 60%, transparent 100%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 18, transition: "background 0.3s" },
  catName: { color: C.white, fontSize: 15, fontWeight: 600, margin: 0, marginBottom: 4 },
  catCount: { color: "rgba(255,255,255,0.55)", fontSize: 12, margin: 0 },

  artGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 20 },
  artCard: { background: C.white, borderRadius: 3, overflow: "hidden", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", transition: "box-shadow 0.3s" },
  artImgWrap: { position: "relative", height: 280, overflow: "hidden" },
  artImg: { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s ease" },
  artTagBadge: { position: "absolute", top: 12, left: 12, background: C.gold, color: C.ink, padding: "5px 10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", borderRadius: 2 },
  artWish: { position: "absolute", top: 12, right: 12, background: "rgba(247,243,237,0.92)", border: "none", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, opacity: 0, transition: "opacity 0.3s", cursor: "pointer" },
  quickBuy: { position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(13,12,10,0.88)", color: C.white, textAlign: "center", padding: 14, fontSize: 13, fontWeight: 500, letterSpacing: "0.5px", transform: "translateY(100%)", transition: "transform 0.3s ease" },
  artInfo: { padding: 20 },
  artTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, marginBottom: 6, color: C.ink },
  artArtist: { fontSize: 13, color: C.muted, marginBottom: 10 },
  artBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  artPrice: { fontSize: 18, fontWeight: 700, color: C.ink },
  artMedium: { fontSize: 12, color: C.muted, background: "rgba(13,12,10,0.05)", padding: "4px 10px", borderRadius: 2 },

  statsBar: { background: C.ink, color: C.white, padding: "56px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 },
  statItem: { textAlign: "center", padding: "0 24px" },
  statNum: { fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, lineHeight: 1, marginBottom: 10, color: C.white },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "1px", textTransform: "uppercase" },

  artistGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 20 },
  artistCard: { background: C.white, borderRadius: 3, padding: "36px 24px", textAlign: "center", border: `1px solid ${C.border}`, cursor: "pointer", transition: "border-color 0.3s, transform 0.3s", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
  artistAvatar: { width: 72, height: 72, borderRadius: "50%", background: "#ede6db", color: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, margin: "0 auto 16px", fontFamily: "'Playfair Display', serif" },
  artistAvatarImg: { width: 72, height: 72, borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto 16px" },
  artistName: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 500, color: C.ink, margin: "0 0 6px" },
  artistRole: { fontSize: 13, color: C.muted, margin: 0 },
  artistCount: { fontSize: 12, color: C.gold, marginTop: 8, fontWeight: 500 },
  artistBio: { fontSize: 12, color: C.muted, marginTop: 10, lineHeight: 1.6 },

  whyStrip: { background: C.white, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "48px 56px", gap: 0 },
  whyItem: { display: "flex", gap: 16, alignItems: "flex-start", padding: "0 32px 0 0" },
  whyIcon: { fontSize: 26, flexShrink: 0, marginTop: 2 },
  whyTitle: { fontSize: 15, fontWeight: 600, marginBottom: 6, color: C.ink },
  whyDesc: { fontSize: 13, color: C.muted, lineHeight: 1.7, fontWeight: 300 },

  sellCta: { position: "relative", margin: "0 56px 90px", borderRadius: 4, overflow: "hidden" },
  sellCtaImg: { width: "100%", height: 440, objectFit: "cover", display: "block" },
  sellCtaOverlay: { position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(13,12,10,0.88) 0%, rgba(13,12,10,0.35) 100%)", display: "flex", alignItems: "center", padding: "0 80px" },
  sellCtaContent: { maxWidth: 520 },
  sellCtaTag: { display: "block", fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: C.gold, fontWeight: 500, marginBottom: 20 },
  sellCtaTitle: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, color: C.white, lineHeight: 1.05, marginBottom: 16 },
  sellCtaBody: { fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: 32, fontWeight: 300 },

  ctaSection: { margin: "0 56px 90px", background: "linear-gradient(135deg, #1a1814, #6b3f22)", borderRadius: 4, textAlign: "center", padding: "80px 40px" },
  ctaLabel: { display: "block", fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: C.gold, fontWeight: 500, marginBottom: 16 },
  ctaTitle: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, color: C.white, marginBottom: 14, lineHeight: 1.1 },
  ctaText: { maxWidth: 580, margin: "0 auto 32px", fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.72)", fontWeight: 300 },
  ctaBtn: { padding: "16px 44px", background: C.gold, color: C.ink, border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, borderRadius: 2, transition: "background 0.2s" },

  footer: { background: C.ink, color: C.white, padding: "80px 56px 36px" },
  footerTop: { display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1fr", gap: 64, marginBottom: 56 },
  footerLogo: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 12, color: C.white },
  footerTagline: { fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.8, maxWidth: 240, fontWeight: 300 },
  footerColTitle: { fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", fontWeight: 500, marginBottom: 18, display: "block" },
  footerLink: { display: "block", fontSize: 13, color: "rgba(255,255,255,0.55)", cursor: "pointer", marginBottom: 12, transition: "color 0.2s", fontWeight: 300 },
  footerBottom: { borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center" },
  footerCopy: { fontSize: 12, color: "rgba(255,255,255,0.28)" },
  footerLegal: { fontSize: 12, color: "rgba(255,255,255,0.28)", cursor: "pointer", transition: "color 0.2s" },

  loadingBox: { background: C.white, borderRadius: 3, padding: "48px", textAlign: "center", color: C.muted, fontSize: 15, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
};