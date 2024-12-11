import asyncHandler from "express-async-handler";
import User from "../models/userSchema.js";
import generateToken from "../utils/generateToken.js";
import { OTP } from "../models/otpSchema.js";
import { OAuth2Client } from "google-auth-library";
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
  const { token } = req.body;

  console.log("hsdflkasdfljkasdfljksdljksldjkf");

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "1082671163898-isei5ie78erkjd5434c5i9umc4n18lom.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    generateToken(res, sub, "googleuser");
    res.status(201).json({
      sub,
      name,
      email,
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
});
