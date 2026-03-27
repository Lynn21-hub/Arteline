import React from "react";
import { Link } from "react-router-dom";

function ArtworkCard({ artwork, onDelete }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", margin: "10px", width: "250px" }}>
      <img
        src={artwork.image_url}
        alt={artwork.title}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <h3>{artwork.title}</h3>
      <p>{artwork.category}</p>
      <p>${artwork.price}</p>
      <p>Artist: {artwork.artist_name}</p>

      <Link to={`/artworks/${artwork.id}`}>View</Link>
      <br />
      <Link to={`/edit-artwork/${artwork.id}`}>Edit</Link>
      <br />
      <button onClick={() => onDelete(artwork.id)}>Delete</button>
    </div>
  );
}

export default ArtworkCard;