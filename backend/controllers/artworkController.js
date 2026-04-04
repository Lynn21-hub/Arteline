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