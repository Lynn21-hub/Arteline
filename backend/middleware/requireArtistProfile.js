const prisma = require("../lib/prisma");

const requireArtistProfile = async (req, res, next) => {
  try {
    const userSub = req.user?.sub;

    if (!userSub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await prisma.artistProfile.findUnique({
      where: { creator_sub: userSub },
      select: {
        display_name: true,
        bio: true,
      },
    });

    const isApproved = Boolean(profile?.display_name?.trim() && profile?.bio?.trim());

    if (!isApproved) {
      return res.status(403).json({
        message: "Please complete your artist application profile first",
      });
    }

    return next();
  } catch (error) {
    console.error("requireArtistProfile error:", error);
    return res.status(500).json({ message: "Failed to validate artist profile" });
  }
};

module.exports = requireArtistProfile;
