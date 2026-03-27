import React, { useEffect, useState } from "react";
import { getArtworkById, updateArtwork } from "../services/artworkService";
import { useNavigate, useParams } from "react-router-dom";

function EditArtwork() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    format: "",
    price: "",
    inventory: "",
    artist_name: "",
  });

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const res = await getArtworkById(id);
        setForm(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArtwork();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateArtwork(id, form);
      navigate("/");
    } catch (error) {
      console.error("Error updating artwork:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Artwork</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} /><br /><br />
        <textarea name="description" value={form.description} onChange={handleChange} /><br /><br />
        <input name="category" value={form.category} onChange={handleChange} /><br /><br />
        <input name="format" value={form.format} onChange={handleChange} /><br /><br />
        <input name="price" type="number" value={form.price} onChange={handleChange} /><br /><br />
        <input name="inventory" type="number" value={form.inventory} onChange={handleChange} /><br /><br />
        <input name="artist_name" value={form.artist_name} onChange={handleChange} /><br /><br />
        <button type="submit">Update Artwork</button>
      </form>
    </div>
  );
}

export default EditArtwork;