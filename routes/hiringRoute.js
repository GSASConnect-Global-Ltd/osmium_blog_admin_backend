import express from "express";
import {
  getAllJobs,
  getDashboardStats,
  createJob,
  applyJob,
} from "../controllers/hiringController.js";

const router = express.Router();

// Jobs
router.get("/hirings", getAllJobs);
router.get("/hirings/dashboard", getDashboardStats);
router.post("/hirings", createJob);

// Job applications
router.post("/hirings/:id", applyJob);

export default router;
