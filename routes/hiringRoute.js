import express from "express";
import {
  getAllJobs,
  getDashboardStats,
  createJob,
  applyJob,
} from "../controllers/hiringController.js";

const router = express.Router();

// Jobs
router.get("/", getAllJobs);
router.get("/dashboard", getDashboardStats);
router.post("/", createJob);

// Job applications
router.post("/hirings/:id", applyJob);

export default router;
