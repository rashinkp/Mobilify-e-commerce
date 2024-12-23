import { useCallback } from "react";
import { useNavigate } from "react-router";
import { errorToast, successToast } from "../components/toast";

export const useRazorpay = (verifyPayment, placeOrder) => {
  const navigate = useNavigate();

  const handleRazorpaySuccess = useCallback(
    async (razorpayOrderData, response) => {
      try {
        const paymentId = response.razorpay_payment_id;
        const orderId = razorpayOrderData.orderId;

        const verifyPaymentResponse = await verifyPayment({
          paymentId,
        });

        if (verifyPaymentResponse) {
          const orderResponse = await placeOrder({
            ...razorpayOrderData,
            paymentId,
            paymentStatus: "Successful",
          });

          if (!orderResponse) {
            errorToast("Failed to create order. Please try again.");
            return;
          }
          successToast("Payment successful!");
          navigate(`/user/orderSuccess`);
        } else {
          errorToast("Payment verification failed. Please try again.");
        }
      } catch (error) {
        errorToast("Error processing payment. Please try again.");
        console.error("Payment error:", error);
      }
    },
    [verifyPayment, placeOrder, navigate]
  );

  const triggerRazorpayCheckout = useCallback(
    (razorpayOrderData) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_K5otU6Q5C8lSi8",
        amount: razorpayOrderData.total * 100,
        currency: "INR",
        order_id: razorpayOrderData.orderNumber,
        handler: (response) =>
          handleRazorpaySuccess(razorpayOrderData, response),
        prefill: {
          name: razorpayOrderData.customerName || "",
          email: razorpayOrderData.email || "",
          contact: razorpayOrderData.phone || "",
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: () => {
            errorToast("Payment cancelled. Please try again.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    },
    [handleRazorpaySuccess]
  );

  return { triggerRazorpayCheckout };
};
