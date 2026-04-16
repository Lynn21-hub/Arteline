

import React, { useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import { searchArtworks } from "../api/searchAPI";
const MOCK_ARTWORKS = [
  { id: 1, title: "Crimson Reverie", artist: "Layla Mansour", price: 480, category: "Painting", description :"A rich abstract composition with bold crimson tones.", image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80" },
  { id: 2, title: "Silent Portrait I", artist: "Omar Faris", price: 320, category: "Portrait", description :"A captivating portrait capturing the essence of its subject.", image_url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80" },
  { id: 3, title: "Stone & Memory", artist: "Nadia Khalil", price: 950, category: "Sculpture", description :"A powerful sculpture that embodies the weight of history.", image_url: "https://images.unsplash.com/photo-1555448248-2571daf6344b?w=600&q=80" },
  { id: 4, title: "Ink Horizons", artist: "Yusuf Al-Amin", price: 210, category: "Calligraphy", description :"Elegant calligraphy that dances across the page.", image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { id: 5, title: "Charcoal Dreams", artist: "Sara Beydoun", price: 175, category: "Drawing", description :"A whimsical drawing filled with imaginative details.", image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80" },
  { id: 6, title: "Golden Hour", artist: "Layla Mansour", price: 620, category: "Painting", description :"A warm and inviting painting that captures the beauty of golden hour lighting.", image_url: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80" },
  { id: 7, title: "Faces of Beirut", artist: "Omar Faris", price: 390, category: "Portrait", description :"A captivating portrait capturing the essence of its subject.", image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80" },
  { id: 8, title: "Marble Garden", artist: "Nadia Khalil", price: 1100, category: "Sculpture", description :"A powerful sculpture that embodies the weight of history.", image_url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80" },
];

const CATEGORIES = ["All", "Painting", "Portrait", "Sculpture", "Calligraphy", "Drawing"];
function Artworks() {
  
 const [artworks, setArtworks] = useState(MOCK_ARTWORKS);
const [loading, setLoading] = useState(false);
const [activeCategory, setActiveCategory] = useState("All");
const [search, setSearch] = useState("");
const [sort, setSort] = useState("default");

const handleSearch = async (value) => {
  setSearch(value);
  console.log("Search input:", value);
  if (!value.trim()) {
  setArtworks(MOCK_ARTWORKS);
  return;
}

  try {
    setLoading(true);
    console.log("Calling search API with query:", value);
    const results = await searchArtworks(value);
    console.log("Search results:", results);
    setArtworks(Array.isArray(results) ? results : []);
  } catch (err) {
    console.error("Search failed:", err);
    setArtworks([]);
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      <style>{css}</style>

      <div className="aw-page">
        <div className="aw-hero">
          <p className="aw-kicker">ART COLLECTION</p>
          <h1 className="aw-heading">Explore Artworks</h1>
          <p className="aw-sub">
            Discover curated pieces from talented artists around the world.
          </p>
        </div>

        <div className="aw-toolbar">
          <input
         className="aw-search"
         placeholder="Search artworks..."
         value={search}
         onChange={(e) => handleSearch(e.target.value)}
         />

          <select
            className="aw-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
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

       {search.trim() && artworks.length === 0 ? (
  <div className="aw-empty">No artworks found.</div>
) : (
          <div className="aw-grid">
            {Array.isArray(artworks) &&
  artworks.map((artwork) => (
    <ArtworkCard key={artwork.id} artwork={artwork} />
  ))
}
          </div>
        )}
      </div>
    </>
  );
}

const css = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #f7f4ef;
    color: #111;
    font-family: Arial, sans-serif;
  }

  .aw-page {
    max-width: 1250px;
    margin: 0 auto;
    padding: 50px 24px 80px;
  }

  .aw-hero {
    text-align: center;
    margin-bottom: 36px;
  }

  .aw-kicker {
    margin: 0 0 10px;
    font-size: 12px;
    letter-spacing: 3px;
    color: #b06b3f;
    font-weight: 700;
  }

  .aw-heading {
    margin: 0;
    font-size: 58px;
    line-height: 1;
    font-family: Georgia, serif;
  }

  .aw-sub {
    margin: 16px auto 0;
    max-width: 680px;
    font-size: 18px;
    color: #555;
    line-height: 1.6;
  }

  .aw-toolbar {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 22px;
    justify-content: center;
  }

  .aw-search,
  .aw-sort {
    height: 50px;
    border: 1px solid #ddd;
    border-radius: 14px;
    padding: 0 16px;
    background: white;
    font-size: 15px;
    outline: none;
  }

  .aw-search {
    width: 360px;
    max-width: 100%;
  }

  .aw-sort {
    min-width: 210px;
    cursor: pointer;
  }

  .aw-search:focus,
  .aw-sort:focus {
    border-color: #c97b4a;
    box-shadow: 0 0 0 3px rgba(201, 123, 74, 0.12);
  }

  .aw-pills {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 34px;
  }

  .pill {
    border: none;
    background: white;
    color: #333;
    padding: 10px 18px;
    border-radius: 999px;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: 0.2s ease;
  }

  .pill:hover {
    transform: translateY(-1px);
  }

  .pill--active {
    background: #111;
    color: white;
  }

  .aw-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
  }

  .aw-empty {
    text-align: center;
    font-size: 18px;
    color: #666;
    padding: 50px 0;
  }
`;

export default Artworks;