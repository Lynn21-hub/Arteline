import React, { useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
 
const MOCK_ARTWORKS = [
  { id: 1,  title: "Crimson Reverie",   artist: "Layla Mansour", price: 480,  category: "Painting",    image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80" },
  { id: 2,  title: "Silent Portrait I", artist: "Omar Faris",    price: 320,  category: "Portrait",    image_url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80" },
  { id: 3,  title: "Stone & Memory",    artist: "Nadia Khalil",  price: 950,  category: "Sculpture",   image_url: "https://images.unsplash.com/photo-1555448248-2571daf6344b?w=600&q=80" },
  { id: 4,  title: "Ink Horizons",      artist: "Yusuf Al-Amin", price: 210,  category: "Calligraphy", image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { id: 5,  title: "Charcoal Dreams",   artist: "Sara Beydoun",  price: 175,  category: "Drawing",     image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80" },
  { id: 6,  title: "Golden Hour",       artist: "Layla Mansour", price: 620,  category: "Painting",    image_url: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80" },
  { id: 7,  title: "Faces of Beirut",   artist: "Omar Faris",    price: 390,  category: "Portrait",    image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80" },
  { id: 8,  title: "Marble Garden",     artist: "Nadia Khalil",  price: 1100, category: "Sculpture",   image_url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80" },
];
 
const CATEGORIES = ["All", "Painting", "Portrait", "Sculpture", "Calligraphy", "Drawing"];
 
function Artworks() {
  const [artworks]        = useState(MOCK_ARTWORKS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch]                 = useState("");
  const [sort, setSort]                     = useState("default");
 
  const filtered = artworks
    .filter((a) => activeCategory === "All" || a.category === activeCategory)
    .filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.artist.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name")       return a.title.localeCompare(b.title);
      return 0;
    });
 
  return (
    <>
      <style>{css}</style>
 
      <div className="aw-page">
        <div className="aw-header">
          <h1 className="aw-heading">Explore Artworks</h1>
          <p className="aw-sub">Curated pieces from artists around the world</p>
        </div>
 
        <div className="aw-controls">
          <input
            className="aw-search"
            placeholder="Search by title or artist…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="aw-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name: A → Z</option>
          </select>
        </div>
 
        <div className="aw-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? "pill--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
 
        {filtered.length === 0 ? (
          <div className="aw-empty">No artworks found.</div>
        ) : (
          <div className="aw-grid">
            {filtered.map((a) => (
              <ArtworkCard key={a.id} artwork={a} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
 
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
 
  :root {
    --orange: #ff6b35;
    --black: #111;
    --text-muted: #888;
    --radius: 14px;
    --transition: 0.25s ease;
  }
 
  .aw-page {
    font-family: 'DM Sans', sans-serif;
    max-width: 1280px;
    margin: 0 auto;
    padding: 60px 24px 80px;
  }
 
  .aw-header { text-align: center; margin-bottom: 48px; }
  .aw-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 700;
    color: var(--black);
    margin: 0 0 10px;
  }
  .aw-sub { color: var(--text-muted); font-size: 16px; margin: 0; }
 
  .aw-controls { display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
  .aw-search {
    flex: 1; min-width: 200px; padding: 12px 16px;
    border: 1.5px solid #e0e0e0; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none;
    transition: border-color var(--transition);
  }
  .aw-search:focus { border-color: var(--orange); }
  .aw-sort {
    padding: 12px 16px; border: 1.5px solid #e0e0e0; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; background: #fff; cursor: pointer; outline: none;
  }
 
  .aw-pills { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 40px; }
  .pill {
    padding: 8px 20px; border-radius: 100px; border: 1.5px solid #ddd;
    background: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px;
    font-weight: 500; cursor: pointer; transition: all var(--transition); color: var(--black);
  }
  .pill:hover { border-color: var(--orange); color: var(--orange); }
  .pill--active { background: var(--orange); border-color: var(--orange); color: #fff; }
 
  .aw-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 28px; }
  .aw-empty { text-align: center; padding: 80px; color: var(--text-muted); font-size: 16px; }
 
  .artwork-card {
    border-radius: var(--radius); overflow: hidden; background: #fff;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    transition: transform var(--transition), box-shadow var(--transition);
  }
  .artwork-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
 
  .card-img-wrap { position: relative; height: 240px; overflow: hidden; }
  .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .artwork-card:hover .card-img { transform: scale(1.04); }
 
  .card-category {
    position: absolute; top: 12px; left: 12px;
    background: rgba(255,255,255,0.92); padding: 4px 10px; border-radius: 100px;
    font-size: 11px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; color: var(--black);
  }
 
  .card-body { padding: 18px; }
  .card-artist { font-size: 12px; color: var(--text-muted); margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .card-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; margin: 0 0 14px; color: var(--black); }
 
  .card-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .card-price { font-size: 18px; font-weight: 600; color: var(--black); }
 
  .cart-btn {
    padding: 9px 18px; border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all var(--transition); background: var(--orange); color: #fff; white-space: nowrap;
  }
  .cart-btn:hover:not(:disabled) { background: #e85a25; }
  .cart-btn--loading { opacity: 0.7; cursor: not-allowed; }
  .cart-btn--added { background: #2e7d32; }
  .cart-btn--error { background: #c62828; }
`;
 
export default Artworks;
 