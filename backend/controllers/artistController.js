const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const mapProfile = (profile, artworksCount = 0) => ({
  id: profile.id,
  creatorSub: profile.creator_sub,
  displayName: profile.display_name,
  bio: profile.bio,
  avatarUrl: profile.avatar_url,
  location: profile.location,
  website: profile.website,
  instagram: profile.instagram,
  isPublished: profile.is_published,
  isFeatured: profile.is_featured,
  artworksCount,
  createdAt: profile.created_at,
  updatedAt: profile.updated_at,
});

exports.getFeaturedArtists = async (req, res) => {
  try {
    const profiles = await prisma.artistProfile.findMany({
      where: { is_published: true },
      orderBy: [{ is_featured: "desc" }, { updated_at: "desc" }],
      take: 8,
    });

    const enriched = await Promise.all(
      profiles.map(async (profile) => {
        const artworksCount = await prisma.artwork.count({
          where: { creator_sub: profile.creator_sub },
        });

        return mapProfile(profile, artworksCount);
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error("Error fetching featured artists:", error);
    res.status(500).json({ message: "Failed to fetch featured artists" });
  }
};

exports.getPublishedArtists = async (req, res) => {
  try {
    const profiles = await prisma.artistProfile.findMany({
      where: { is_published: true },
      orderBy: [{ is_featured: "desc" }, { updated_at: "desc" }],
    });

    const enriched = await Promise.all(
      profiles.map(async (profile) => {
        const artworksCount = await prisma.artwork.count({
          where: { creator_sub: profile.creator_sub },
        });

        return mapProfile(profile, artworksCount);
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error("Error fetching artists:", error);
    res.status(500).json({ message: "Failed to fetch artists" });
  }
};

exports.getMyArtistProfile = async (req, res) => {
  try {
    const userSub = req.user?.sub;
    if (!userSub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await prisma.artistProfile.findUnique({
      where: { creator_sub: userSub },
    });

    if (!profile) {
      return res.status(404).json({ message: "Artist profile not found" });
    }

    const artworksCount = await prisma.artwork.count({
      where: { creator_sub: userSub },
    });

    res.json(mapProfile(profile, artworksCount));
  } catch (error) {
    console.error("Error fetching artist profile:", error);
    res.status(500).json({ message: "Failed to fetch artist profile" });
  }
};

exports.upsertMyArtistProfile = async (req, res) => {
  try {
    const userSub = req.user?.sub;
    if (!userSub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      displayName,
      bio,
      avatarUrl,
      location,
      website,
      instagram,
      isPublished,
    } = req.body;

    if (!displayName || !displayName.trim()) {
      return res.status(400).json({ message: "Display name is required" });
    }

    if (!bio || !bio.trim()) {
      return res.status(400).json({ message: "Bio is required" });
    }

    const profile = await prisma.artistProfile.upsert({
      where: { creator_sub: userSub },
      update: {
        display_name: displayName.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl?.trim() || null,
        location: location?.trim() || null,
        website: website?.trim() || null,
        instagram: instagram?.trim() || null,
        is_published: typeof isPublished === "boolean" ? isPublished : true,
      },
      create: {
        creator_sub: userSub,
        display_name: displayName.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl?.trim() || null,
        location: location?.trim() || null,
        website: website?.trim() || null,
        instagram: instagram?.trim() || null,
        is_published: typeof isPublished === "boolean" ? isPublished : true,
      },
    });

    const artworksCount = await prisma.artwork.count({
      where: { creator_sub: userSub },
    });

    res.json(mapProfile(profile, artworksCount));
  } catch (error) {
    console.error("Error saving artist profile:", error);
    res.status(500).json({ message: "Failed to save artist profile" });
  }
};
