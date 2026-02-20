import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  content: String,
  resources: [String],
  duration: Number,
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const academicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    instructor: String,
    thumbnail: String,
    modules: [moduleSchema],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Academic", academicSchema);
