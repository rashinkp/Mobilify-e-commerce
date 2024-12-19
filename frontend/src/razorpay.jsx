// import { useVerifyPaymentMutation } from "./redux/slices/paymentApiSlice";

// export const triggerRazorpayCheckout = (razorpayOrderData) => {
//   const [verifyPayment] = useVerifyPaymentMutation()
//   const options = {
//     key: "rzp_test_K5otU6Q5C8lSi8",
//     amount: razorpayOrderData.price,
//     currency: "INR",
//     order_id: razorpayOrderData.orderNumber, 
//     handler: async function (response) {
//       try {
//         const paymentId = response.razorpay_payment_id;
//         const orderId = razorpayOrderData.orderId; 
//         const verifyPaymentResponse = await verifyPayment({paymentId, orderId});

//         if (verifyPaymentResponse.success) {
//           successToast("Payment successful!");
//           navigate(`/user/orderSuccess/`);
//         } else {
//           errorToast("Payment verification failed. Please try again.");
//         }
//       } catch (error) {
//         errorToast("Error verifying payment. Please try again.");
//         console.log(error);
//       }
//     },
//     prefill: {
//       name: "Customer Name",
//       email: "customer@example.com",
//       contact: "9999999999",
//     },
//     theme: {
//       color: "#F37254",
//     },
//   };

//   const razorpay = new window.Razorpay(options);
//   razorpay.open();
// };


