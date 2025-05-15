import { Recommendation } from "../models/recommendation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc   Create a new recommendation for the user
 * @route  POST /api/v1/recommendations
 * @access Private
 */
export const createRecommendation = asyncHandler(async (req, res) => {
  const { type, message, actionUrl, scoreImpact } = req.body;

  if (!type || !message) {
    throw new ApiError(400, "Recommendation type and message are required");
  }

  const recommendation = await Recommendation.create({
    user: req.user._id,
    type,
    message,
    actionUrl,
    scoreImpact,
  });

  return res.status(201).json(
    new ApiResponse(201, recommendation, "Recommendation created successfully")
  );
});

/**
 * @desc   Get all recommendations for the logged-in user
 * @route  GET /api/v1/recommendations
 * @access Private
 */
export const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await Recommendation.find({ user: req.user._id });

  return res.status(200).json(
    new ApiResponse(200, recommendations, "Recommendations fetched successfully")
  );
});

/**
 * @desc   Dismiss a recommendation
 * @route  PATCH /api/v1/recommendations/:id/dismiss
 * @access Private
 */
export const dismissRecommendation = asyncHandler(async (req, res) => {
  const recommendation = await Recommendation.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isDismissed: true },
    { new: true }
  );

  if (!recommendation) {
    throw new ApiError(404, "Recommendation not found");
  }

  return res.status(200).json(
    new ApiResponse(200, recommendation, "Recommendation dismissed")
  );
});

/**
 * @desc   Delete a recommendation
 * @route  DELETE /api/v1/recommendations/:id
 * @access Private
 */
export const deleteRecommendation = asyncHandler(async (req, res) => {
  const recommendation = await Recommendation.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!recommendation) {
    throw new ApiError(404, "Recommendation not found or already deleted");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Recommendation deleted successfully")
  );
});
