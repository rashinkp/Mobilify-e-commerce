import asyncHandler from "express-async-handler";
import Referral from "../models/referralsSchema.js";
import { generateReferralCode } from "../utils/referralUtils.js";
import mongoose from "mongoose";
import User from "../models/userSchema.js";


export const createReferralCode = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const newReferralCode = generateReferralCode(userId);

  // Ensure the user does not already have a referral code
  const existingUser = await User.findOne({ _id: userId });
  if (existingUser.referralCode) {
    return res.status(400).json({
      success: false,
      message: "You already have a referral code.",
    });
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { referralCode: newReferralCode },
    { new: true }
  );

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "Failed to create referral code. Please try again.",
    });
  }


  // Send success response
  res.status(201).json({
    success: true,
    message: "Referral code generated successfully.",
    referralCode: newReferralCode,
  });
});



export const getUserReferrals = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const user = await User.findById(userId);

  const referralCode = user?.referralCode;

const userReferrals = await Referral.aggregate([
  { $match: { referrer: userObjectId } },
  {
    $lookup: {
      from: "users",
      localField: "referee",
      foreignField: "_id",
      pipeline: [{ $project: { email: 1, _id: 0 } }],
      as: "userDetails",
    },
  },
  {
    $project: {
      expiresAt: 1,
      referee: 1,
      status: 1,
      usedAt: 1,
      createdAt:1,
      userDetails: {
        $ifNull: [{ $arrayElemAt: ["$userDetails", 0] }, { email: null }],
      },
    },
  },
  { $sort: { createdAt: -1 } },
]);


  const referredBy = await Referral.aggregate([
    { $match: { referee: userObjectId } },
    {
      $lookup: {
        from: "users",
        localField: "referrer",
        foreignField: "_id",
        pipeline: [{ $project: { email: 1, _id: 0 } }],
        as: "referrerDetails",
      },
    },
  ]);

  const response = {
    referredBy: referredBy[0]?.referrerDetails || null,
    userReferrals,
    referralCode,
  };

  res.status(200).json(response);
});



export const getAllReferralData = asyncHandler(async (req, res) => {
  try {
    const referralData = await Referral.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "referrer",
          foreignField: "_id",
          as: "referrerDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "referee",
          foreignField: "_id",
          as: "refereeDetails",
        },
      },
      {
        $project: {
          reward: 1,
          "referrerDetails.email": 1,
          "refereeDetails.email": 1,
          "referrerDetails.referralCode": 1,
          createdAt: 1,
        },
      },
    ]);

    // Calculate totals
    let totalReferrals = 0;
    let totalRewardAmount = 0;

    const formattedData = referralData.map((item) => {
      const reward = item.reward || 0;
      totalReferrals += 1; // Increment for each referral
      totalRewardAmount += reward; // Sum up the reward

      return {
        reward: reward || "-",
        referrerEmail: item.referrerDetails?.[0]?.email || "N/A",
        refereeEmail: item.refereeDetails?.[0]?.email || "N/A",
        referralCode: item.referrerDetails?.[0]?.referralCode || "N/A",
        createdAt: item.createdAt,
      };
    });

    // Response
    res.status(200).json({
      success: true,
      totalReferrals,
      totalRewardAmount,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch referral data",
      error: error.message,
    });
  }
});
