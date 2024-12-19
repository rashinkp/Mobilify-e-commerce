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
  const { paymentId, orderId } = req.body;

  try {
    const razorpayPayment = await razorpay.orders.fetch(paymentId);

    if (razorpayPayment.status === "captured") {
      const order = await Order.findByIdAndUpdate(orderId, {
        status: "Paid",
        paymentDetails: razorpayPayment,
      });

      res.status(200).json({ message: "Payment successful and order updated" });
    } else {
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying payment", error: error.message });
  }
});
