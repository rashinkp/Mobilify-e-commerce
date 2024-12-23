import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true, 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    type: {
      type: String,
      enum: ["Credit", "Debit"], 
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, 
    },
    description: {
      type: String,
      trim: true, 
    },
    status: {
      type: String,
      enum: ["Pending", "Successful", "Failed"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
  },
  {
    timestamps: true, 
  }
);


TransactionSchema.index({ walletId: 1, userId: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
