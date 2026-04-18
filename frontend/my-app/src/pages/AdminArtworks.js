import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteArtwork, getAllArtworks } from "../api/artworkAPI";

function AdminArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [notice, setNotice] = useState("");

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllArtworks();
      setArtworks(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      console.error("Error loading artworks:", fetchError);
      setError(fetchError.message || "Failed to load artworks");
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleRemove = async (artwork) => {
    const confirmed = window.confirm(
      `Remove \"${artwork.title}\" from the catalog? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingId(artwork.id);
      setNotice("");
      await deleteArtwork(artwork.id);
      setArtworks((current) => current.filter((item) => item.id !== artwork.id));
      setNotice(`Removed \"${artwork.title}\".`);
    } catch (removeError) {
      console.error("Error removing artwork:", removeError);
      setError(removeError.message || "Failed to remove artwork");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <style>{css}</style>

      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <p className="admin-kicker">ADMIN CONSOLE</p>
            <h1>Artwork Management</h1>
            <p className="admin-subtitle">
              Review the full catalog and remove pieces that should no longer be listed.
            </p>
          </div>

          <div className="admin-hero-actions">
            <Link to="/admin/payouts" className="view-btn">
              Payout Queue
            </Link>
            <button type="button" className="refresh-btn" onClick={fetchArtworks}>
              Refresh catalog
            </button>
          </div>
        </div>

        {notice ? <div className="admin-notice">{notice}</div> : null}
        {error ? <div className="admin-error">{error}</div> : null}

        {loading ? (
          <div className="admin-empty">Loading artworks...</div>
        ) : artworks.length === 0 ? (
          <div className="admin-empty">No artworks found.</div>
        ) : (
          <div className="admin-grid">
            {artworks.map((artwork) => (
              <article key={artwork.id} className="admin-card">
                <div className="admin-image-wrap">
                  {artwork.image_url ? (
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="admin-image"
                    />
                  ) : (
                    <div className="admin-image admin-image--placeholder">No image</div>
                  )}
                </div>

                <div className="admin-body">
                  <p className="admin-category">{artwork.category || "Uncategorized"}</p>
                  <h2>{artwork.title}</h2>
                  <p className="admin-artist">{artwork.artist_name || "Unknown artist"}</p>

                  <dl className="admin-meta">
                    <div>
                      <dt>Price</dt>
                      <dd>${Number(artwork.price).toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt>Inventory</dt>
                      <dd>{artwork.inventory ?? 0}</dd>
                    </div>
                    <div>
                      <dt>Creator</dt>
                      <dd>{artwork.creator_sub || "Unknown"}</dd>
                    </div>
                  </dl>

                  <div className="admin-actions">
                    <Link to={`/artworks/${artwork.id}`} className="view-btn">
                      View details
                    </Link>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemove(artwork)}
                      disabled={removingId === artwork.id}
                    >
                      {removingId === artwork.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </article>
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

  .admin-page {
    max-width: 1280px;
    margin: 0 auto;
    padding: 42px 24px 80px;
  }

  .admin-hero {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .admin-hero-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .admin-kicker {
    margin: 0 0 10px;
    color: #7d4f35;
    font-size: 12px;
    letter-spacing: 2px;
    font-weight: 700;
  }

  .admin-hero h1 {
    margin: 0;
    font-size: 52px;
    font-family: Georgia, serif;
  }

  .admin-subtitle {
    margin: 12px 0 0;
    max-width: 640px;
    color: #5d564e;
    line-height: 1.6;
  }

  .refresh-btn,
  .view-btn,
  .remove-btn {
    border: none;
    border-radius: 14px;
    padding: 12px 18px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .refresh-btn,
  .view-btn {
    background: white;
    color: #111;
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
  }

  .remove-btn {
    background: #8a2f2f;
    color: white;
  }

  .refresh-btn:hover,
  .view-btn:hover,
  .remove-btn:hover {
    transform: translateY(-1px);
  }

  .remove-btn:disabled {
    opacity: 0.7;
    cursor: wait;
    transform: none;
  }

  .admin-notice,
  .admin-error,
  .admin-empty {
    border-radius: 18px;
    padding: 18px 20px;
    margin-bottom: 20px;
  }

  .admin-notice {
    background: #eef6ef;
    color: #275937;
  }

  .admin-error {
    background: #fbebeb;
    color: #8a2f2f;
  }

  .admin-empty {
    background: white;
    color: #5d564e;
    text-align: center;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
  }

  .admin-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 22px;
  }

  .admin-card {
    overflow: hidden;
    background: white;
    border-radius: 24px;
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.07);
  }

  .admin-image-wrap {
    background: #ece3d8;
    aspect-ratio: 4 / 3;
  }

  .admin-image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .admin-image--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6a6258;
    font-weight: 600;
  }

  .admin-body {
    padding: 22px;
  }

  .admin-category {
    margin: 0 0 8px;
    color: #7d4f35;
    font-size: 12px;
    letter-spacing: 2px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .admin-body h2 {
    margin: 0 0 8px;
    font-size: 28px;
    font-family: Georgia, serif;
  }

  .admin-artist {
    margin: 0 0 18px;
    color: #5d564e;
  }

  .admin-meta {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin: 0 0 22px;
  }

  .admin-meta div {
    background: #f7f4ef;
    border-radius: 16px;
    padding: 12px;
  }

  .admin-meta dt {
    margin-bottom: 6px;
    color: #7d4f35;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .admin-meta dd {
    margin: 0;
    font-size: 14px;
    color: #111;
    word-break: break-word;
  }

  .admin-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: 680px) {
    .admin-page {
      padding: 28px 16px 60px;
    }

    .admin-hero h1 {
      font-size: 40px;
    }

    .admin-meta {
      grid-template-columns: 1fr;
    }

    .admin-actions > * {
      width: 100%;
      text-align: center;
    }
  }
`;

export default AdminArtworks;