import React, { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  CreditCard,
  MapPin,
  Tag,
  ShoppingCart, 
  Settings, 
  Plane, 
  Navigation, 
  Home, 
} from "lucide-react";

const OrderDetailsPage = () => {
  const [order] = useState({
    orderId: "ORD-2024-12345",
    orderDate: "December 17, 2024",
    status: "Shipped",
    product: {
      name: "Ultra Lightweight Laptop",
      model: "ProBook X1",
      image: "/api/placeholder/300/200",
      price: 1299.99,
    },
    payment: {
      method: "Credit Card",
      status: "Paid",
    },
    shipping: {
      address: "123 Tech Lane, Silicon Valley, CA 94000",
      method: "Express Shipping",
    },
    coupon: {
      code: "SAVE20",
      discount: 259.99,
    },
  });

  // Order status stages with icons
  const orderStages = [
    {
      label: "Order Placed",
      completed: true,
      Icon: ShoppingCart,
    },
    {
      label: "Processing",
      completed: true,
      Icon: Settings,
    },
    {
      label: "Shipped",
      completed: true,
      Icon: Plane,
    },
    {
      label: "Out for Delivery",
      completed: false,
      Icon: Navigation,
    },
    {
      label: "Delivered",
      completed: false,
      Icon: Home,
    },
  ];

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Order Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Order Details</h2>
            <p className="text-sm">Order ID: {order.orderId}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6" />
            <span className="font-medium">{order.status}</span>
          </div>
        </div>

        {/* Order Status Progress Bar */}
        <div className="p-6 bg-gray-100">
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
                      stage.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                    style={{ zIndex: 0 }}
                  />
                )}

                {/* Status circle with icon */}
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                    stage.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <stage.Icon className="w-6 h-6" />
                </div>

                {/* Status label */}
                <span className="text-xs mt-2 text-center">{stage.label}</span>

                {/* Connecting line: after the current circle */}
                {index < orderStages.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 right-0 h-1 -translate-y-1/2 ${
                      stage.completed ? "bg-green-500" : "bg-gray-300"
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
            <div className="border rounded-lg overflow-hidden">
              <img
                src={order.product.image}
                alt={order.product.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{order.product.name}</h3>
              <p className="text-gray-600">Model: {order.product.model}</p>
              <div className="flex items-center mt-2">
                <CreditCard className="mr-2 w-5 h-5 text-blue-600" />
                <span className="font-bold text-xl">
                  ${order.product.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <MapPin className="mr-2 w-5 h-5 text-green-600" />
                <h4 className="font-semibold">Shipping Address</h4>
              </div>
              <p>{order.shipping.address}</p>
              <p className="text-gray-600">{order.shipping.method}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CreditCard className="mr-2 w-5 h-5 text-purple-600" />
                <h4 className="font-semibold">Payment Details</h4>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-medium">{order.payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-green-600">
                  {order.payment.status}
                </span>
              </div>
            </div>

            {order.coupon && (
              <div className="bg-yellow-100 p-4 rounded-lg">
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
        <div className="bg-gray-100 p-6 border-t">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold">
              $
              {(order.product.price - (order.coupon?.discount || 0)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
