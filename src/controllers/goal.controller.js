import { Goal } from "../models/goal.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc    Create a new goal
 * @route   POST /api/v1/goals
 * @access  Private
 */
export const createGoal = asyncHandler(async (req, res) => {
  const { name, targetAmount, currentAmount, deadline, category, isCompleted, notes } = req.body;

  if (!name || !targetAmount) {
    throw new ApiError(400, "Goal name and target amount are required");
  }

  const goal = await Goal.create({
    user: req.user._id,
    name,
    targetAmount,
    currentAmount: currentAmount || 0,
    deadline,
    category,
    isCompleted,
    notes,
  });

  return res.status(201).json(new ApiResponse(201, goal, "Goal created successfully"));
});

/**
 * @desc    Get all goals for current user
 * @route   GET /api/v1/goals
 * @access  Private
 */
export const getAllGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, goals, "Goals fetched successfully"));
});

/**
 * @desc    Get a single goal by ID
 * @route   GET /api/v1/goals/:id
 * @access  Private
 */
export const getGoalById = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  return res.status(200).json(new ApiResponse(200, goal, "Goal fetched successfully"));
});

/**
 * @desc    Update a goal
 * @route   PATCH /api/v1/goals/:id
 * @access  Private
 */
export const updateGoal = asyncHandler(async (req, res) => {
  const updates = req.body;

  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true }
  );

  if (!goal) {
    throw new ApiError(404, "Goal not found or not authorized");
  }

  return res.status(200).json(new ApiResponse(200, goal, "Goal updated successfully"));
});

/**
 * @desc    Delete a goal
 * @route   DELETE /api/v1/goals/:id
 * @access  Private
 */
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) {
    throw new ApiError(404, "Goal not found or already deleted");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Goal deleted successfully"));
});
