import mongoose from "mongoose";
import User from "../models/userSchema.js";
import asyncHandler from 'express-async-handler'

export const addAddress = asyncHandler(async (req, res) => {
  const { userId:id } = req.user;
  const address = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    address._id = new mongoose.Types.ObjectId();
    const newUser = await User.updateOne(
      { _id: id },
      { $push: { addresses: address } }
    );

    if (newUser.modifiedCount === 0) {
      return res.status(400).json({
        message:
          "Something went wrong while updating address or no changes were made",
      });
    }
    res
      .status(200)
      .json({ message: "Address added successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the address",
      error: error.message,
    });
  }
});

export const getAddress = asyncHandler(async (req, res) => {
  const { userId:id } = req.user;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addresses = user?.addresses;

    return res.status(200).json({ addresses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while getting the address",
      error: error.message,
    });
  }
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  if (!id) {
    return res.status(400).json({ message: "Address id not found" });
  }

  try {
    const result = await User.updateOne(
      { _id: userId },
      { $pull: { addresses: { _id: id } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address removed successfully" });
  } catch (error) {
    console.error("Error removing address:", error);
    res.status(500).json({ message: "Failed to remove address" });
  }
});


export const updateAddress = asyncHandler(async (req, res) => {
  const { userId } = req.user; 
  const {data, addressId:id} = req.body; 


  if (!id) {
    return res.status(400).json({ message: "Address ID not found" });
  }

  if (!data) {
    return res.status(400).json({ message: "Address data is missing" });
  }

  try {
    const newAddress = await User.updateOne(
      { _id: userId, "addresses._id": id },
      {
        $set: Object.keys(data).reduce((acc, key) => {
          acc[`addresses.$.${key}`] = data[key];
          return acc;
        }, {}),
      }
    );

    if (newAddress.matchedCount === 0) {
      return res.status(404).json({ message: "Address not found" });
    }

    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating address", error });
  }
});
