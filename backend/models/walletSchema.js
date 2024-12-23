import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    balance: {
      type: Number,
      required: true,
      default: 0, 
      min: 0, 
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Suspended", "Closed"], 
      default: "Active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true, 
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

WalletSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

WalletSchema.index({ userId: 1 });

const Wallet = mongoose.model("Wallet", WalletSchema);

export default Wallet;
