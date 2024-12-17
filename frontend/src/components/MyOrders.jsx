import React from "react";
import { Package, CreditCard, Check, Clock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sample order data (you would typically fetch this from an API)
const sampleOrders = [
  {
    orderId: "ORD-2024-001",
    orderDate: "2024-01-15",
    products: [
      {
        id: "PROD-001",
        name: "Wireless Noise-Canceling Headphones",
        description: "Over-ear headphones with advanced noise cancellation",
        image: "/api/placeholder/100/100",
      },
    ],
    paymentStatus: "Paid",
    orderStatus: "Delivered",
  },
  {
    orderId: "ORD-2024-002",
    orderDate: "2024-02-20",
    products: [
      {
        id: "PROD-002",
        name: "Smart Fitness Tracker",
        description: "Advanced health and activity monitoring device",
        image: "/api/placeholder/100/100",
      },
    ],
    paymentStatus: "Pending",
    orderStatus: "Processing",
  },
  {
    orderId: "ORD-2024-003",
    orderDate: "2024-03-10",
    products: [
      {
        id: "PROD-003",
        name: "Ergonomic Office Chair",
        description: "Comfortable and adjustable workspace chair",
        image: "/api/placeholder/100/100",
      },
    ],
    paymentStatus: "Paid",
    orderStatus: "Shipped",
  },
];

const OrderListingPage = () => {
  const navigate = useNavigate();

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

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {sampleOrders.map((order) => (
          <div
            key={order.orderId}
            className="border-b pb-4 last:border-b-0 relative"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={order.products[0].image}
                  alt={order.products[0].name}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Order Details */}
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">
                      {order.products[0].name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {order.products[0].description}
                    </p>
                  </div>
                </div>

                {/* Order Metadata */}
                <div className="mt-2 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Order ID: {order.orderId}</span>
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
                    {React.createElement(
                      getStatusDetails(order.orderStatus).icon,
                      {
                        className: `w-4 h-4 ${
                          getStatusDetails(order.orderStatus).color
                        }`,
                      }
                    )}
                    <span
                      className={`text-sm ${
                        getStatusDetails(order.orderStatus).color
                      }`}
                    >
                      {getStatusDetails(order.orderStatus).text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {order.orderDate}
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
