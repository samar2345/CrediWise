import { Insight } from "../models/insight.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc   Create a new insight
 * @route  POST /api/v1/insights
 * @access Private
 */
export const createInsight = asyncHandler(async (req, res) => {
  const { type, message, metadata } = req.body;

  if (!type || !message) {
    throw new ApiError(400, "Type and message are required");
  }

  const insight = await Insight.create({
    user: req.user._id,
    type,
    message,
    metadata,
  });

  return res.status(201).json(
    new ApiResponse(201, insight, "Insight created successfully")
  );
});

/**
 * @desc   Get all insights for the current user
 * @route  GET /api/v1/insights
 * @access Private
 */
export const getUserInsights = asyncHandler(async (req, res) => {
  const insights = await Insight.find({ user: req.user._id }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, insights, "Insights fetched successfully")
  );
});

/**
 * @desc   Mark an insight as read
 * @route  PATCH /api/v1/insights/:id/read
 * @access Private
 */
export const markInsightAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedInsight = await Insight.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!updatedInsight) {
    throw new ApiError(404, "Insight not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedInsight, "Insight marked as read")
  );
});

/**
 * @desc   Delete an insight
 * @route  DELETE /api/v1/insights/:id
 * @access Private
 */
export const deleteInsight = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Insight.findOneAndDelete({ _id: id, user: req.user._id });

  if (!deleted) {
    throw new ApiError(404, "Insight not found or not authorized");
  }

  return res.status(200).json(
    new ApiResponse(200, deleted, "Insight deleted successfully")
  );
});
