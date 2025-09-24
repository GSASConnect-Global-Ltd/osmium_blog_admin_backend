//C:\express\osmium_blog_backend\osmium_blog_express_application\routes\hiringRoute.js
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
router.post("/:id", applyJob);

export default router;
