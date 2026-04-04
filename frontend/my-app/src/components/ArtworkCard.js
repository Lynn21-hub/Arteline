/* import React, { useState } from "react";
import { addToCart } from "../api/cartAPI";
 
function ArtworkCard({ artwork }) {
  const [status, setStatus] = useState("idle"); // idle | loading | added | error
 
  const handleAddToCart = async () => {
    setStatus("loading");
    try {
      await addToCart(artwork.id, 1);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2200);
    }
  };
 
  const btnLabel =
    status === "loading" ? "Adding…"
    : status === "added"   ? "✓ Added!"
    : status === "error"   ? "Try again"
    : "Add to Cart";
 
  return (
    <div className="artwork-card">
      <div className="card-img-wrap">
        <img src={artwork.image_url} alt={artwork.title} className="card-img" />
        <span className="card-category">{artwork.category}</span>
      </div>
      <div className="card-body">
        <p className="card-artist">{artwork.artist}</p>
        <h3 className="card-title">{artwork.title}</h3>
        <div className="card-footer">
          <span className="card-price">${artwork.price.toLocaleString()}</span>
          <button
            className={`cart-btn cart-btn--${status}`}
            onClick={handleAddToCart}
            disabled={status === "loading"}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default ArtworkCard;
*/

import React, { useState } from "react";
import { addToCart } from "../api/cartAPI";
import { useNavigate } from "react-router-dom";

function ArtworkCard({ artwork }) {
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setStatus("loading");

    try {
      await addToCart(artwork.id, 1);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const btnLabel =
    status === "loading"
      ? "Adding..."
      : status === "added"
      ? "Added!"
      : status === "error"
      ? "Try again"
      : "Add to Cart";

  return (
    <>
      <style>{css}</style>

      <div className="artwork-card" onClick={() => navigate(`/artworks/${artwork.id}`)}>
        <div className="card-img-wrap">
          <img src={artwork.image_url} alt={artwork.title} className="card-img" />
          <span className="card-category">{artwork.category}</span>
        </div>

        <div className="card-body">
          <p className="card-artist">{artwork.artist}</p>
          <h3 className="card-title">{artwork.title}</h3>

          <div className="card-footer">
            <span className="card-price">${artwork.price.toLocaleString()}</span>
            <button
              className={`cart-btn cart-btn--${status}`}
              onClick={handleAddToCart}
              disabled={status === "loading"}
            >
              {btnLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
  .artwork-card {
    background: white;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .artwork-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.14);
  }

  .card-img-wrap {
    position: relative;
    height: 280px;
    overflow: hidden;
  }

  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  .artwork-card:hover .card-img {
    transform: scale(1.05);
  }

  .card-category {
    position: absolute;
    top: 14px;
    left: 14px;
    background: rgba(255,255,255,0.92);
    color: #111;
    font-size: 12px;
    padding: 7px 12px;
    border-radius: 999px;
    font-weight: 600;
  }

  .card-body {
    padding: 18px;
  }

  .card-artist {
    margin: 0 0 6px;
    color: #8a8a8a;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .card-title {
    margin: 0 0 16px;
    font-size: 28px;
    line-height: 1.1;
    font-family: Georgia, serif;
    color: #111;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .card-price {
    font-size: 22px;
    font-weight: 700;
    color: #111;
  }

  .cart-btn {
    border: none;
    border-radius: 12px;
    padding: 11px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
    background: #c97b4a;
    color: white;
  }

  .cart-btn:hover:enabled {
    background: #b76c3e;
  }

  .cart-btn--loading {
    opacity: 0.75;
    cursor: not-allowed;
  }

  .cart-btn--added {
    background: #2e7d32;
  }

  .cart-btn--error {
    background: #c62828;
  }
`;

export default ArtworkCard;