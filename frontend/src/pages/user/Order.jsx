import React, { useState } from "react";
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
} from "lucide-react";
import { useGetSingleOrderQuery } from "../../redux/slices/orderApiSlice";
import { useParams } from "react-router";
import { RotatingLines } from "react-loader-spinner";

const OrderDetailsPage = () => {
  // State for managing order actions
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [orderCancelled, setOrderCancelled] = useState(false);

  const { ordId: orderId } = useParams();

  const { data, isLoading, isError, error, refetch } = useGetSingleOrderQuery({
    orderId,
  });

  const order = data || {};

  console.log(order);

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
  const handleCancelOrder = () => {
    setOrderCancelled(true);
    setShowCancelConfirmation(false);
  };

  // Determine if cancel and return buttons should be disabled
  const isCancelDisabled =
    orderCancelled ||
    ["Delivered", "Cancelled", "Out for Delivery"].includes(order.status);

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
    <div className="container mx-auto p-6 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-black dark:text-white shadow-lg rounded-xl overflow-hidden">
        {/* Order Header with Action Buttons */}
        <div className="bg-black text-white p-4 flex justify-between items-center">
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
          <div className="flex items-center space-x-4">
            {/* Return/Replace Button */}
            <button
              className={`flex items-center px-3 py-2 rounded-md transition-colors duration-300 
              ${
                isReturnDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              disabled={isReturnDisabled}
              title="Return or Replace Item"
            >
              <RefreshCcw className="mr-2 w-5 h-5" />
              Return/Replace
            </button>

            {/* Cancel Order Button */}
            <button
              className={`flex items-center px-3 py-2 rounded-md transition-colors duration-300
              ${
                isCancelDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
              onClick={() => setShowCancelConfirmation(true)}
              disabled={isCancelDisabled}
              title="Cancel Order"
            >
              <X className="mr-2 w-5 h-5" />
              Cancel Order
            </button>
          </div>
        </div>

        {/* Cancel Order Confirmation Modal */}
        {showCancelConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center mb-4 text-yellow-500">
                <AlertTriangle className="mr-3 w-6 h-6" />
                <h3 className="text-xl font-bold dark:text-white">
                  Cancel Order?
                </h3>
              </div>
              <p className="mb-4 dark:text-gray-300">
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCancelConfirmation(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-white rounded-md hover:bg-gray-300"
                >
                  No, Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Yes, Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the existing component remains the same */}
        {/* Order Status Progress Bar */}
        <div className="p-6  dark:bg-black">
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
              <div className="flex items-center mt-2">
                <CreditCard className="mr-2 w-5 h-5 text-blue-600" />
                <span className="font-bold text-xl">
                  ${order.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-4">
            <div className="bg-gray-100 dark:text-black p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <MapPin className="mr-2 w-5 h-5 text-green-600" />
                <h4 className="font-semibold">Shipping Address</h4>
              </div>
              <p>{order.shippingAddress.label}</p>
              <p className="text-gray-600">
                {order.shippingAddress.street},{order.shippingAddress.city},
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
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
                <span>Status:</span>
                <span className="font-medium text-green-600">
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {order.coupon && (
              <div className="bg-yellow-100  dark:text-black p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Tag className="mr-2 w-5 h-5 text-yellow-600" />
                  <h4 className="font-semibold">Coupon Applied</h4>
                </div>
                <div className="flex justify-between">
                  <span>Code:</span>
                  <span className="font-medium">{order.coupon.code}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span className="font-medium text-green-600">
                    -${order.coupon.discount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
      </div>
      <div></div>
    </div>
  );
};

export default OrderDetailsPage;
