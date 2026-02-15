import Blog from "../models/Blog.js";
import slugify from "slugify";

// -------------------- CREATE BLOG --------------------
export const createBlog = async (req, res) => {
  try {
    const { title, summary, author, date, content, category } = req.body;

    // Map Cloudinary URLs from req.files
    const images = req.files
      ? req.files.map((file) => file.path) // Cloudinary URL
      : [null, null, null];

    // Ensure 3 slots
    while (images.length < 3) images.push(null);

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

// -------------------- UPDATE BLOG --------------------
export const updateBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, summary, author, date, content, category } = req.body;

    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Update fields
    if (title) {
      blog.title = title;
      blog.slug = slugify(title, { lower: true, strict: true });
    }
    if (summary) blog.summary = summary;
    if (author) blog.author = author;
    if (date) blog.date = date;
    if (content) blog.content = content;
    if (category) blog.category = category;

    // Update images if uploaded
    if (req.files && req.files.length) {
      const imageSlots = req.body.imageSlots
        ? JSON.parse(req.body.imageSlots)
        : [];

      req.files.forEach((file, i) => {
        const slot = imageSlots[i] !== undefined ? imageSlots[i] : i;
        blog.images[slot] = file.path; // Cloudinary URL
      });
    }

    await blog.save();
    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("❌ Error updating blog:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// -------------------- CREATE BLOG --------------------
// export const createBlog = async (req, res) => {
//   try {
//     const { title, summary, author, date, content, category } = req.body;
//     const uploadedImages = req.files
//       ? req.files.map((file) => `/uploads/${file.filename}`)
//       : [];

//     const images = [
//       uploadedImages[0] || null,
//       uploadedImages[1] || null,
//       uploadedImages[2] || null,
//     ];

//     const blog = new Blog({
//       title,
//       summary,
//       author,
//       date,
//       content,
//       category,
//       images,
//       slug: slugify(title, { lower: true, strict: true }),
//     });

//     await blog.save();
//     res.status(201).json({ message: "Blog created successfully", blog });
//   } catch (error) {
//     console.error("❌ Blog creation error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

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



// export const updateBlogBySlug = async (req, res) => {
//   try {
//     const { slug } = req.params;
//     const { title, summary, author, date, content, category } = req.body;

//     // 🔹 Find blog FIRST
//     const blog = await Blog.findOne({ slug });
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     // 🔹 Update text fields
//     if (title) {
//       blog.title = title;
//       blog.slug = slugify(title, { lower: true, strict: true });
//     }
//     if (summary) blog.summary = summary;
//     if (author) blog.author = author;
//     if (date) blog.date = date;
//     if (content) blog.content = content;
//     if (category) blog.category = category;

//     // 🔹 Handle image slot updates
//     const imageSlots = req.body.imageSlots
//       ? JSON.parse(req.body.imageSlots)
//       : [];

//     if (req.files && imageSlots.length) {
//       req.files.forEach((file, i) => {
//         const slot = imageSlots[i];

//         if (slot !== undefined) {
//           blog.images[slot] = `/uploads/${file.filename}`;
//         }
//       });
//     }

//     await blog.save();

//     res.json(blog);
//   } catch (error) {
//     console.error("❌ Error updating blog:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


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
