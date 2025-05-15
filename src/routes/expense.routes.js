import { Router } from "express";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} from "../controllers/expense.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
  .post(createExpense)
  .get(getAllExpenses);

router.route("/:id")
  .get(getExpenseById)
  .patch(updateExpense)
  .delete(deleteExpense);

export default router;
