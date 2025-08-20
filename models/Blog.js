import mongoose from "mongoose";

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
      required: [true, "Content is required"], // ✅ main blog text
    },
    images: {
      type: [String], // array of image paths
      default: [null, null, null], // default 3 nulls
      validate: {
        validator: function (v) {
          return v.length === 3;
        },
        message: "Images array must always have length 3",
      },
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
