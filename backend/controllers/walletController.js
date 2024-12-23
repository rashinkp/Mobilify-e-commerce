import asyncHandler from "express-async-handler";
import Wallet from "../models/walletSchema.js";
import Transaction from "../models/walletTransactionSchema.js";

export const getOrCreateWallet = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({
        userId,
        balance: 0,
        currency: "INR",
      });

      await wallet.save();
      return res.status(201).json({
        message: "Wallet created successfully.",
        wallet,
      });
    }

    return res.status(200).json({
      message: "Wallet retrieved successfully.",
      wallet,
    });
  } catch (error) {
    console.error("Error fetching or creating wallet:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export const addAmountToWallet = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { amount, description = "" } = req.body;

  // Validate input
  if (!userId || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  // Find the wallet
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  // Create a transaction
  const transaction = await Transaction.create({
    walletId: wallet._id,
    userId,
    type: "Credit",
    amount,
    description: description || "Funds added to wallet",
    status: "Successful",
  });

  // Update the wallet balance
  wallet.balance += amount;
  await wallet.save();

  res.status(200).json({
    message: "Amount added successfully",
    transaction,
    wallet: {
      balance: wallet.balance,
    },
  });
});
