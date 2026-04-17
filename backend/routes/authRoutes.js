const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");

// Check if current authenticated user is admin
router.get("/is-admin", authMiddleware, (req, res) => {
  try {
    const userSub = req.user?.sub;
    console.log("Checking admin status for user sub:", userSub);
    console.log("ADMIN_SUBS env:", process.env.ADMIN_SUBS);
    
    const adminSubs = (process.env.ADMIN_SUBS || "").split(",").map((s) => s.trim());
    const isAdmin = userSub && adminSubs.includes(userSub);
    
    console.log("Admin subs list:", adminSubs);
    console.log("Is admin:", isAdmin);
    
    res.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Error checking admin status" });
  }
});

module.exports = router;
