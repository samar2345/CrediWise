import { Expense } from "../models/expense.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc    Create a new expense
 * @route   POST /api/v1/expenses
 * @access  Private
 */
export const createExpense = asyncHandler(async (req, res) => {
  const { category, amount, description, date, paymentMethod, isRecurring, recurringPayment } = req.body;

  if (!category || !amount) {
    throw new ApiError(400, "Category and amount are required.");
  }

  const expense = await Expense.create({
    user: req.user._id,
    category,
    amount,
    description,
    date,
    paymentMethod,
    isRecurring,
    recurringPayment: isRecurring ? recurringPayment : null,
  });

  res.status(201).json(new ApiResponse(201, expense, "Expense created successfully"));
});

/**
 * @desc    Get all expenses for logged-in user
 * @route   GET /api/v1/expenses
 * @access  Private
 */
export const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
  res.status(200).json(new ApiResponse(200, expenses, "All expenses fetched successfully"));
});

/**
 * @desc    Get single expense by ID
 * @route   GET /api/v1/expenses/:id
 * @access  Private
 */
export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  res.status(200).json(new ApiResponse(200, expense, "Expense fetched successfully"));
});

/**
 * @desc    Update an expense
 * @route   PATCH /api/v1/expenses/:id
 * @access  Private
 */
export const updateExpense = asyncHandler(async (req, res) => {
  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: req.body },
    { new: true }
  );

  if (!updatedExpense) {
    throw new ApiError(404, "Expense not found or unauthorized");
  }

  res.status(200).json(new ApiResponse(200, updatedExpense, "Expense updated successfully"));
});

/**
 * @desc    Delete an expense
 * @route   DELETE /api/v1/expenses/:id
 * @access  Private
 */
export const deleteExpense = asyncHandler(async (req, res) => {
  const deleted = await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!deleted) {
    throw new ApiError(404, "Expense not found or already deleted");
  }

  res.status(200).json(new ApiResponse(200, deleted, "Expense deleted successfully"));
});
