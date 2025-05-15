import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  // updateUserAvatar,
  // updateUserCoverImage
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verify } from "crypto";

const router = Router();

// Public routes
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/refreshToken").post(refreshAccessToken);

// Protected routes – user must be logged in (verified with verifyJWT)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh").post(verifyJWT, refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails); 
// router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
// router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

export default router;


// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   logoutUser,
//   refreshAccessToken,
//   changeCurrentPassword,
//   getCurrentUser,
//   updateAccountDetails,
//   updateUserAvatar,
//   updateUserCoverImage
// } from "../controllers/user.controller.js";

// const router = express.Router();

// // Register a new user
// router.post("/register", registerUser);

// // Log in an existing user
// router.post("/login", loginUser);

// // Log out the current user
// router.post("/logout", logoutUser);

// // Refresh access token using refresh token
// router.post("/refresh", refreshAccessToken);

// // Change the current user's password
// router.put("/change-password", changeCurrentPassword);

// // Get current logged in user's profile
// router.get("/me", getCurrentUser);

// // Update account details (fullName, email)
// router.put("/update-details", updateAccountDetails);

// // Update user's avatar (for example, after uploading a new image)
// router.put("/update-avatar", updateUserAvatar);

// // Update user's cover image
// router.put("/update-cover", updateUserCoverImage);

// export default router;


