import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router";
import { RotatingLines } from "react-loader-spinner";

const OrderSuccessPage = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[60vh] dark:bg-darkBackground flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black dark:text-white rounded-2xl w-full max-w-md p-8 text-center relative overflow-hidden">
        {/* Animated Verification Mark */}
        <div
          className={`absolute inset-0 z-2 flex items-center justify-center dark:bg-darkBackground bg-white transition-all duration-500 ${
            isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`w-48 h-48 bg-indigo-500 rounded-full flex items-center justify-center transform transition-all duration-700 ${
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
          <h1 className="text-3xl font-bold text-indigo-600 mb-6">
            Order Placed Successfully!
          </h1>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => navigate("/user/orders")}
              className="flex-1 bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate("/user/products")}
              className="flex-1 bg-gray-200 dark:bg-darkBackground dark:text-white text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
