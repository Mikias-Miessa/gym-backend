import { Router } from "express";
import {
  createPlan,
  listPlans,
  updatePlan,
  deletePlan,
} from "../controllers/plansController.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, listPlans);
router.use(authenticate, authorizeAdmin);
router.post("/", createPlan);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);

export default router;
