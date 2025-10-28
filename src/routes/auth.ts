import { Router } from "express";
import { login } from "../controllers/authController.js";

const router = Router();

/**
 * @route POST /api/auth/login
 * @body { email, password }
 */
router.post("/login", login);

export default router;
