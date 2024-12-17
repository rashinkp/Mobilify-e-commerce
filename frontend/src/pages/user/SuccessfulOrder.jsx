import React, { useState, useEffect } from "react";
import { Check, Package, MapPin, CreditCard } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useGetOrderQuery } from "../../redux/slices/orderApiSlice";
import { RotatingLines } from "react-loader-spinner";

const OrderSuccessPage = ({ orderDetails }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useGetOrderQuery({
    orderId: id,
  });



  const defaultOrderDetails = data || {};
  const details = orderDetails || defaultOrderDetails;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  console.log(details);
  
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

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-darkBackground text-center p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            Sorry, we couldn't find the order you're looking for.
          </p>
          <button
            onClick={() => navigate("/user/products")}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }
  

  if (!details || Object.keys(details).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-darkBackground text-center p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            No Order Details
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            Please check your order history or try again later.
          </p>
          <button
            onClick={() => navigate("/user/products")}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-darkBackground flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black dark:text-white rounded-2xl w-full max-w-md p-8 text-center relative overflow-hidden">
        {/* Animated Verification Mark */}
        <div
          className={`absolute inset-0 z-2 flex items-center justify-center dark:bg-darkBackground bg-white transition-all duration-500 ${
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
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Order Number
              </p>
              <p className="font-semibold">{details.orderNumber}</p>
            </div>

            {/* Order Summary */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
              {details.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p>Product ID: {item.productId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Details */}
            <div className="bg-gray-50 dark:bg-darkBackground p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>&#x20b9;{details.pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span>&#x20b9;{details.pricing.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>&#x20b9;{details.pricing.tax.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>&#x20b9;{details.pricing.total.toFixed(2)}</span>
            </div>

            {/* Payment & Shipping Details */}
            <div className="bg-blue-50 dark:bg-darkBackground p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span>{details.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span>{details.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Method</span>
                <span>{details.shipping.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span>{details.shipping.time}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-4">
              <button className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition">
                View Order Details
              </button>
              <button className="flex-1 bg-gray-200 dark:bg-darkBackground dark:text-white text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition" onClick={() => navigate('/user/products')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
