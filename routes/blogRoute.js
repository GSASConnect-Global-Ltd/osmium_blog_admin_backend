import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlogBySlug,
  deleteBlogBySlug,
  getDashboardStats,
  getRecentBlogs,
} from "../controllers/blogController.js";
import { uploadBlogImages } from "../middleware/upload.js";

const router = express.Router();

// Create blog (with 3 images)
router.post("/", uploadBlogImages, createBlog);

// Get all blogs
router.get("/", getBlogs);

// Dashboard stats
router.get("/dashboard", getDashboardStats);

// Get latest 3 blogs
router.get("/recent", getRecentBlogs);

// Get single blog by slug
router.get("/:slug", getBlogBySlug);

// Update blog by slug
router.put("/:slug", uploadBlogImages, updateBlogBySlug);

// Delete blog by slug
router.delete("/:slug", deleteBlogBySlug);

export default router;
