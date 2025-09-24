import Blog from "../models/Blog.js";
import slugify from "slugify";

// -------------------- CREATE BLOG --------------------
export const createBlog = async (req, res) => {
  try {
    const { title, summary, author, date, content, category } = req.body;
    const uploadedImages = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

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
      content,
      category,
      images,
      slug: slugify(title, { lower: true, strict: true }),
    });

    await blog.save();
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    console.error("❌ Blog creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- GET ALL BLOGS --------------------
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- GET BLOG BY SLUG --------------------
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (error) {
    console.error("❌ Error fetching blog:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- UPDATE BLOG BY SLUG --------------------
export const updateBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, summary, author, date, content, category } = req.body;
    const uploadedImages = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (title) {
      blog.title = title;
      blog.slug = slugify(title, { lower: true, strict: true });
    }
    if (summary) blog.summary = summary;
    if (author) blog.author = author;
    if (date) blog.date = date;
    if (content) blog.content = content;
    if (category) blog.category = category;

    blog.images = [
      uploadedImages[0] || blog.images[0] || null,
      uploadedImages[1] || blog.images[1] || null,
      uploadedImages[2] || blog.images[2] || null,
    ];

    await blog.save();

    // ✅ Return only the updated blog
    res.json(blog);
  } catch (error) {
    console.error("❌ Error updating blog:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- DELETE BLOG BY SLUG --------------------
export const deleteBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting blog:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- DASHBOARD STATS --------------------
export const getDashboardStats = async (req, res) => {
  try {
    const totalPosts = await Blog.countDocuments();
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

// -------------------- RECENT BLOGS --------------------
export const getRecentBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(3);

    res.json(blogs);
  } catch (error) {
    console.error("❌ Error fetching recent blogs:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
