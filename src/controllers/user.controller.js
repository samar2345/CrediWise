import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

// Helper function to generate tokens and store the refreshToken in DB
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    // Save without validating the whole document (e.g., password field)
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

/**
 * @desc   Register a new user
 * @route  POST /api/v1/auth/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  // Validate input fields
  if ([fullName, username, email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if a user already exists with same username or email
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User already exists with given username or email");
  }

  // Handle avatar upload via Cloudinary
  // const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // let coverImageLocalPath;
  // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

  // if (!avatar || !avatar.url) {
  //   console.log("avatarLocalPath : ", avatarLocalPath);
  //   console.log("avatar", avatar);
  //   throw new ApiError(400, "Error uploading avatar");
  // }

  // Create a new user document
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    // avatar: avatar.url,
    // coverImage: coverImage && coverImage.url ? coverImage.url : ""
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Generate tokens for the new user
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  return res.status(201).json(
    new ApiResponse(201, { user: createdUser, accessToken, refreshToken }, "User registered successfully")
  );
});

/**
 * @desc   Log in an existing user
 * @route  POST /api/v1/auth/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  // Find user by email or username and include password for verification
  const user = await User.findOne({ $or: [{ username }, { email }] }).select("+password");
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true // Ensure this is set appropriately (e.g., in production)
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

/**
 * @desc   Log out the current user
 * @route  POST /api/v1/auth/logout
 * @access Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

/**
 * @desc   Refresh access token using refresh token
 * @route  POST /api/v1/auth/refresh
 * @access Public
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or has been used");
    }

    const options = { httpOnly: true, secure: true };
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

/**
 * @desc   Change current user's password
 * @route  PUT /api/v1/auth/change-password
 * @access Private
 */
export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confPassword } = req.body;

  if (newPassword !== confPassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }

  const user = await User.findById(req.user._id).select("+password");
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

/**
 * @desc   Get current logged in user's profile
 * @route  GET /api/v1/auth/me
 * @access Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

/**
 * @desc   Update account details (e.g., fullName, email)
 * @route  PUT /api/v1/auth/update-details
 * @access Private
 */
export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullName, email } },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, updatedUser, "Account details updated successfully"));
});

// export const updateUserAvatar=asyncHandler(async(req,res)=>{
//   const avatarLocalPath= req.file?.path
//   if(!avatarLocalPath){
//       throw new ApiError(400,"Avatar file necessary")
//   }

//   const avatar=uploadOnCloudinary(avatarLocalPath)
//   if(!avatar.url){
//       throw new ApiError(400,"Error whlle uploading avatar")
//   }

//   user=await User.findByIdAndUpdate(
//       req.user._id,
//       {
//           $set:{
//               avatar:avatar.url
//           }
//       },
//       {
//           new:true
//       }
//   )
//   //todo : delete the avatar image
//   return res
//   .status(200)
//   .json(
//       new ApiResponse(
//           200,
//           user,
//           "Avatar updated successfully"
//       )
//   )
// })

// export const updateUserCoverImage=asyncHandler(async(req,res)=>{
//   const coverImageLocalPath= req.file?.path
//   if(!coverImageLocalPath){
//       throw new ApiError(400,"Cover Image file necessary")
//   }

//   const coverImage=uploadOnCloudinary(coverImageLocalPath)
//   if(!coverImage.url){
//       throw new ApiError(400,"Error whlle uploading cover image")
//   }

//   const user=await User.findByIdAndUpdate(
//       req.user._id,
//       {
//           $set:{
//               coverImage:coverImage.url
//           }
//       },
//       {
//           new:true
//       }
//   )

//   return res
//   .status(200)
//   .json(
//       new ApiResponse(
//           200,
//           user,
//           "Cover image updated successfully"
//       )
//   )
// })


// Additional functionalities like updating avatar, cover image, etc., can be implemented similarly.

// export {
//   registerUser,
//   loginUser,
//   logoutUser,
//   refreshAccessToken,
//   changeCurrentPassword,
//   getCurrentUser,
//   updateAccountDetails
// };
