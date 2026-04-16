import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArtwork } from "../api/artworkAPI";

function CreateArtwork() {
  const navigate = useNavigate();

  const categoryOptions = [
    "Painting",
    "Drawing",
    "Photography",
    "Sculpture",
    "Print",
    "Textile",
    "Ceramic",
    "Digital Art",
    "Mixed Media",
    "Other",
  ];

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
  const [loadingRealData, setLoadingRealData] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "price" || name === "inventory") && Number(value) < 0) {
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const mapCategory = (artworkType, classification) => {
    const text = `${artworkType || ""} ${classification || ""}`.toLowerCase();

    if (text.includes("painting")) return "Painting";
    if (text.includes("drawing")) return "Drawing";
    if (text.includes("photograph")) return "Photography";
    if (text.includes("sculpt")) return "Sculpture";
    if (text.includes("print")) return "Print";
    if (text.includes("textile")) return "Textile";
    if (text.includes("ceramic")) return "Ceramic";
    return "Other";
  };

  const cleanText = (htmlText) => {
    if (!htmlText) return "";
    const temp = document.createElement("div");
    temp.innerHTML = htmlText;
    return temp.textContent || temp.innerText || "";
  };

  const loadRealArtwork = async () => {
    setLoadingRealData(true);

    try {
      const listRes = await fetch(
        "https://api.artic.edu/api/v1/artworks?limit=100&fields=id,title,artist_display,image_id,thumbnail,artwork_type_title,classification_title,date_display"
      );
      const listJson = await listRes.json();

      const items = (listJson.data || []).filter(
        (item) => item.title && item.artist_display && item.image_id
      );

      if (items.length === 0) {
        alert("No artwork data found.");
        return;
      }

      const randomItem = items[Math.floor(Math.random() * items.length)];

      const detailRes = await fetch(
        `https://api.artic.edu/api/v1/artworks/${randomItem.id}?fields=id,title,artist_display,image_id,thumbnail,artwork_type_title,classification_title,date_display,medium_display,credit_line,publication_history,exhibition_history`
      );
      const detailJson = await detailRes.json();
      const artwork = detailJson.data;

      const imageUrl = artwork.image_id
        ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
        : "";

      const artistName = artwork.artist_display
        ? artwork.artist_display.split("\n")[0]
        : "Unknown Artist";

      const descriptionParts = [
        artwork.thumbnail?.alt_text,
        artwork.medium_display,
        artwork.date_display,
      ].filter(Boolean);

      setForm({
        title: artwork.title || "",
        description: cleanText(descriptionParts.join(" • ")),
        category: mapCategory(
          artwork.artwork_type_title,
          artwork.classification_title
        ),
        format: artwork.artwork_type_title || "Artwork",
        price: Math.floor(Math.random() * 400 + 80).toString(),
        inventory: 1,
        artist_name: artistName,
        image_url: imageUrl,
      });
    } catch (error) {
      console.error("Error loading real artwork:", error);
      alert("Failed to load real artwork data.");
    } finally {
      setLoadingRealData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      await createArtwork(formData);

      navigate("/artist/inventory");
    } catch (error) {
      console.error(error);
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

          <div className="top-actions">
            <button
              type="button"
              className="dummy-btn"
              onClick={loadRealArtwork}
              disabled={loadingRealData}
            >
              {loadingRealData ? "Loading..." : "Load Real Artwork"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="art-form">
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              name="artist_name"
              placeholder="Artist Name"
              value={form.artist_name}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              name="format"
              placeholder="Format"
              value={form.format}
              onChange={handleChange}
              required
            />

            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
            />

            <input
              name="inventory"
              type="number"
              min="0"
              step="1"
              placeholder="Inventory"
              value={form.inventory}
              onChange={handleChange}
              required
            />

            <input
              type="file"
              name="image"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files[0] })
              }
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows="5"
            />

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
  * {
    box-sizing: border-box;
  }

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
    max-width: 820px;
    background: white;
    border-radius: 28px;
    padding: 36px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
    margin: 0 auto;
  }

  .form-kicker {
    margin: 0 0 8px;
    color: #b06b3f;
    font-size: 13px;
    letter-spacing: 2px;
    font-weight: 700;
  }

  .form-card h1 {
    margin: 0 0 20px;
    font-family: Georgia, serif;
    font-size: 54px;
    line-height: 1.05;
  }

  .top-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }

  .dummy-btn {
    border: 1px solid #d9c2b1;
    border-radius: 12px;
    background: #fff8f2;
    color: #9b6038;
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .dummy-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .art-form {
    display: grid;
    gap: 14px;
  }

  .art-form input,
  .art-form textarea,
  .art-form select {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 16px;
    padding: 16px;
    font-size: 16px;
    outline: none;
    background: white;
  }

  .art-form input:focus,
  .art-form textarea:focus,
  .art-form select:focus {
    border-color: #c97b4a;
    box-shadow: 0 0 0 3px rgba(201, 123, 74, 0.10);
  }

  .art-form textarea {
    min-height: 170px;
    resize: vertical;
  }

  .submit-btn {
    border: none;
    border-radius: 16px;
    background: #111;
    color: white;
    padding: 16px 18px;
    font-size: 17px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 4px;
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default CreateArtwork;