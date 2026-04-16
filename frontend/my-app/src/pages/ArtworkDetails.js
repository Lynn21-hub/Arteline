import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArtworkById } from "../api/artworkAPI";
import { addToCart } from "../api/cartAPI";

function ArtworkDetails() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartStatus, setCartStatus] = useState("idle");

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true);
        const data = await getArtworkById(id);
        setArtwork(data);
      } catch (err) {
        console.error("Error fetching artwork:", err);
        setArtwork(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  const handleAddToCart = async () => {
    if (!artwork || artwork.inventory <= 0) return;

    try {
      setCartStatus("loading");
      await addToCart(artwork.id, 1);
      setCartStatus("added");
      setTimeout(() => setCartStatus("idle"), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      const message = err.response?.data?.message?.toLowerCase() || "";
      setCartStatus(message.includes("out of stock") ? "out-of-stock" : "error");
      setTimeout(() => setCartStatus("idle"), 2000);
    }
  };

  const addToCartLabel =
    cartStatus === "loading"
      ? "Adding..."
      : cartStatus === "added"
      ? "Added!"
      : cartStatus === "out-of-stock" || artwork?.inventory <= 0
      ? "Out of stock"
      : cartStatus === "error"
      ? "Try again"
      : "Add to Cart";

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="details-page">
          <div className="details-loading">Loading artwork...</div>
        </div>
      </>
    );
  }

  if (!artwork || artwork.message) {
    return (
      <>
        <style>{css}</style>
        <div className="details-page">
          <div className="details-notfound">
            <h2>Artwork not found</h2>
            <Link to="/artworks" className="back-btn">
              ← Back to artworks
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>

      <div className="details-page">
        <div className="details-topbar">
          <Link to="/artworks" className="back-btn">
            ← Back to artworks
          </Link>
        </div>

        <div className="details-card">
          <div className="details-image-section">
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="details-image"
            />
          </div>

          <div className="details-info-section">
            <p className="details-category">{artwork.category}</p>
            <h1 className="details-title">{artwork.title}</h1>
            <p className="details-artist">
              by {artwork.artist_name}
            </p>

            <div className="details-price-row">
              <span className="details-price">
                ${Number(artwork.price).toLocaleString()}
              </span>
              <span className="details-stock">
                {artwork.inventory > 0
                  ? `In stock: ${artwork.inventory}`
                  : "Out of stock"}
              </span>
            </div>

            <p className="details-description">
              {artwork.description || "No description available for this artwork."}
            </p>

            <div className="details-meta">
              <div className="meta-box">
                <span className="meta-label">Category</span>
                <span className="meta-value">{artwork.category || "—"}</span>
              </div>

              <div className="meta-box">
                <span className="meta-label">Format</span>
                <span className="meta-value">{artwork.format || "—"}</span>
              </div>

              <div className="meta-box">
                <span className="meta-label">Artist</span>
                <span className="meta-value">{artwork.artist_name || "—"}</span>
              </div>

              <div className="meta-box">
                <span className="meta-label">Availability</span>
                <span className="meta-value">
                  {artwork.inventory > 0 ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            <div className="details-actions">
              <button
                className={`primary-btn ${
                  cartStatus === "added"
                    ? "primary-btn--added"
                    : cartStatus === "out-of-stock" || artwork.inventory <= 0
                    ? "primary-btn--disabled"
                    : cartStatus === "error"
                    ? "primary-btn--error"
                    : ""
                }`}
                onClick={handleAddToCart}
                disabled={cartStatus === "loading" || artwork.inventory <= 0}
              >
                {addToCartLabel}
              </button>

              <button className="secondary-btn">Add to Wishlist</button>
            </div>
          </div>
        </div>
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
    font-family: Arial, sans-serif;
    color: #111;
  }

  .details-page {
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  .details-topbar {
    margin-bottom: 24px;
  }

  .back-btn {
    display: inline-block;
    text-decoration: none;
    color: #111;
    background: white;
    border: 1px solid #e5ddd3;
    padding: 12px 18px;
    border-radius: 12px;
    font-weight: 600;
    transition: 0.2s ease;
  }

  .back-btn:hover {
    background: #111;
    color: white;
  }

  .details-card {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 40px;
    background: white;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  }

  .details-image-section {
    background: #eee7de;
    min-height: 620px;
  }

  .details-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .details-info-section {
    padding: 42px 38px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .details-category {
    margin: 0 0 10px;
    color: #b06b3f;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .details-title {
    margin: 0;
    font-size: 54px;
    line-height: 1;
    font-family: Georgia, serif;
  }

  .details-artist {
    margin: 14px 0 24px;
    font-size: 18px;
    color: #666;
  }

  .details-price-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .details-price {
    font-size: 34px;
    font-weight: 700;
    color: #111;
  }

  .details-stock {
    background: #f3ede6;
    color: #6b4e3d;
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
  }

  .details-description {
    margin: 0 0 28px;
    font-size: 16px;
    line-height: 1.8;
    color: #444;
  }

  .details-meta {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 30px;
  }

  .meta-box {
    background: #faf7f2;
    border: 1px solid #eee3d7;
    border-radius: 16px;
    padding: 16px;
  }

  .meta-label {
    display: block;
    font-size: 12px;
    color: #8a7f74;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  .meta-value {
    font-size: 16px;
    font-weight: 600;
    color: #111;
  }

  .details-actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .primary-btn,
  .secondary-btn {
    border: none;
    border-radius: 14px;
    padding: 14px 22px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .primary-btn {
    background: #c97b4a;
    color: white;
  }

  .primary-btn:hover:enabled {
    background: #b46b3f;
  }

  .primary-btn--added {
    background: #2e7d32;
  }

  .primary-btn--error {
    background: #c62828;
  }

  .secondary-btn {
    background: #f3ede6;
    color: #111;
    border: 1px solid #e6d9ca;
  }

  .secondary-btn:hover {
    background: #e9dfd4;
  }

  .details-loading,
  .details-notfound {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
  }

  .details-notfound h2 {
    margin-top: 0;
    margin-bottom: 20px;
  }

  @media (max-width: 980px) {
    .details-card {
      grid-template-columns: 1fr;
    }

    .details-image-section {
      min-height: 400px;
    }

    .details-title {
      font-size: 40px;
    }
  }

  @media (max-width: 640px) {
    .details-page {
      padding: 24px 14px 50px;
    }

    .details-info-section {
      padding: 24px 20px;
    }

    .details-title {
      font-size: 32px;
    }

    .details-meta {
      grid-template-columns: 1fr;
    }

    .details-price {
      font-size: 28px;
    }
  }
`;

export default ArtworkDetails;
