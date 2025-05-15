import { RecurringPayment } from "../models/recurringPayment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc    Create a new recurring payment
 * @route   POST /api/v1/recurring-payments
 * @access  Private
 */
// export const createRecurringPayment = asyncHandler(async (req, res) => {
//   const { name, amount, category, frequency, startDate, endDate, isActive } = req.body;

//   if (!name || !amount || !category || !frequency || !startDate) {
//     throw new ApiError(400, "Required fields: name, amount, category, frequency, startDate");
//   }

//   const recurringPayment = await RecurringPayment.create({
//     user: req.user._id,
//     name,
//     amount,
//     category,
//     frequency,
//     startDate,
//     endDate,
//     isActive
//   });

//   return res
//     .status(201)
//     .json(new ApiResponse(201, recurringPayment, "Recurring payment created successfully"));
// });
export const createRecurringPayment = asyncHandler(async (req, res) => {
  const { title, amount, category, frequency, startDate, endDate, isActive, notes } = req.body;

  if (!title || !amount || !category || !frequency || !startDate) {
    throw new ApiError(400, "Required fields: title, amount, category, frequency, startDate");
  }

  // Convert startDate string to Date object
  const start = new Date(startDate);
  let nextDueDate = new Date(start);

  // Auto-calculate nextDueDate
  switch (frequency) {
    case "Daily":
      nextDueDate.setDate(start.getDate() + 1);
      break;
    case "Weekly":
      nextDueDate.setDate(start.getDate() + 7);
      break;
    case "Monthly":
      nextDueDate.setMonth(start.getMonth() + 1);
      break;
    case "Yearly":
      nextDueDate.setFullYear(start.getFullYear() + 1);
      break;
    default:
      throw new ApiError(400, "Invalid frequency value");
  }

  const recurringPayment = await RecurringPayment.create({
    user: req.user._id,
    title,
    amount,
    category,
    frequency,
    startDate: start,
    endDate,
    nextDueDate,
    isActive,
    notes,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, recurringPayment, "Recurring payment created successfully"));
});

/**
 * @desc    Get all recurring payments for current user
 * @route   GET /api/v1/recurring-payments
 * @access  Private
 */
export const getAllRecurringPayments = asyncHandler(async (req, res) => {
  const payments = await RecurringPayment.find({ user: req.user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, payments, "Recurring payments fetched successfully"));
});

/**
 * @desc    Get a single recurring payment by ID
 * @route   GET /api/v1/recurring-payments/:id
 * @access  Private
 */
export const getRecurringPaymentById = asyncHandler(async (req, res) => {
  const payment = await RecurringPayment.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!payment) {
    throw new ApiError(404, "Recurring payment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Recurring payment fetched successfully"));
});

/**
 * @desc    Update a recurring payment
 * @route   PATCH /api/v1/recurring-payments/:id
 * @access  Private
 */
export const updateRecurringPayment = asyncHandler(async (req, res) => {
  const payment = await RecurringPayment.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );

  if (!payment) {
    throw new ApiError(404, "Recurring payment not found or not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Recurring payment updated successfully"));
});

/**
 * @desc    Delete a recurring payment
 * @route   DELETE /api/v1/recurring-payments/:id
 * @access  Private
 */
export const deleteRecurringPayment = asyncHandler(async (req, res) => {
  const payment = await RecurringPayment.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!payment) {
    throw new ApiError(404, "Recurring payment not found or not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Recurring payment deleted successfully"));
});
