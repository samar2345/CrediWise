import { ScoreHistory } from "../models/scoreHistory.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc    Add a new score history entry for the logged-in user
 * @route   POST /api/v1/score-history
 * @access  Private
 */
export const addScoreEntry = asyncHandler(async (req, res) => {
  const { score, source = "simulation", notes, metadata } = req.body;

  if (typeof score !== "number") {
    throw new ApiError(400, "Score must be a number");
  }

  const entry = await ScoreHistory.create({
    user: req.user._id,
    score,
    source,
    notes,
    metadata
  });

  return res
    .status(201)
    .json(new ApiResponse(201, entry, "Score history entry added successfully"));
});

/**
 * @desc    Get all score history entries for the logged-in user
 * @route   GET /api/v1/score-history
 * @access  Private
 */
export const getScoreHistory = asyncHandler(async (req, res) => {
  const history = await ScoreHistory.find({ user: req.user._id }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, history, "Score history fetched successfully"));
});
