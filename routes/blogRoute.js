import express from "express";
import { createBlog, getBlogs, getBlogById, deleteBlog, updateBlog, getDashboardStats, getRecentBlogs } from "../controllers/blogController.js";
import { uploadBlogImages } from "../middleware/upload.js";

const router = express.Router();

router.post("/", uploadBlogImages, createBlog); // ✅ create blog with 3 images
router.get("/", getBlogs);
router.get("/dashboard", getDashboardStats); // ✅ get dashboard stats
router.get("/recent", getRecentBlogs);
router.get("/:id", getBlogById);
router.put("/:id", uploadBlogImages, updateBlog); // ✅ update blog
router.delete("/:id", deleteBlog);


export default router;
