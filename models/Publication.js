import mongoose from "mongoose";

const publicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    authors: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    publicationDate: {
      type: Date,
      required: true,
    },

    abstract: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Publication", publicationSchema);
