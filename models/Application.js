//C:\express\osmium_blog_backend\osmium_blog_express_application\models\Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  name: String,
  email: String,
  phone: String,
  coverLetter: String,
  cv: String,
  documents: [String],
  createdAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
