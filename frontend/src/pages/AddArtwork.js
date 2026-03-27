import React, { useState } from "react";
import { createArtwork } from "../services/artworkService";
import { useNavigate } from "react-router-dom";

function AddArtwork() {
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

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }
    formData.append("image", image);
    
    console.log("Form data ready");

    try {
      await createArtwork(formData);
      console.log("Successfully created artwork");
      navigate("/");
    } catch (error) {
      console.error("Error creating artwork:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Artwork</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required /><br /><br />
        <textarea name="description" placeholder="Description" onChange={handleChange} /><br /><br />
        <input name="category" placeholder="Category" onChange={handleChange} /><br /><br />
        <input name="format" placeholder="Format" onChange={handleChange} /><br /><br />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required /><br /><br />
        <input name="inventory" type="number" placeholder="Inventory" onChange={handleChange} /><br /><br />
        <input name="artist_name" placeholder="Artist Name" onChange={handleChange} /><br /><br />
        <input type="file" onChange={handleFileChange} required /><br /><br />
        <button type="submit">Create Artwork</button>
      </form>
    </div>
  );
}

export default AddArtwork;