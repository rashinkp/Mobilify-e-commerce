import asyncHandler from "express-async-handler";
import Wallet from "../models/walletSchema.js";
import Transaction from "../models/walletTransactionSchema.js";
import User from "../models/userSchema.js";

export const getOrCreateWallet = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    let wallet = await Wallet.findOne({ userId });

    // If wallet does not exist, create a new one
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
        transactions: [], // No transactions for a newly created wallet
      });
    }

    // Fetch transactions associated with the wallet
    const transactions = await Transaction.find({ walletId: wallet._id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("-__v"); // Exclude __v field from the response

    return res.status(200).json({
      message: "Wallet retrieved successfully.",
      wallet,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching or creating wallet:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export const addAmountToWallet = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { amount, paymentId, description = "" } = req.body;

  if (!userId || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Enter correct amount" });
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  const transaction = await Transaction.create({
    walletId: wallet._id,
    userId,
    type: "Credit",
    amount,
    description: description || "Funds added to wallet",
    status: "Successful",
    paymentId, 
  });

  wallet.balance += Number(amount);
  await wallet.save();

  res.status(200).json({
    message: "Amount added successfully",
    transaction,
    wallet: {
      balance: wallet.balance,
    },
  });
});



export const processTransaction = asyncHandler(async (req, res) => {
  const { userId } = req.user; 
  const { amount } = req.body; 

  console.log(amount, userId);

  // Validate input
  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({
      message: "Invalid input: userId and valid amount are required.",
    });
  }

  try {

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    console.log(wallet.balance);

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // Step 2: Deduct balance and save user data
    wallet.balance -= Number(amount);
    await wallet.save();

    // Step 3: Create and save transaction
    const transaction = new Transaction({
      userId,
      walletId: wallet._id,
      amount,
      type: "Debit",
      status: "Successful",
      date: new Date(),
      description: "Purchase using wallet",
    });

    await transaction.save();

    // Step 4: Send response
    res.status(200).json({
      message: "Transaction processed successfully.",
      balance: wallet.balance,
      transactionId: transaction._id,
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({
      message: "Failed to process transaction",
      error: error.message,
    });
  }
});






