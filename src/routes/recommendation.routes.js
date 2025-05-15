import { Router } from "express";
import {
  createRecommendation,
  getRecommendations,
  dismissRecommendation,
  deleteRecommendation,
} from "../controllers/recommendation.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
  .post(createRecommendation)
  .get(getRecommendations);

router.route("/:id/dismiss").patch(dismissRecommendation);
router.route("/:id").delete(deleteRecommendation);

export default router;
