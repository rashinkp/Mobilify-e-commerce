import React, { useState, useEffect } from "react";
import { Check, Package, MapPin, CreditCard } from "lucide-react";

const OrderSuccessPage = ({ orderDetails }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  // Sample order details if not provided
  const defaultOrderDetails = {
    orderNumber: "ORD-12345",
    totalAmount: 299.99,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
    },
    items: [
      {
        name: "Wireless Headphones",
        quantity: 1,
        price: 199.99,
      },
      {
        name: "Wireless Charger",
        quantity: 1,
        price: 49.99,
      },
    ],
  };

  const details = orderDetails || defaultOrderDetails;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen  dark:bg-darkBackground flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black dark:text-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center relative overflow-hidden">
        {/* Animated Verification Mark */}
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center dark:bg-darkBackground bg-white transition-all duration-500 ${
            isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`w-48 h-48 bg-green-500 rounded-full flex items-center justify-center transform transition-all duration-700 ${
              isAnimating
                ? "scale-100 rotate-0 opacity-100"
                : "scale-0 rotate-180 opacity-0"
            }`}
          >
            <Check
              className="text-white dark:text-white w-24 h-24"
              strokeWidth={3}
            />
          </div>
        </div>

        {/* Success Content */}
        <div
          className={`transition-all duration-500 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Order Confirmed!
          </h1>

          <div className="space-y-4">
            {/* Order Number */}
            <div className="bg-gray-100 dark:bg-darkBackground p-3 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">Order Number</p>
              <p className="font-semibold">{details.orderNumber}</p>
            </div>

            {/* Order Summary */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
              {details.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Total Amount */}
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${details.totalAmount.toFixed(2)}</span>
            </div>

            {/* Shipping Details */}
            <div className="bg-gray-50 dark:bg-darkBackground p-4 rounded-lg space-y-2">
              <div className="flex items-center">
                <MapPin className="mr-2 text-green-600" />
                <h3 className="font-semibold">Shipping Address</h3>
              </div>
              <p>{details.shippingAddress.name}</p>
              <p>{details.shippingAddress.street}</p>
              <p>
                {details.shippingAddress.city},{details.shippingAddress.state}
                {details.shippingAddress.zip}
              </p>
            </div>

            {/* Estimated Delivery */}
            <div className="flex items-center justify-center bg-blue-50 dark:bg-darkBackground p-3 rounded-lg">
              <Package className="mr-2 text-blue-600" />
              <p>
                Estimated Delivery:{" "}
                <span className="font-semibold">
                  {details.estimatedDelivery.toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition">
              View Order Details
            </button>
            <button className="flex-1 bg-gray-200 dark:bg-darkBackground dark:text-white text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
