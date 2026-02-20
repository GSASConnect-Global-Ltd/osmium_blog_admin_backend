// controllers/hiringController.js

import { createMail } from "../services/mailServices.js";
import { getCloudinaryParser } from "../middleware/cloudUpload.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// -------------------- Jobs --------------------

// GET all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching jobs" });
  }
};

// GET dashboard stats
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

// CREATE a job
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

// UPDATE a job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) return res.status(404).json({ message: "Job not found" });

    res.json(updatedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating job" });
  }
};

// GET all applications
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

// -------------------- Apply to a job --------------------
// export const applyJob = [
//   getCloudinaryParser("job-applications").fields([
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

//       const cvUrl = req.files.cv[0].path;
//       const documentsUrls = req.files.documents
//         ? req.files.documents.map((file) => file.path)
//         : [];

//       const application = new Application({
//         job: jobId,
//         name,
//         email,
//         phone,
//         coverLetter,
//         cv: cvUrl,
//         documents: documentsUrls,
//       });

//       await application.save();

//       await createMail({
//         email: process.env.HR_EMAIL || "hr@company.com",
//         subject: `New Job Application`,
//         template: "application-received",
//         context: { name, email, phone, coverLetter, cvLink: cvUrl },
//         text: `New application received.\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCV: ${cvUrl}\n\nCover Letter:\n${coverLetter}`,
//       });

//       res.json({ message: "Application submitted successfully" });
//     } catch (err) {
//       console.error("❌ Error submitting application:", err);
//       res.status(500).json({ message: "Server error submitting application" });
//     }
//   },
// ];
  

export const applyJob = [
  getCloudinaryParser("job-applications").fields([
    { name: "cv", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),

  async (req, res, next) => {
    console.log("📥 applyJob hit");

    try {
      console.log("📦 req.body:", req.body);
      console.log("📁 req.files:", req.files);
      console.log("🆔 jobId:", req.params.id);

      const jobId = req.params.id;
      const { name, email, phone, coverLetter } = req.body;

      if (!name || !email || !phone || !coverLetter) {
        console.warn("⚠️ Missing text fields");
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!req.files || !req.files.cv) {
        console.warn("⚠️ CV not uploaded");
        return res.status(400).json({ message: "CV file is required" });
      }

      const cvUrl = req.files.cv[0].path;
      console.log("📄 CV URL:", cvUrl);

      const documentsUrls = req.files.documents
        ? req.files.documents.map((file) => file.path)
        : [];

      console.log("📎 Documents URLs:", documentsUrls);

      const application = new Application({
        job: jobId,
        name,
        email,
        phone,
        coverLetter,
        cv: cvUrl,
        documents: documentsUrls,
      });

      console.log("💾 Saving application...");
      await application.save();
      console.log("✅ Application saved");

      console.log("📧 Sending mail...");
      await createMail({
        email: process.env.HR_EMAIL || "hr@company.com",
        subject: "New Job Application",
        template: "application-received",
        context: {
          name,
          email,
          phone,
          coverLetter,
          cvLink: cvUrl,
        },
        text: `New application received`,
      });
      console.log("✅ Mail sent");

      res.json({ message: "Application submitted successfully" });

    } catch (err) {
      console.error("❌ Error inside applyJob:", err);
      next(err); // IMPORTANT: forward to global handler
    }
  },
];
