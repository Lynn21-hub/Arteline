import React, { useEffect, useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import { getAllArtworks } from "../api/artworkAPI";

const CATEGORIES = ["All", "Painting", "Portrait", "Sculpture", "Calligraphy", "Drawing"];

function Artworks() {
  const [artworks, setArtworks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAllArtworks();
        setArtworks(data);
      } catch (err) {
        console.error("Error fetching artworks:", err);
        setError("Could not load artworks.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const filtered = artworks
    .filter((a) => activeCategory === "All" || a.category === activeCategory)
    .filter(
      (a) =>
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.artist_name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      if (sort === "name") return a.title.localeCompare(b.title);
      return 0;
    });

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
            type="text"
            placeholder="Search by title or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

        {loading ? (
          <div className="aw-empty">Loading artworks...</div>
        ) : error ? (
          <div className="aw-empty">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="aw-empty">No artworks found.</div>
        ) : (
          <div className="aw-grid">
            {filtered.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
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