import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import protectedRoutes from "./routes/protectedRoute.js";
import blogRoutes from './routes/blogRoute.js';

dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  try {
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

// CORS
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://osmium-blog-admin.onrender.com",
    "https://osmium-latest.onrender.com"
  ],
  credentials: true
}));

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Cookies
app.use(cookieParser());

// ✅ Body parsers for JSON and URL-encoded (remove multipart check!)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Protected routes
app.use("/api", protectedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
