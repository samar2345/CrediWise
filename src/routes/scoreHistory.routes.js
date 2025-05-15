import { Router } from "express";
import {
  addScoreEntry,
  getScoreHistory
} from "../controllers/scoreHistory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @route   /api/v1/score-history
 * @access  Private (JWT Protected)
 */
router
  .route("/")
  .post(verifyJWT, addScoreEntry)
  .get(verifyJWT, getScoreHistory);

export default router;
