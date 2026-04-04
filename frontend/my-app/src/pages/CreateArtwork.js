import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArtwork } from "../api/artworkAPI";

function CreateArtwork() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    format: "",
    price: "",
    inventory: 1,
    artist_name: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createArtwork(form);
      navigate("/artist/inventory");
    } catch (error) {
      console.error("Error creating artwork:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>

      <div className="form-page">
        <div className="form-card">
          <p className="form-kicker">ARTIST DASHBOARD</p>
          <h1>Add Artwork</h1>

          <form onSubmit={handleSubmit} className="art-form">
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <input name="artist_name" placeholder="Artist Name" value={form.artist_name} onChange={handleChange} />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
            <input name="format" placeholder="Format" value={form.format} onChange={handleChange} />
            <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
            <input name="inventory" type="number" placeholder="Inventory" value={form.inventory} onChange={handleChange} />
            <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="5" />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Create Artwork"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const css = `
  body {
    margin: 0;
    background: #f7f4ef;
    font-family: Arial, sans-serif;
  }

  .form-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
  }

  .form-card {
    width: 100%;
    max-width: 760px;
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
  }

  .form-kicker {
    margin: 0 0 8px;
    color: #b06b3f;
    font-size: 12px;
    letter-spacing: 2px;
    font-weight: 700;
  }

  .form-card h1 {
    margin: 0 0 24px;
    font-family: Georgia, serif;
    font-size: 42px;
  }

  .art-form {
    display: grid;
    gap: 14px;
  }

  .art-form input,
  .art-form textarea {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 14px;
    padding: 14px 16px;
    font-size: 15px;
    outline: none;
  }

  .art-form input:focus,
  .art-form textarea:focus {
    border-color: #c97b4a;
  }

  .submit-btn {
    border: none;
    border-radius: 14px;
    background: #111;
    color: white;
    padding: 15px 18px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
  }
`;

export default CreateArtwork;