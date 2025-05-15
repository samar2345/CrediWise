import { Router } from "express";
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require the user to be authenticated
router.use(verifyJWT);

// Create a new notification
router.route("/").post(createNotification);

// Get all notifications for current user
router.route("/").get(getUserNotifications);

// Mark a notification as read
router.route("/:id/read").patch(markNotificationAsRead);

// Delete a notification
router.route("/:id").delete(deleteNotification);

export default router;
