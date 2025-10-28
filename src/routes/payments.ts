import { Router } from "express";
import {
  listPayments,
  createPayment,
} from "../controllers/paymentsController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, listPayments);
router.post("/", authenticate, createPayment);

export default router;
