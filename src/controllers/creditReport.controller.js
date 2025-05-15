import { CreditReport } from "../models/creditReport.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc    Create a new credit report for the logged-in user
 * @route   POST /api/v1/credit-report
 * @access  Private
 */
export const createCreditReport = asyncHandler(async (req, res) => {
  const {
    creditScore,
    paymentHistory,
    creditUtilization,
    creditMix,
    newCreditInquiries,
    lengthOfCreditHistory,
    date
  } = req.body;

  if (!creditScore) {
    throw new ApiError(400, "Credit score is required");
  }

  const report = await CreditReport.create({
    user: req.user._id,
    creditScore,
    paymentHistory,
    creditUtilization,
    creditMix,
    newCreditInquiries,
    lengthOfCreditHistory,
    date
  });

  return res
    .status(201)
    .json(new ApiResponse(201, report, "Credit report created successfully"));
});

/**
 * @desc    Fetch all credit reports for the logged-in user
 * @route   GET /api/v1/credit-report
 * @access  Private
 */
export const getUserCreditReports = asyncHandler(async (req, res) => {
  const reports = await CreditReport.find({ user: req.user._id }).sort({ date: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, reports, "Credit reports fetched successfully"));
});

/**
 * @desc    Get a specific credit report by ID
 * @route   GET /api/v1/credit-report/:id
 * @access  Private
 */
export const getCreditReportById = asyncHandler(async (req, res) => {
  const report = await CreditReport.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!report) {
    throw new ApiError(404, "Credit report not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Credit report fetched successfully"));
});

/**
 * @desc    Delete a credit report by ID
 * @route   DELETE /api/v1/credit-report/:id
 * @access  Private
 */
export const deleteCreditReport = asyncHandler(async (req, res) => {
  const report = await CreditReport.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!report) {
    throw new ApiError(404, "Credit report not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Credit report deleted successfully"));
});



/**
 * @desc    Update a credit report by ID
 * @route   PUT /api/v1/credit-report/:id
 * @access  Private
 */
export const updateCreditReport = asyncHandler(async (req, res) => {
  const report = await CreditReport.findOne({ _id: req.params.id, user: req.user._id });

  if (!report) {
    throw new ApiError(404, "Credit report not found");
  }

  const allowedUpdates = [
    "creditScore",
    "creditAccounts",
    "inquiries",
    "publicRecords",
    "totalDebt",
    "paymentHistory",
    "reportDate"
  ];

  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      report[key] = req.body[key];
    }
  }

  await report.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, report, "Credit report updated successfully")
    );
});
