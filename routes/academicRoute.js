import express from "express";
import {
  createAcademic,
  getAcademics,
  getAcademic,
  updateAcademic,
  deleteAcademic,
} from "../controllers/academicController.js";

const router = express.Router();

router.post("/", createAcademic);
router.get("/", getAcademics);
router.get("/:id", getAcademic);
router.put("/:id", updateAcademic);
router.delete("/:id", deleteAcademic);

export default router;
