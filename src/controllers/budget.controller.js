import { Budget } from "../models/budget.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc    Create a new budget entry for the logged-in user
 * @route   POST /api/v1/budgets
 * @access  Private
 */
export const createBudget = asyncHandler(async (req, res) => {
  const { category, limit, period = "monthly", startDate, endDate, isRecurring = false } = req.body;

  if (!category || !limit || !startDate || !endDate) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const budget = await Budget.create({
    user: req.user._id,
    category: category.toLowerCase(),
    limit,
    period,
    startDate,
    endDate,
    isRecurring
  });

  return res.status(201).json(new ApiResponse(201, budget, "Budget created successfully"));
});

/**
 * @desc    Get all budgets for the logged-in user
 * @route   GET /api/v1/budgets
 * @access  Private
 */
export const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id }).sort({ startDate: -1 });
  return res.status(200).json(new ApiResponse(200, budgets, "Budgets fetched successfully"));
});

/**
 * @desc    Update an existing budget
 * @route   PUT /api/v1/budgets/:budgetId
 * @access  Private
 */
export const updateBudget = asyncHandler(async (req, res) => {
  const { budgetId } = req.params;
  const updates = req.body;

  const budget = await Budget.findOneAndUpdate(
    { _id: budgetId, user: req.user._id },
    { $set: updates },
    { new: true }
  );

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  return res.status(200).json(new ApiResponse(200, budget, "Budget updated successfully"));
});

/**
 * @desc    Delete a budget
 * @route   DELETE /api/v1/budgets/:budgetId
 * @access  Private
 */
export const deleteBudget = asyncHandler(async (req, res) => {
  const { budgetId } = req.params;

  const budget = await Budget.findOneAndDelete({ _id: budgetId, user: req.user._id });

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Budget deleted successfully"));
});
