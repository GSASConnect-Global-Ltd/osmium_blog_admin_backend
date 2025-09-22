import fs from "fs";
import path from "path";
import multer from "multer";
import Job from "../models/Job.js"; // Mongoose model
import Application from "../models/Application.js"; // Mongoose model for applications

// -------------------- Multer Setup --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

// -------------------- Jobs --------------------

// GET /api/hirings
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching jobs" });
  }
};

// GET /api/hirings/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalDepartments = await Job.distinct("department").then((d) => d.length);
    const totalTypes = await Job.distinct("type").then((t) => t.length);

    res.json({ totalJobs, totalDepartments, totalTypes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching dashboard stats" });
  }
};

// POST /api/hirings
export const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating job" });
  }
};

// POST /api/hirings/:id (apply)
export const applyJob = [
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const jobId = req.params.id;
      const { name, email, phone, coverLetter } = req.body;

      if (!name || !email || !phone || !coverLetter || !req.files?.cv) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const application = new Application({
        job: jobId,
        name,
        email,
        phone,
        coverLetter,
        cv: req.files.cv[0].filename,
        documents: req.files.documents ? req.files.documents.map((f) => f.filename) : [],
      });

      await application.save();
      res.json({ message: "Application submitted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error submitting application" });
    }
  },
];
