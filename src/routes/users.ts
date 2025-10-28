import { Router } from "express";
import {
  createUser,
  listUsers,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.post("/", createUser);
router.get("/", listUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
