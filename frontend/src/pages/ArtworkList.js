import React, { useEffect, useState } from "react";
import { getAllArtworks, deleteArtwork } from "../services/artworkService";
import ArtworkCard from "../components/ArtworkCard";
import { Link } from "react-router-dom";

function ArtworkList() {
  const [artworks, setArtworks] = useState([]);

  const fetchArtworks = async () => {
    try {
      const res = await getAllArtworks();
      setArtworks(res.data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteArtwork(id);
      fetchArtworks();
    } catch (error) {
      console.error("Error deleting artwork:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Artworks</h1>
      <Link to="/add-artwork">Add Artwork</Link>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default ArtworkList;