import { Router } from "express";
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget
} from "../controllers/budget.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected routes – user must be logged in (verified with verifyJWT)
router.route("/")
  .post(verifyJWT, createBudget)
  .get(verifyJWT, getBudgets);

router.route("/:budgetId")
  .patch(verifyJWT, updateBudget)
  .delete(verifyJWT, deleteBudget);

export default router;
