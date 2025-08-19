//C:\express\osmium_blog_backend\osmium_blog_express_application\routes\authRoute.js
// authRoute.js
import express from "express";
import { register, login, refresh, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);   
router.post("/logout", logout);  

export default router;

