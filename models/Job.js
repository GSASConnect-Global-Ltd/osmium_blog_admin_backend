import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  department: String,
  location: String,
  type: String,
  summary: String,
  description: String,
  requirements: String,
  salaryRange: String,
  deadline: Date,
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
