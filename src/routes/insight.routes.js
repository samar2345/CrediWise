import { Router } from "express";
import {
  createInsight,
  getUserInsights,
  markInsightAsRead,
  deleteInsight
} from "../controllers/insight.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
  .post(createInsight)
  .get(getUserInsights);

router.route("/:id/read")
  .patch(markInsightAsRead);

router.route("/:id")
  .delete(deleteInsight);

export default router;
