import otpGenerator from "otp-generator";
import { OTP } from "../models/otpSchema.js";
import User from "../models/userSchema.js";

export const sendOTP = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    console.log(req.body);
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      isActive:false
    })


    const userId = user._id;

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

    const otpPayload = { otp, userId };
    const otpBody = await OTP.create(otpPayload);

    const otpId = otpBody._id
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otpId,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
