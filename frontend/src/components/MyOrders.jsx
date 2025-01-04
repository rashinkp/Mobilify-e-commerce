import React, { useEffect, useState } from "react";
import {
  Package,
  CreditCard,
  Check,
  Clock,
  Eye,
  Home,
  ChevronRight,
  User,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetIndividualOrderQuery } from "../redux/slices/orderApiSlice";
import { RotatingLines } from "react-loader-spinner";

const OrderListingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [allOrders, setAllOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isFetching, isError, error } =
    useGetIndividualOrderQuery(
      { page: currentPage, limit: 5 },
      {
        // Refetch when page changes
        refetchOnMountOrArgChange: true,
      }
    );

  // Handle data updates
  useEffect(() => {
    if (data?.orders) {
      if (currentPage === 1) {
        // Reset orders for first page
        setAllOrders(data.orders);
      } else {
        // Append new orders for subsequent pages
        setAllOrders((prev) => [...prev, ...data.orders]);
      }
      setHasMore(data.hasMore);
    }
  }, [data, currentPage]);

  const handleScroll = () => {
    const scrollableElement = document.documentElement;
    const scrolledToBottom =
      scrollableElement.scrollHeight - scrollableElement.scrollTop <=
      scrollableElement.clientHeight + 100;

    if (scrolledToBottom && !isFetching && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore]);

  // Rest of your component remains the same...
  const handleOrderDetails = (orderId) => {
    navigate(`/user/orderDetail/${orderId}`);
  };

  const isOrdersPage = location.pathname.includes("orders");

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

  if (isError) {
    return (
      <div className="pt-20 text-center text-red-600">
        Error loading orders: {error?.data?.message || "Something went wrong"}
      </div>
    );
  }

  if (allOrders.length < 1 && !isLoading) {
    return <div className="pt-20 text-center">No Orders yet</div>;
  }

  if (isLoading && currentPage === 1) {
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
    <div className="min-h-screen  dark:bg-gray-900">
      {isOrdersPage && (
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-md fixed w-full z-20">
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
                Profile
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
              <span className="font-medium">Orders</span>
            </div>
          </div>
        </div>
      )}

      <div
        className={`max-w-6xl mx-auto px-4 ${
          isOrdersPage ? "pt-24" : "pt-8"
        } pb-8`}
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          My Orders
        </h1>

        <div className="space-y-4">
          {allOrders.map((order, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative hover:shadow-md transition-shadow duration-200"
            >
              {/* Order content remains the same... */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                  <img
                    src={order.imageUrl}
                    alt={order.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.png";
                    }}
                  />
                </div>

                {/* Order Details */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {order.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {order.model}
                      </p>
                    </div>
                  </div>

                  {/* Order Metadata */}
                  <div className="mt-2 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Order ID: {order.orderNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                      <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
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

                {/* View Details Button */}
                <button
                  onClick={() => handleOrderDetails(order._id)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                  aria-label="View Order Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loading More Indicator */}
        {isFetching && currentPage > 1 && (
          <div className="flex justify-center py-8">
            <RotatingLines
              visible={true}
              height="32"
              width="32"
              color="grey"
              strokeColor="#666"
              strokeWidth="2"
              animationDuration="8"
              ariaLabel="loading-more-orders"
            />
          </div>
        )}

        {/* No More Orders Message */}
        {!hasMore && allOrders.length > 0 && (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No more orders to load
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListingPage;
