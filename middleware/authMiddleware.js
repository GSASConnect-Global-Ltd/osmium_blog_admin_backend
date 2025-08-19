// C:\express\osmium_blog_backend\osmium_blog_express_application\middleware\authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.warn("⚠️ No token provided in Authorization header");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    console.log(`✅ Valid access token. User ID: ${decoded.id}`);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.warn("⏰ Access token expired");
    } else {
      console.warn("❌ Invalid token:", error.message);
    }
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
