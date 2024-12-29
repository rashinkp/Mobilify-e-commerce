import React, { useCallback, useEffect, useState } from "react";
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  Tag,
  ShoppingCart,
  Settings,
  Plane,
  Navigation,
  Home,
  X,
  RefreshCcw,
  AlertTriangle,
  Recycle,
  Download,
  HandCoins,
  Calendar,
} from "lucide-react";
import {
  useChangeOrderStatusMutation,
  useGetSingleOrderQuery,
} from "../../redux/slices/orderApiSlice";
import { useNavigate, useParams } from "react-router";
import { RotatingLines } from "react-loader-spinner";
import { errorToast, successToast } from "../../components/toast";
import { useGetProductQuery } from "../../redux/slices/productApiSlice";
import CancelConfirmation from "../../components/cancelConfirmation";
import jsPDF from "jspdf";
import { handleDownloadInvoice } from "../../components/downloadInvoice";
import PriceBreakdown from "../../components/Billing";
import { useVerifyPaymentMutation } from "../../redux/slices/paymentApiSlice";


const OrderDetailsPage = () => {
  // State for managing order actions
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [orderCancelled, setOrderCancelled] = useState(false);
  const [confirmReturn, setConfirmReturn] = useState(false);
  const [verifyPayment] = useVerifyPaymentMutation();
  const navigate = useNavigate()


  const { ordId: orderId } = useParams();

  const { data, isLoading, isError, error, refetch } = useGetSingleOrderQuery({
    orderId,
  });

  const [changeStatus] = useChangeOrderStatusMutation();

  const order = data || {};

  const orderDate = new Date(order.orderDate);

  const returnAvailableDate = new Date(orderDate);
  returnAvailableDate.setDate(orderDate.getDate() + 7);

  const currentDate = new Date();

  const isReturnActive = currentDate <= returnAvailableDate;

  const formattedDate = returnAvailableDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Dynamic order stages mapping
  const orderStageMapper = {
    Pending: [
      { label: "Order Placed", completed: true, Icon: ShoppingCart },
      { label: "Processing", completed: false, Icon: Settings },
      { label: "Shipped", completed: false, Icon: Plane },
      { label: "Out for Delivery", completed: false, Icon: Navigation },
      { label: "Delivered", completed: false, Icon: Home },
    ],
    Processing: [
      { label: "Order Placed", completed: true, Icon: ShoppingCart },
      { label: "Processing", completed: true, Icon: Settings },
      { label: "Shipped", completed: false, Icon: Plane },
      { label: "Out for Delivery", completed: false, Icon: Navigation },
      { label: "Delivered", completed: false, Icon: Home },
    ],
    Shipped: [
      { label: "Order Placed", completed: true, Icon: ShoppingCart },
      { label: "Processing", completed: true, Icon: Settings },
      { label: "Shipped", completed: true, Icon: Plane },
      { label: "Out for Delivery", completed: false, Icon: Navigation },
      { label: "Delivered", completed: false, Icon: Home },
    ],
    "Out for delivery": [
      { label: "Order Placed", completed: true, Icon: ShoppingCart },
      { label: "Processing", completed: true, Icon: Settings },
      { label: "Shipped", completed: true, Icon: Plane },
      { label: "Out for Delivery", completed: true, Icon: Navigation },
      { label: "Delivered", completed: false, Icon: Home },
    ],
    Delivered: [
      { label: "Order Placed", completed: true, Icon: ShoppingCart },
      { label: "Processing", completed: true, Icon: Settings },
      { label: "Shipped", completed: true, Icon: Plane },
      { label: "Out for Delivery", completed: true, Icon: Navigation },
      { label: "Delivered", completed: true, Icon: Home },
    ],
    Cancelled: [
      { label: "Order Placed", completed: true, Icon: ShoppingCart },
      { label: "Cancelled", completed: true, Icon: X },
      { label: "Closed", completed: true, Icon: Home },
    ],
  };

  // Determine current order stages based on status
  const orderStages =
    orderStageMapper[order.status] || orderStageMapper["Pending"];

  // Handler for cancel order
  const handleCancelOrder = async () => {
    try {
      await changeStatus({ newStatus: "Cancelled", orderId }).unwrap();

      // Update the local state after successful API call
      // setOrderItems((prevItems) =>
      //   prevItems.map((item) =>
      //     item.id === productId ? { ...item, status: newStatus } : item
      //   )
      // );

      successToast("Order cancelled successfully");
    } catch (error) {
      errorToast(
        error?.message ||
          error?.data?.message ||
          "Error while updating order status"
      );
      console.log(error);
    } finally {
      setShowCancelConfirmation(false);
    }
  };

  const handleReturn = async () => {
    try {
      await changeStatus({ newStatus: "Returned", orderId }).unwrap();
      successToast("Order returned successfully");
    } catch (error) {
      errorToast(
        error?.message ||
          error?.data?.message ||
          "Error while updating order status"
      );
      console.log(error);
    } finally {
      setConfirmReturn(false);
    }
  };


   const handleRazorpaySuccess = useCallback(
     async (razorpayOrderData, response) => {
       console.log(razorpayOrderData);
        try {
          const paymentId = response.razorpay_payment_id;
          const orderId = razorpayOrderData._id;
  
          const verifyPaymentResponse = await verifyPayment({
            paymentId,
          });
  
          if (verifyPaymentResponse) {
            await changeStatus({
              orderId,
              newPaymentStatus: "Successful",
              newStatus: razorpayOrderData?.status,
              paymentId,
              orderData:razorpayOrderData,
            }).unwrap();

            successToast("Payment successful!");
          } else {
            errorToast("Payment verification failed. Please try again.");
          }
        } catch (error) {
          errorToast("Error processing payment. Please try again.");
          console.error("Payment error:", error);
        }
      },
      [verifyPayment, navigate]
    );


  const triggerRazorpayCheckout = useCallback(
    (razorpayOrderData) => {
      const finalPrice = razorpayOrderData.price * razorpayOrderData?.quantity;
      const options = {
        key: "rzp_test_K5otU6Q5C8lSi8",
        amount: Math.round(finalPrice * 100),
        currency: "INR",
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

      try {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error("Razorpay initialization error:", error);
        errorToast("Failed to initialize payment. Please try again.");
      }
    },
    [handleRazorpaySuccess]
  );

  const handlePayNow = async () => {
    if (!order.price || order.price <= 0) {
      errorToast("Invalid amount");
      return;
    }
    await triggerRazorpayCheckout(order);
  };

  const isCancelDisabled =
    orderCancelled ||
    ["Delivered", "Cancelled", "Out for Delivery"].includes(order.status) ||
    order.status === "Returned";

  const isReturnDisabled = !["Delivered", "Shipped"].includes(order.status);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
        <RotatingLines
          visible={true}
          height="50"
          width="50"
          color="grey"
          strokeColor="#fff"
          strokeWidth="2"
          animationDuration="8"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }

  

  return (
    <>
      {confirmReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center mb-4 text-yellow-500">
              <Recycle className="mr-3 w-6 h-6" />
              <h3 className="text-xl font-bold dark:text-white">
                Return Order?
              </h3>
            </div>
            <p className="mb-4 dark:text-gray-300">
              Are you sure you want to return this order? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmReturn(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-white rounded-md hover:bg-gray-300"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleReturn}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Yes, Return Order
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto p-6 min-h-screen">
        <div className="mx-auto bg-white dark:bg-transparent dark:text-white   ">
          {/* Order Header with Action Buttons */}
          <div className=" border-b-2 p-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Order Details</h2>
              <p className="text-sm">Order ID: {order.orderNumber}</p>
              <p className="text-sm">
                Order Date:{" "}
                <strong>
                  {new Date(order.orderDate).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </strong>
              </p>
            </div>
            {order.status !== "Pending" && (
              <div className="flex items-center space-x-4">
                {/* Return/Replace Button */}
                {order.returnPolicy && isReturnActive && (
                  <button
                    onClick={() => setConfirmReturn(true)}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-300 
              ${
                isReturnDisabled
                  ? " text-gray-500 cursor-not-allowed"
                  : " text-black hover:text-green-600 dark:hover:text-green-600 dark:text-white"
              }`}
                    disabled={isReturnDisabled}
                    title="Return or Replace Item"
                  >
                    <RefreshCcw className="mr-2 w-5 h-5" />
                    Return/Replace
                  </button>
                )}

                {/* Cancel Order Button */}
                <button
                  className={`flex items-center px-3 py-2 rounded-md transition-colors duration-300
              ${
                isCancelDisabled
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-black hover:text-red-600 dark:hover:text-red-600 dark:text-white"
              }`}
                  onClick={() => setShowCancelConfirmation(true)}
                  disabled={isCancelDisabled}
                  title="Cancel Order"
                >
                  <X className="mr-1 w-5 h-5 " />
                  Cancel Order
                </button>
              </div>
            )}
          </div>

          {/* Cancel Order Confirmation Modal */}
          {showCancelConfirmation && (
            <CancelConfirmation
              handleCancelOrder={handleCancelOrder}
              setShowCancelConfirmation={setShowCancelConfirmation}
            />
          )}

          {/* Order Status Progress Bar */}
          {order.status === "Returned" ? (
            <div className="flex justify-center m-5 text-yellow-600 font-bold">
              Order returned
            </div>
          ) : order.status === "Pending" ? (
            <div className="flex justify-center m-5 text-red-600 font-bold">
              Payment Failure
            </div>
          ) : (
            <div className="mx-auto p-10 max-w-6xl dark:bg-transparent">
              <div className="flex items-center justify-between relative">
                {orderStages.map((stage, index) => (
                  <div
                    key={stage.label}
                    className="flex-1 flex flex-col items-center relative"
                  >
                    {/* Connecting line: before the current circle */}
                    {index > 0 && (
                      <div
                        className={`absolute top-6 left-0 right-1/2 h-1 -translate-y-1/2 ${
                          stage.completed
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-white"
                        }`}
                        style={{ zIndex: 0 }}
                      />
                    )}

                    {/* Status circle with icon */}
                    <div
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                        stage.completed
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 dark:bg-white text-gray-600"
                      }`}
                    >
                      <stage.Icon className="w-6 h-6" />
                    </div>

                    {/* Status label */}
                    <span className="text-xs mt-2 text-center dark:text-white">
                      {stage.label}
                    </span>

                    {/* Connecting line: after the current circle */}
                    {index < orderStages.length - 1 && (
                      <div
                        className={`absolute top-6 left-1/2 right-0 h-1 -translate-y-1/2 ${
                          stage.completed
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-white"
                        }`}
                        style={{ zIndex: 0 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product & Order Details */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Product Details */}
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={order.imageUrl}
                  alt="No image found"
                  className="w-full h-48 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{order.productName}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Model: {order.productModel}
                </p>
                <PriceBreakdown order={order} />
              </div>
            </div>

            {/* Order Information */}
            <div className="space-y-4">
              <div className="bg-gray-100 dark:text-black p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="mr-2 w-5 h-5 text-green-600" />
                  <h4 className="font-semibold">Shipping Address</h4>
                </div>
                <p>{order?.shippingAddress?.label || ""}</p>
                <p className="text-gray-600">
                  {order.shippingAddress?.street || ""},
                  {order.shippingAddress?.city || ""},
                  {order.shippingAddress?.postalCode || ""},
                  {order.shippingAddress?.country || ""}
                </p>
              </div>

              <div className="bg-gray-100  dark:text-black p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <CreditCard className="mr-2 w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold">Payment Details</h4>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-medium">{order.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-green-600">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {(order.status !== "Pending" && order.status === "Delivered"  ) &&(
                <div className="bg-gray-100  dark:text-black p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Recycle className="mr-2 w-5 h-5 text-yellow-600" />
                    <h4 className="font-semibold">Return</h4>
                  </div>
                  <div>
                    {order.returnPolicy && isReturnActive ? (
                      <span>Available in {formattedDate} </span>
                    ) : (
                      <span>Not available </span>
                    )}
                  </div>
                </div>
              )}

              {
                <div className="bg-gray-100  dark:text-black p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="mr-2 w-5 h-5 text-yellow-600" />
                    <h4 className="font-semibold">Date</h4>
                  </div>
                  <div>
                    <p className="text-sm">
                      { order.status === 'Delivered' ?  'Delivery Date':  'Delivery expected Date' }{" "}
                      <strong>
                        {new Date(
                          order?.deliveryDate ||
                            new Date(order?.orderDate).setDate(
                              new Date(order?.orderDate).getDate() + 7
                            )
                        ).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </strong>
                    </p>
                  </div>
                </div>
              }

              {order.couponApplied && (
                <div className="bg-yellow-100  dark:text-black p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Tag className="mr-2 w-5 h-5 text-yellow-600" />
                    <h4 className="font-semibold">Coupon Applied</h4>
                  </div>
                  <div className="flex justify-between">
                    <span>Code:</span>
                    <span className="font-medium">
                      {order.couponApplied.couponCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-medium text-green-600">
                      -₹{order.couponApplied.offerAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end me-8 gap-5">
            {(order.paymentStatus === "Pending" ||
              order.paymentStatus === "Failed") && (
              <button
                onClick={handlePayNow}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-transform duration-200 ease-in-out transform hover:scale-105 flex gap-2 items-center "
              >
                <HandCoins size={20} />
                Pay Now
              </button>
            )}
            {order.paymentStatus !== "Failed" && (
              <button
                onClick={() => handleDownloadInvoice(order)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-200 flex gap-2 items-center"
              >
                <Download size={19} />
                Download Invoice
              </button>
            )}
          </div>

          {/* Order Summary */}
        </div>
        <div></div>
      </div>
    </>
  );
};

export default OrderDetailsPage;
