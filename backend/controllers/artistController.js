const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendArtistApprovedEmail } = require("../services/emailService");

const APPLICATION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

const mapProfile = (profile, artworksCount = 0) => ({
  id: profile.id,
  creatorSub: profile.creator_sub,
  applicantEmail: profile.applicant_email,
  displayName: profile.display_name,
  bio: profile.bio,
  avatarUrl: profile.avatar_url,
  location: profile.location,
  website: profile.website,
  instagram: profile.instagram,
  applicationStatus: profile.application_status,
  reviewedAt: profile.reviewed_at,
  reviewedBy: profile.reviewed_by,
  rejectionReason: profile.rejection_reason,
  isPublished: profile.is_published,
  isFeatured: profile.is_featured,
  artworksCount,
  createdAt: profile.created_at,
  updatedAt: profile.updated_at,
});

exports.getFeaturedArtists = async (req, res) => {
  try {
    const profiles = await prisma.artistProfile.findMany({
      where: { is_published: true, application_status: APPLICATION_STATUS.APPROVED },
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
      where: { is_published: true, application_status: APPLICATION_STATUS.APPROVED },
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
    const userEmail = req.user?.email || null;
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

    const existingProfile = await prisma.artistProfile.findUnique({
      where: { creator_sub: userSub },
      select: {
        id: true,
        application_status: true,
      },
    });

    const shouldResetToPending =
      !existingProfile || existingProfile.application_status !== APPLICATION_STATUS.APPROVED;

    const profile = await prisma.artistProfile.upsert({
      where: { creator_sub: userSub },
      update: {
        applicant_email: userEmail,
        display_name: displayName.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl?.trim() || null,
        location: location?.trim() || null,
        website: website?.trim() || null,
        instagram: instagram?.trim() || null,
        is_published: typeof isPublished === "boolean" ? isPublished : true,
        ...(shouldResetToPending
          ? {
              application_status: APPLICATION_STATUS.PENDING,
              reviewed_at: null,
              reviewed_by: null,
              rejection_reason: null,
            }
          : {}),
      },
      create: {
        creator_sub: userSub,
        applicant_email: userEmail,
        display_name: displayName.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl?.trim() || null,
        location: location?.trim() || null,
        website: website?.trim() || null,
        instagram: instagram?.trim() || null,
        application_status: APPLICATION_STATUS.PENDING,
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

exports.getAdminArtistApplications = async (req, res) => {
  try {
    const status = String(req.query.status || APPLICATION_STATUS.PENDING).toUpperCase();

    const allowed = new Set([
      APPLICATION_STATUS.PENDING,
      APPLICATION_STATUS.APPROVED,
      APPLICATION_STATUS.REJECTED,
    ]);

    if (!allowed.has(status)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }

    const profiles = await prisma.artistProfile.findMany({
      where: { application_status: status },
      orderBy: [{ created_at: "desc" }],
    });

    const payload = await Promise.all(
      profiles.map(async (profile) => {
        const artworksCount = await prisma.artwork.count({
          where: { creator_sub: profile.creator_sub },
        });

        return mapProfile(profile, artworksCount);
      })
    );

    return res.json({ applications: payload });
  } catch (error) {
    console.error("Error fetching artist applications:", error);
    return res.status(500).json({ message: "Failed to fetch artist applications" });
  }
};

exports.approveArtistApplication = async (req, res) => {
  try {
    const adminSub = req.user?.sub;
    const profileId = Number(req.params.id);

    if (Number.isNaN(profileId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const existing = await prisma.artistProfile.findUnique({ where: { id: profileId } });
    if (!existing) {
      return res.status(404).json({ message: "Artist application not found" });
    }

    const updated = await prisma.artistProfile.update({
      where: { id: profileId },
      data: {
        application_status: APPLICATION_STATUS.APPROVED,
        reviewed_at: new Date(),
        reviewed_by: adminSub || null,
        rejection_reason: null,
      },
    });

    const emailResult = await sendArtistApprovedEmail({
      toEmail: updated.applicant_email,
      displayName: updated.display_name,
    });

    return res.json({
      message: "Artist application approved",
      emailSent: Boolean(emailResult.sent),
      emailReason: emailResult.reason || null,
      application: mapProfile(updated),
    });
  } catch (error) {
    console.error("Error approving artist application:", error);
    return res.status(500).json({ message: "Failed to approve artist application" });
  }
};

exports.rejectArtistApplication = async (req, res) => {
  try {
    const adminSub = req.user?.sub;
    const profileId = Number(req.params.id);
    const rejectionReason = String(req.body?.rejectionReason || "").trim() || null;

    if (Number.isNaN(profileId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const existing = await prisma.artistProfile.findUnique({ where: { id: profileId } });
    if (!existing) {
      return res.status(404).json({ message: "Artist application not found" });
    }

    const updated = await prisma.artistProfile.update({
      where: { id: profileId },
      data: {
        application_status: APPLICATION_STATUS.REJECTED,
        reviewed_at: new Date(),
        reviewed_by: adminSub || null,
        rejection_reason: rejectionReason,
      },
    });

    return res.json({
      message: "Artist application rejected",
      application: mapProfile(updated),
    });
  } catch (error) {
    console.error("Error rejecting artist application:", error);
    return res.status(500).json({ message: "Failed to reject artist application" });
  }
};
