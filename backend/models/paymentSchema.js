import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    paymentGateway: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "Successful", "failed"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentDetails: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
