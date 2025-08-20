
// C:\express\osmium_blog_backend\osmium_blog_express_application\controllers\blogController.js

import mongoose from "mongoose";
import Blog from "../models/Blog.js";



// @desc    Create a new blog post
// @route   POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const { title, summary, author, date, readTime, category } = req.body;

    // Map uploaded files to paths
    const uploadedImages = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    // Ensure exactly 3 slots (fill missing ones with null)
    const images = [
      uploadedImages[0] || null,
      uploadedImages[1] || null,
      uploadedImages[2] || null,
    ];

    const blog = new Blog({
      title,
      summary,
      author,
      date,
      readTime,
      category,
      images,
    });

    await blog.save();

    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    console.error("❌ Blog creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all blog posts
// @route   GET /api/blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("❌ Error fetching blog:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// @desc    Update blog by ID
// @route   PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const { title, summary, author, date, readTime, category } = req.body;

    // Handle uploaded images (if any)
    const uploadedImages = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    // Find existing blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update text fields (only if provided)
    if (title) blog.title = title;
    if (summary) blog.summary = summary;
    if (author) blog.author = author;
    if (date) blog.date = date;
    if (readTime) blog.readTime = readTime;
    if (category) blog.category = category;

    // Update images (preserve old ones if not replaced)
    blog.images = [
      uploadedImages[0] || blog.images[0] || null,
      uploadedImages[1] || blog.images[1] || null,
      uploadedImages[2] || blog.images[2] || null,
    ];

    await blog.save();

    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("❌ Error updating blog:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @desc    Delete blog by ID
// @route   DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Get dashboard stats
// @route   GET /api/blogs/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // Count total posts
    const totalPosts = await Blog.countDocuments();

    // Get distinct authors and categories
    const authors = await Blog.distinct("author");
    const categories = await Blog.distinct("category");

    res.json({
      totalPosts,
      totalAuthors: authors.length,
      totalCategories: categories.length,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @desc    Get latest 3 posts (or all if less than 3)
// @route   GET /api/blogs/recent
export const getRecentBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 }) // latest first
      .limit(3); // get max 3

    res.json(blogs);
  } catch (error) {
    console.error("❌ Error fetching recent blogs:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

