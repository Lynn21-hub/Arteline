import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyArtworks, deleteArtwork } from "../api/artworkAPI";

function ArtistInventory() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArtworks = async () => {
    try {
      setError("");
      const data = await getMyArtworks();
      setArtworks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading artworks:", error);
      setError(error.message || "Failed to load your inventory");
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this artwork?");
    if (!confirmDelete) return;

    try {
      await deleteArtwork(id);
      setArtworks((prev) => prev.filter((art) => art.id !== id));
    } catch (error) {
      console.error("Error deleting artwork:", error);
    }
  };

  return (
    <>
      <style>{css}</style>

      <div className="inventory-page">
        <div className="inventory-header">
          <div>
            <p className="inventory-kicker">ARTIST DASHBOARD</p>
            <h1>My Inventory</h1>
          </div>

          <Link to="/artist/artworks/new" className="add-btn">
            + Add Artwork
          </Link>
        </div>

        {loading ? (
          <div className="empty-box">Loading artworks...</div>
        ) : error ? (
          <div className="empty-box">{error}</div>
        ) : artworks.length === 0 ? (
          <div className="empty-box">No artworks in inventory yet.</div>
        ) : (
          <div className="inventory-grid">
            {artworks.map((artwork) => (
              <div className="inventory-card" key={artwork.id}>
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="inventory-image"
                />

                <div className="inventory-body">
                  <p className="inventory-category">{artwork.category}</p>
                  <h3>{artwork.title}</h3>
                  <p className="inventory-artist">{artwork.artist_name}</p>
                  <p className="inventory-price">${Number(artwork.price).toLocaleString()}</p>
                  <p className="inventory-stock">Inventory: {artwork.inventory}</p>

                  <div className="inventory-actions">
                    <Link
                      to={`/artist/artworks/edit/${artwork.id}`}
                      className="edit-btn"
                    >
                      Edit
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(artwork.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const css = `
  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: #f7f4ef;
    font-family: Arial, sans-serif;
    color: #111;
  }

  .inventory-page {
    max-width: 1250px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  .inventory-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 30px;
  }

  .inventory-kicker {
    margin: 0 0 8px;
    color: #b06b3f;
    font-size: 12px;
    letter-spacing: 2px;
    font-weight: 700;
  }

  .inventory-header h1 {
    margin: 0;
    font-size: 48px;
    font-family: Georgia, serif;
  }

  .add-btn {
    text-decoration: none;
    background: #111;
    color: white;
    padding: 14px 18px;
    border-radius: 14px;
    font-weight: 700;
  }

  .inventory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 22px;
  }

  .inventory-card {
    background: white;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }

  .inventory-image {
    width: 100%;
    height: 240px;
    object-fit: cover;
    display: block;
  }

  .inventory-body {
    padding: 18px;
  }

  .inventory-category {
    margin: 0 0 6px;
    color: #b06b3f;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .inventory-body h3 {
    margin: 0 0 8px;
    font-size: 28px;
    font-family: Georgia, serif;
  }

  .inventory-artist,
  .inventory-stock {
    margin: 0 0 8px;
    color: #666;
  }

  .inventory-price {
    margin: 0 0 14px;
    font-size: 22px;
    font-weight: 700;
  }

  .inventory-actions {
    display: flex;
    gap: 10px;
  }

  .edit-btn,
  .delete-btn {
    border: none;
    padding: 12px 16px;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    font-size: 14px;
  }

  .edit-btn {
    background: #c97b4a;
    color: white;
  }

  .delete-btn {
    background: #f3e7e3;
    color: #9f2d20;
  }

  .empty-box {
    background: white;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 10px 24px rgba(0,0,0,0.06);
  }
`;

export default ArtistInventory;