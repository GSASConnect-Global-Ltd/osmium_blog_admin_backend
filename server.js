import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { createMail } from "./services/mailServices.js";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoute.js";
import protectedRoutes from "./routes/protectedRoute.js";
import blogRoutes from "./routes/blogRoute.js";
import hiringRoutes from "./routes/hiringRoute.js";

dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const blogCollection = collections.find((c) => c.name === "blogs");

    if (blogCollection) {
      await mongoose.connection.db.collection("blogs").dropIndex("slug_1");
      console.log("✅ Dropped slug_1 index from blogs collection");
    }
  } catch (err) {
    if (err.codeName === "IndexNotFound") {
      console.log("ℹ️ slug_1 index not found (already removed)");
    } else {
      console.error("❌ Error dropping slug_1 index:", err.message);
    }
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://osmium-blog-admin.onrender.com",
      "https://osmium-latest.onrender.com",
      "https://orrel.com.ng"
    ],
    credentials: true,
  })
);

// Cookies
app.use(cookieParser());

// Static folder for uploads (CVs, documents, images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ------------------- EMAIL TEST ROUTE -------------------
app.post("/api/test-mail", async (req, res) => {
  try {
    const mail = await createMail({
      email: req.body.email || "oluwatosinissa2000@gmail.com", // fallback email
      subject: "🚀 Test Mail from Express + Mailtrap",
      template: "welcome", // must exist in /views/email/welcome.hbs
      context: {
        username: "Yusuf",
        appName: "Osmium Blog",
      },
      text: "This is a plain text test email.",
    });

    res.json({ message: "✅ Mail processed", mail });
  } catch (err) {
    console.error("❌ Mail test error:", err.message);
    res.status(500).json({ error: "Failed to send mail" });
  }
});
// --------------------------------------------------------

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/hirings", hiringRoutes);

// Protected routes
app.use("/api", protectedRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
