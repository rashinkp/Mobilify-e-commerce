import asyncHandler from "express-async-handler";
import Review from "../models/reviewSchema.js";
import mongoose from "mongoose";

export const addReview = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { data, order } = req.body;
  const productId = order?.productId;

  if (order.status !== "Delivered") {
    return res
      .status(400)
      .json({ message: "Product purchase is not completed" });
  }

  const existingReview = await Review.findOne({ userId, productId });

  if (existingReview) {
    const updatedReview = await Review.findOneAndUpdate(
      { userId, productId },
      {
        rating: data?.rating,
        title: data?.title,
        description: data?.description,
      },
      { new: true }
    );
    return res.status(200).json({ message: "Review updated successfully" });
  }

  const review = await Review.create({
    userId,
    productId,
    rating: data?.rating,
    title: data?.title,
    description: data?.description,
  });

  res.status(201).json({ message: "Review posted successfully" });
});

export const getAReview = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const productId = req.params.id;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Invalid input credentials" });
  }

  try {
    const existingReview = await Review.findOne({ userId, productId });

    if (!existingReview) {
      return res.status(404).json({ data: null, message: "Review not found" });
    }

    res.status(200).json({ data: existingReview });
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

export const productReview = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  // Validate productId and convert to ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID received" });
  }
  const productObjectId = new mongoose.Types.ObjectId(productId);

  try {
    const productReviews = await Review.aggregate([
      {
        $match: { productId: productObjectId }, 
      },
      {
        $lookup: {
          from: "users", // Collection to join
          localField: "userId", // Field in Review collection
          foreignField: "_id", // Field in Users collection
          as: "userDetails", // Alias for the joined data
        },
      },
      {
        $unwind: {
          path: "$userDetails", 
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1, 
          productId: 1, 
          rating: 1, 
          title: 1,
          description: 1, 
          updatedAt:1,
          userInfo: {
            name: "$userDetails.name", 
            profilePicture: "$userDetails.picture.secure_url", 
          },
        },
      },
    ]);

    console.log(productReviews);
    res.status(200).json(productReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product reviews", error });
  }
});
