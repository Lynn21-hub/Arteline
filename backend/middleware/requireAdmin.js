const requireAdmin = (req, res, next) => {
  try {
    const userSub = req.user?.sub;
    const adminSubs = (process.env.ADMIN_SUBS || "").split(",").map((s) => s.trim());

    if (!userSub || !adminSubs.includes(userSub)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    return next();
  } catch (error) {
    console.error("requireAdmin error:", error);
    return res.status(500).json({ message: "Failed to validate admin access" });
  }
};

module.exports = requireAdmin;
