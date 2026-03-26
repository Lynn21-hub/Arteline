import React, { useState } from "react";
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