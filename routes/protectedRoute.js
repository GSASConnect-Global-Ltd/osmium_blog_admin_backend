// C:\express\osmium_blog_backend\osmium_blog_express_application\routes\protectedRoute.js

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Example: Protected test route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to the protected route 🚀",
    userId: req.user, // comes from decoded JWT
  });
});

export default router;
