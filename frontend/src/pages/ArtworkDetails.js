import React, { useEffect, useState } from "react";
import { getArtworkById } from "../services/artworkService";
import { useParams } from "react-router-dom";

function ArtworkDetails() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const res = await getArtworkById(id);
        setArtwork(res.data);
      } catch (error) {
        console.error("Error fetching artwork:", error);
      }
    };

    fetchArtwork();
  }, [id]);

  if (!artwork) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{artwork.title}</h1>
      <img
        src={artwork.image_url}
        alt={artwork.title}
        style={{ width: "300px", height: "300px", objectFit: "cover" }}
      />
      <p>{artwork.description}</p>
      <p>Category: {artwork.category}</p>
      <p>Format: {artwork.format}</p>
      <p>Price: ${artwork.price}</p>
      <p>Inventory: {artwork.inventory}</p>
      <p>Artist: {artwork.artist_name}</p>
    </div>
  );
}

export default ArtworkDetails;