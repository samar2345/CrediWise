import { Notification } from "../models/notification.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc    Create a new notification
 * @route   POST /api/v1/notifications
 * @access  Private
 */
export const createNotification = asyncHandler(async (req, res) => {
  const { type, title, message, actionUrl } = req.body;

  if (!type || !title || !message) {
    throw new ApiError(400, "Type, title, and message are required fields");
  }

  const notification = await Notification.create({
    user: req.user._id,
    type,
    title,
    message,
    actionUrl
  });

  return res.status(201).json(new ApiResponse(201, notification, "Notification created successfully"));
});

/**
 * @desc    Get all notifications for current user
 * @route   GET /api/v1/notifications
 * @access  Private
 */
export const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/v1/notifications/:id/read
 * @access  Private
 */
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found or not authorized");
  }

  return res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/v1/notifications/:id
 * @access  Private
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndDelete({ _id: id, user: req.user._id });

  if (!notification) {
    throw new ApiError(404, "Notification not found or not authorized");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Notification deleted successfully"));
});
