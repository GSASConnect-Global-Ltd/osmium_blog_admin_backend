import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  getAllTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamController.js";

const router = express.Router();

// -------------------- ENSURE UPLOAD DIR EXISTS --------------------
const uploadDir = path.join(process.cwd(), "uploads", "team");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // create nested folders if not exist
  console.log("📂 Created uploads/team folder");
}

// -------------------- MULTER SETUP --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const now = new Date();
    const timestamp =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      "-" +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    const filename = `team-member-${timestamp}${ext}`;

    cb(null, filename);
  },
});


const upload = multer({ storage });

// -------------------- ROUTES --------------------
router.get("/", getAllTeamMembers);
router.get("/:id", getTeamMember);
router.post("/", upload.single("photo"), createTeamMember); // photo optional
router.put("/:id", upload.single("photo"), updateTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;
