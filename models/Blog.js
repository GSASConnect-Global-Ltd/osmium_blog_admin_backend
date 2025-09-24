import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    images: {
      type: [String],
      default: [null, null, null],
      validate: {
        validator: function (v) {
          return v.length === 3;
        },
        message: "Images array must always have length 3",
      },
    },
    slug: {
      type: String,
      required: true,
      unique: true, // ensures no duplicate slugs
    },
  },
  { timestamps: true }
);

// Generate slug automatically before saving
blogSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
