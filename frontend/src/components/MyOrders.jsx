import React from "react";
import { Package, CreditCard, Check, Clock, Eye, Home, ChevronRight, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetIndividualOrderQuery } from "../redux/slices/orderApiSlice";
import { RotatingLines } from "react-loader-spinner";

const OrderListingPage = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } =
    useGetIndividualOrderQuery();

  const orders = data || [];

  // Function to handle navigation to order details
  const handleOrderDetails = (orderId) => {
    navigate(`/user/orderDetail/${orderId}`);
  };

  const isOrdersPage = location.pathname.includes("orders");

  // Function to get status color and icon
  const getStatusDetails = (productStatus) => {
    switch (productStatus) {
      case "Delivered":
        return { color: "text-green-600", icon: Check, text: "Delivered" };
      case "Processing":
        return { color: "text-blue-600", icon: Clock, text: "Processing" };
      case "Shipped":
        return { color: "text-yellow-600", icon: Package, text: "Shipped" };
      case "Cancelled":
        return { color: "text-red-600", icon: Package, text: "Cancelled" };
      default:
        return {
          color: "text-gray-600 dark:text-gray-300",
          icon: Package,
          text: productStatus,
        };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "text-green-600";
      case "Pending":
        return "text-yellow-600";
      case "Failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (orders.length < 1) {
    return <div className="text-center">No Orders yet</div>;
  }

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
    <div className="">
      {isOrdersPage && (
        <div className="bg-gradient-to-r bg-indigo-500 shadow-md fixed w-full z-20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-white">
              <Link
                to="/user"
                className="text-white hover:text-white/80 transition-colors flex items-center"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
              <Link
                to="/user/profile"
                className="text-white hover:text-white/80 transition-colors flex items-center"
              >
                <User className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
              <span className="font-medium">Orders</span>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-6xl mx-auto ${isOrdersPage && "pt-20"}`}>
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={order.imageUrl}
                    alt="No image recieved"
                    className="w-full h-full object-contain rounded"
                  />
                </div>

                {/* Order Details */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-lg">{order.name}</h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {order.model}
                      </p>
                    </div>
                  </div>

                  {/* Order Metadata */}
                  <div className="mt-2 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                      <span className="text-sm">
                        Order ID: {order.orderNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                      <span
                        className={`text-sm ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {React.createElement(
                        getStatusDetails(order.status).icon,
                        {
                          className: `w-4 h-4 ${
                            getStatusDetails(order.status).color
                          }`,
                        }
                      )}
                      <span
                        className={`text-sm ${
                          getStatusDetails(order.status).color
                        }`}
                      >
                        {getStatusDetails(order.status).text}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {new Date(order.orderDate).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details Navigation */}
                <div className="absolute top-0 right-0">
                  <button
                    onClick={() => handleOrderDetails(order._id)}
                    className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Eye className="w-5 h-5 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderListingPage;
