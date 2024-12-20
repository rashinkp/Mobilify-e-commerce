import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderSchema.js";
import Payment from "../models/paymentSchema.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_K5otU6Q5C8lSi8",
  key_secret: "kA9UF0UuzcJRFvCrRAb35bQb",
});

// Function to save payment details in database
export const savePayment = async (paymentData) => {
  try {
    const payment = new Payment(paymentData);
    await payment.save();
    return payment;
  } catch (error) {
    console.error("Error saving payment:", error);
    throw new Error("Error saving payment");
  }
};

export const verifyPayment = expressAsyncHandler(async (req, res) => {
  const { paymentId } = req.body;


  try {
    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);


    if (payment.captured) {
      return res.status(400).json({
        success: false,
        message: "Payment not captured",
      });
    }

    // Save payment details
    await savePayment({
      paymentId,
      amount: payment.amount,
      status: payment.status === "authorized" ? "Successful" : "failed",
      method: payment.method,
      timestamp: new Date(),
      paymentGateway: "Razorpay",
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
});
