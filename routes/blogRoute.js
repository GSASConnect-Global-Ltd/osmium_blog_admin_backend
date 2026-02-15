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


// import { uploadBlogImages } from "../middleware/upload.js";

import { getCloudinaryParser } from "../middleware/cloudUpload.js";
const blogParser = getCloudinaryParser("blog_images");
const router = express.Router();

// Create blog (with 3 images)
// Old local storage upload: uploadBlogImages
// router.post("/", parser.array("images", 3), createBlog);
router.post("/", blogParser.array("images", 3), createBlog);


// Get all blogs
router.get("/", getBlogs);

// Dashboard stats
router.get("/dashboard", getDashboardStats);

// Get latest 3 blogs
router.get("/recent", getRecentBlogs);

// Get single blog by slug
router.get("/:slug", getBlogBySlug);

// Update blog by slug
// Old local storage upload: uploadBlogImages
// router.put("/:slug", parser.array("images", 3), updateBlogBySlug);


router.put("/:slug", blogParser.array("images", 3), updateBlogBySlug);


// Delete blog by slug
router.delete("/:slug", deleteBlogBySlug);

export default router;
