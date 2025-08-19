import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import protectedRoutes from "./routes/protectedRoute.js";
import blogRoutes from './routes/blogRoute.js';
import path from "path";

dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  try {
    // Try to drop old slug index if it exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const blogCollection = collections.find(c => c.name === "blogs");

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

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "https://osmium-blog-admin.onrender.com","https://osmium-latest.onrender.com"], // frontend URL
  credentials: true
}));

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cookieParser());

// ✅ Body parsers
app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  if (contentType.startsWith("multipart/form-data")) {
    // let multer handle file uploads
    return next();
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return express.urlencoded({ extended: true })(req, res, next);
  }

  // default: JSON
  return express.json()(req, res, next);
});

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Protected routes (requires authentication)
app.use("/api", protectedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
