import asyncHandler from "express-async-handler";
import User from "../models/userSchema.js";
import generateToken from "../utils/generateToken.js";
import { OTP } from "../models/otpSchema.js";
import { OAuth2Client } from "google-auth-library";
import otpGenerator from "otp-generator";
const client = new OAuth2Client(
  "1082671163898-isei5ie78erkjd5434c5i9umc4n18lom.apps.googleusercontent.com"
);

export const registerUser = asyncHandler(async (req, res) => {
  const { otp } = req.body.data;
  const { id } = req.body;

  const { otpId } = await User.findById(id);

  const response = await OTP.findById(otpId);

  if (!response) {
    res.status(400).json({ message: "otp not found resend it" });
  }

  const actualOtp = response.otp;

  if (actualOtp !== otp) {
    return res.status(400).json({
      success: false,
      message: "OTP is not matching",
    });
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    { $set: { isActive: true } },
    { new: true }
  );

  if (user) {
    const updatedUser = await User.findById(id);
    generateToken(res, updatedUser._id, "user");
    await OTP.findByIdAndDelete(otpId);
    await User.findByIdAndUpdate(id, { $unset: { otpId: "" } });
    res.status(201).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(400);
    console.log("Invalid user data");
    throw new Error("Invalid user data");
  }
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id, "user");
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    console.log("Invalid user name or password");
    throw new Error("Invalid user name or password");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.cookie("user", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "User Logout Successful" });
  } catch (err) {
    console.error("Error during admin logout:", error);

    throw new Error("Failed to log out admin");
  }
});

export const signWithGoogle = asyncHandler(async (req, res) => {
  const { email, name, picture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
      });
    }

    generateToken(res, user._id, "user");

    res.status(201).json({
      id: user._id,
      name: user.name, 
      email: user.email, 
    });
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



export const getUser = asyncHandler(async (req, res) => {
  const { userId:id } = req.user;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await User.findById(id);


    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching the user",
      error: error.message,
    });
  }
});


export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { name, occupation, bio, phoneNumber, dateOfBirth } = req.body;


  if (!userId) {
    return res.status(400).json({ message: "User id is not found" });
  }

  // Remove the incorrect `!data` check as `data` is not defined
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user fields only if they are provided
  if (name) user.name = name;
  if (occupation) user.occupation = occupation;
  if (bio) user.bio = bio;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;

  try {
    // Save the updated user document
    const updatedUser = await user.save();

    // Respond with the updated user, excluding sensitive information
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      occupation: updatedUser.occupation,
      bio: updatedUser.bio,
      phoneNumber: updatedUser.phoneNumber,
      dateOfBirth: updatedUser.dateOfBirth,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating user",
      error: error.message,
    });
  }
});