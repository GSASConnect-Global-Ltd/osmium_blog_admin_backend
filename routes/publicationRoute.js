import express from "express";
import {
  createPublication,
  getPublications,
  getPublication,
  updatePublication,
  deletePublication,
} from "../controllers/publicationController.js";

const router = express.Router();

router.post("/", createPublication);
router.get("/", getPublications);
router.get("/:id", getPublication);
router.put("/:id", updatePublication);
router.delete("/:id", deletePublication);

export default router;
