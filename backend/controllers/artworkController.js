const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllArtworks = async (req, res) => {
  try {
    const artworks = await prisma.artwork.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(artworks);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    res.status(500).json({ message: "Error fetching artworks" });
  }
};

exports.getArtworkById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const artwork = await prisma.artwork.findUnique({
      where: { id },
    });

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.status(200).json(artwork);
  } catch (error) {
    console.error("Error fetching artwork:", error);
    res.status(500).json({ message: "Error fetching artwork" });
  }
};

exports.createArtwork = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      format,
      price,
      inventory,
      artist_name,
      image_url,
      s3_key,
    } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    const artwork = await prisma.artwork.create({
      data: {
        title,
        description,
        category,
        format,
        price,
        inventory: inventory ? Number(inventory) : 1,
        artist_name,
        image_url,
        s3_key,
      },
    });

    res.status(201).json(artwork);
  } catch (error) {
    console.error("Error creating artwork:", error);
    res.status(500).json({ message: "Error creating artwork" });
  }
};

exports.updateArtwork = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      title,
      description,
      category,
      format,
      price,
      inventory,
      artist_name,
      image_url,
      s3_key,
    } = req.body;

    const existingArtwork = await prisma.artwork.findUnique({
      where: { id },
    });

    if (!existingArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const updatedArtwork = await prisma.artwork.update({
      where: { id },
      data: {
        title,
        description,
        category,
        format,
        price,
        inventory: inventory !== undefined ? Number(inventory) : existingArtwork.inventory,
        artist_name,
        image_url,
        s3_key,
      },
    });

    res.status(200).json(updatedArtwork);
  } catch (error) {
    console.error("Error updating artwork:", error);
    res.status(500).json({ message: "Error updating artwork" });
  }
};

exports.deleteArtwork = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingArtwork = await prisma.artwork.findUnique({
      where: { id },
    });

    if (!existingArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    await prisma.artwork.delete({
      where: { id },
    });

    res.status(200).json({ message: "Artwork deleted successfully" });
  } catch (error) {
    console.error("Error deleting artwork:", error);
    res.status(500).json({ message: "Error deleting artwork" });
  }
};