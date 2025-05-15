import { Router } from "express";
import {
  createGoal,
  getAllGoals,
  getGoalById,
  updateGoal,
  deleteGoal
} from "../controllers/goal.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createGoal).get(getAllGoals);
router.route("/:id").get(getGoalById).patch(updateGoal).delete(deleteGoal);

export default router;
