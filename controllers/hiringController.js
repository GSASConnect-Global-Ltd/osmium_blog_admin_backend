//C:\express\osmium_blog_backend\osmium_blog_express_application\controllers\hiringController.js

import { createMail } from "../services/mailServices.js";

import fs from "fs";
import path from "path";
import multer from "multer";
import Job from "../models/Job.js"; // Mongoose model
import Application from "../models/Application.js"; // Mongoose model for applications

// -------------------- Helper: ensure dir exists --------------------
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// -------------------- Multer Setup --------------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let uploadDir = path.join(process.cwd(), "uploads");

//     if (file.fieldname === "cv") {
//       uploadDir = path.join(uploadDir, "cv");
//     } else if (file.fieldname === "documents") {
//       uploadDir = path.join(uploadDir, "documents");
//     }

//     ensureDirExists(uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
//     cb(null, uniqueName);
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = path.join(process.cwd(), "uploads");

    if (file.fieldname === "cv") {
      uploadDir = path.join(uploadDir, "cv");
    } else if (file.fieldname === "documents") {
      uploadDir = path.join(uploadDir, "documents");
    }

    ensureDirExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate custom CV filename
    if (file.fieldname === "cv") {
      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const name = req.body.name.replace(/\s+/g, "_"); // sanitize applicant name
      const ext = path.extname(file.originalname); // keep original extension
      const customName = `CV-${date}-${name}${ext}`;
      cb(null, customName);
    } else {
      // For documents, keep previous logic
      const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
      cb(null, uniqueName);
    }
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
// export const applyJob = [
//   upload.fields([
//     { name: "cv", maxCount: 1 },
//     { name: "documents", maxCount: 5 },
//   ]),
//   async (req, res) => {
//     try {
//       const jobId = req.params.id;
//       const { name, email, phone, coverLetter } = req.body;

//       if (!name || !email || !phone || !coverLetter || !req.files?.cv) {
//         return res.status(400).json({ message: "Missing required fields" });
//       }

//       const application = new Application({
//         job: jobId,
//         name,
//         email,
//         phone,
//         coverLetter,
//         cv: req.files.cv[0].filename, // file stored in uploads/cv
//         documents: req.files.documents ? req.files.documents.map((f) => f.filename) : [], // files stored in uploads/documents
//       });

//       await application.save();
//       res.json({ message: "Application submitted successfully" });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error submitting application" });
//     }
//   },
// ];

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
        cv: req.files.cv[0].filename, // file stored in uploads/cv
        documents: req.files.documents
          ? req.files.documents.map((f) => f.filename)
          : [],
      });

      await application.save();

      // -------------------- EMAIL NOTIFICATION --------------------
      const cvLink = `${req.protocol}://${req.get("host")}/uploads/cv/${req.files.cv[0].filename}`;

      await createMail({
        email: process.env.HR_EMAIL || "hr@company.com", // recipient (HR/admin)
        subject: `New Job Application for Job ID: ${jobId}`,
        template: "application-received", // you need views/email/application-received.hbs
        context: {
          name,
          email,
          phone,
          coverLetter,
          cvLink, // ✅ include CV download link
        },
        text: `New application received.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCV: ${cvLink}\n\nCover Letter:\n${coverLetter}`,
      });
      // ------------------------------------------------------------

      res.json({ message: "Application submitted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error submitting application" });
    }
  },
];

// PUT /api/hirings/:id (edit job)
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,        // return updated document
        runValidators: true, // enforce schema validation
      }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(updatedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating job" });
  }
};

// GET /api/hirings/applications (HR/Admin)
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title department type location")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching applications" });
  }
};


