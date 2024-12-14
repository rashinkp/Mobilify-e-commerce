import otpGenerator from "otp-generator";
import { OTP } from "../models/otpSchema.js";
import User from "../models/userSchema.js";
import asyncHandler from "express-async-handler";

export const sendOTP = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { otp, email };
    const otpBody = await OTP.create(otpPayload);

    const otpId = otpBody._id;


    const user = await User.create({
      name,
      email,
      password,
      otpId,
      isActive: false,
    });

    const userId = user._id;

    
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      userId,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};




export const resendOTP = asyncHandler(async (req, res) => {
  const { id:userId } = req.body;

  console.log(userId)

  if (!userId) {
    return res.status(400).json({ message: "No userid found pealease login again" });
  }

  try {
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const { email } = await User.findById(userId);


    const otpPayload = { otp, email };
    const otpBody = await OTP.create(otpPayload);


    const otpId = otpBody._id;

    const updatedUser = await User.findByIdAndUpdate(userId , { $set: { otpId: otpId } })


    
    
    console.log(updatedUser);

    res.status(200).json({
      success: true,
      message: "OTP resend successfully",
      otpId,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { otp } = req.body;

  const { otpId } = await User.findById(userId);

  const otpEntry = await OTP.findById(otpId);


  console.log('otpid',otpId,'otpentry', otpEntry)
  

  if (!otpEntry) {
    return res.status(400).json({message:"Invalid or expired OTP"});
  }


  if (otpEntry.otp !== otp) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404);
    throw new Error("User not found");
  }

  user.email = otpEntry.email; 
  user.status = "active";
  await user.save();

  await OTP.deleteOne({ _id: otpEntry._id });

  res.status(200).json({ message: "Email updated successfully", user });
});

