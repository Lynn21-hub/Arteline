const Artwork = require("../models/artworkModel");

/* exports.createArtwork = (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      description,
      category,
      format,
      price,
      inventory,
      artist_name,
    } = req.body;

    const image_url = req.file ? req.file.location || req.file.path : null;
    const s3_key = req.file ? req.file.key || null : null;

    const artworkData = {
      title,
      description,
      category,
      format,
      price,
      inventory,
      artist_name,
      image_url,
      s3_key,
    };

    console.log("ARTWORK DATA:", artworkData);

    Artwork.create(artworkData, (err, result) => {
      if (err) {
        console.error("MYSQL ERROR:", err);
        return res.status(500).json({
          message: "Error creating artwork",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Artwork created successfully",
        artworkId: result.insertId,
      });
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
*/
exports.createArtwork = (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      description,
      category,
      format,
      price,
      inventory,
      artist_name,
    } = req.body;

    const image_url = req.file
      ? `http://localhost:5001/uploads/${req.file.filename}`
      : null;

    const s3_key = null;

    const artworkData = {
      title,
      description,
      category,
      format,
      price,
      inventory,
      artist_name,
      image_url,
      s3_key,
    };

    Artwork.create(artworkData, (err, result) => {
      if (err) {
        console.error("MYSQL ERROR:", err);
        return res.status(500).json({
          message: "Error creating artwork",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Artwork created successfully",
        artworkId: result.insertId,
      });
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getAllArtworks = (req, res) => {
  Artwork.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching artworks" });
    }
    res.status(200).json(results);
  });
};

exports.getArtworkById = (req, res) => {
  const { id } = req.params;

  Artwork.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching artwork" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    res.status(200).json(results[0]);
  });
};

exports.updateArtwork = (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    format,
    price,
    inventory,
    artist_name,
  } = req.body;

  const artworkData = {
    title,
    description,
    category,
    format,
    price,
    inventory,
    artist_name,
  };

  Artwork.update(id, artworkData, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error updating artwork" });
    }
    res.status(200).json({ message: "Artwork updated successfully" });
  });
};

exports.deleteArtwork = (req, res) => {
  const { id } = req.params;

  Artwork.delete(id, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting artwork" });
    }
    res.status(200).json({ message: "Artwork deleted successfully" });
  });
};