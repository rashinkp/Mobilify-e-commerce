import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentGateway: {
      type: String,
      required: true, // Example: 'razorpay'
    },
    paymentId: {
      type: String,
      required: true, // Razorpay payment ID
    },
    signature: {
      type: String,
      required: true, // Razorpay payment signature
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true, // Amount paid
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentDetails: {
      type: Object, // Store any additional payment details if needed
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
