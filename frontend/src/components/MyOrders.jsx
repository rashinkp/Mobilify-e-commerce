import React from "react";
import { Package, CreditCard, Check, Clock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetIndividualOrderQuery } from "../redux/slices/orderApiSlice";
import { RotatingLines } from "react-loader-spinner";


const OrderListingPage = () => {
  const navigate = useNavigate();



  const { data, isLoading, isError, error, refetch } = useGetIndividualOrderQuery();
  
  const orders = data || [];

  console.log(orders);

  // Function to handle navigation to order details
  const handleOrderDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // Function to get status color and icon
  const getStatusDetails = (status) => {
    switch (status) {
      case "Delivered":
        return { color: "text-green-600", icon: Check, text: "Delivered" };
      case "Processing":
        return { color: "text-blue-600", icon: Clock, text: "Processing" };
      case "Shipped":
        return { color: "text-yellow-600", icon: Package, text: "Shipped" };
      default:
        return { color: "text-gray-600", icon: Package, text: status };
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
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={order.productImageUrl}
                  alt="No image recieved"
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Order Details */}
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">
                      {order.productName}
                    </h2>
                    <p className="text-gray-600 text-sm">sample description</p>
                  </div>
                </div>

                {/* Order Metadata */}
                <div className="mt-2 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      Order ID: {order.orderNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span
                      className={`text-sm ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {React.createElement(getStatusDetails(order.status).icon, {
                      className: `w-4 h-4 ${
                        getStatusDetails(order.status).color
                      }`,
                    })}
                    <span
                      className={`text-sm ${
                        getStatusDetails(order.status).color
                      }`}
                    >
                      {getStatusDetails(order.status).text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
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
                  onClick={() => handleOrderDetails(order.orderId)}
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderListingPage;
