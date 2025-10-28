import { Router } from "express";
import {
  createMember,
  listMembers,
  getMember,
  updateMember,
  deleteMember,
  renewSubscription,
} from "../controllers/membersController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, listMembers);
router.post("/", authenticate, createMember);
router.get("/:id", authenticate, getMember);
router.put("/:id", authenticate, updateMember);
router.delete("/:id", authenticate, deleteMember);
router.post("/:id/renew", authenticate, renewSubscription);

export default router;
