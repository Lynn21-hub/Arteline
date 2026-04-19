const prisma = require("../lib/prisma");

const APPROVED_STATUS = "APPROVED";

const requireArtistProfile = async (req, res, next) => {
  try {
    const userSub = req.user?.sub;

    if (!userSub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await prisma.artistProfile.findUnique({
      where: { creator_sub: userSub },
      select: {
        application_status: true,
      },
    });

    const isApproved = profile?.application_status === APPROVED_STATUS;

    if (!isApproved) {
      return res.status(403).json({
        message: "Your artist application is not approved yet",
      });
    }

    return next();
  } catch (error) {
    console.error("requireArtistProfile error:", error);
    return res.status(500).json({ message: "Failed to validate artist profile" });
  }
};

module.exports = requireArtistProfile;
