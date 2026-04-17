const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

// Simple admin check: compare user's sub with ADMIN_SUBS from env
const isAdminUser = (userSub) => {
  const adminSubs = (process.env.ADMIN_SUBS || "").split(",").map((s) => s.trim());
  return userSub && adminSubs.includes(userSub);
};

exports.createArtwork = async (req, res) => {
  try {
    const userSub = req.user?.sub;
    if (!userSub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const file = req.file;

    let imageUrl = null;
    let s3_key = null;

    if (file) {
      const key = `artworks/${Date.now()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);

      const s3Region = process.env.AWS_S3_REGION || process.env.AWS_REGION;
      imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${s3Region}.amazonaws.com/${key}`;
      s3_key = key;
    }

    const {
      title,
      description,
      category,
      format,
      price,
      inventory,
      artist_name,
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
        price: Number(price),
        inventory: inventory ? Number(inventory) : 1,
        artist_name,
        image_url: imageUrl,   
        s3_key,               
        creator_sub: userSub,
      },
    });

    res.status(201).json(artwork);
  } catch (error) {
    console.error("Error creating artwork:", error);
    res.status(500).json({ message: "Error creating artwork" });
  }
};

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

exports.getMyArtworks = async (req, res) => {
  try {
    const userSub = req.user?.sub;

    if (!userSub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const artworks = await prisma.artwork.findMany({
      where: {
        creator_sub: userSub,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(artworks);
  } catch (error) {
    console.error("Error fetching user artworks:", error);
    res.status(500).json({ message: "Error fetching user artworks" });
  }
};

exports.getArtworkById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

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


exports.updateArtwork = async (req, res) => {
  try {
    const userSub = req.user?.sub;
    if (!userSub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!isAdminUser(userSub)) {
      return res.status(403).json({
        message: "Only admin users can update artworks",
      });
    }

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
    const userSub = req.user?.sub;
    if (!userSub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!isAdminUser(userSub)) {
      return res.status(403).json({
        message: "Only admin users can delete artworks",
      });
    }

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
