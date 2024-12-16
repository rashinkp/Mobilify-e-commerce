import React, { useEffect, useState } from "react";
import {
  MapPin,
  Truck,
  CreditCard,
  Check,
  PercentIcon,
  ShoppingCart,
} from "lucide-react";
import { RotatingLines } from "react-loader-spinner";
import { useGetAddressQuery } from "../../redux/slices/addressApiSlice";

const CheckoutPage = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  //api calling
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetAddressQuery(null);

  const {addresses} = data || {};


  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setSelectedAddress(addresses[0])
    }
  }, [addresses])
  


  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      model: "Pro Max X2000",
      price: 199.99,
      image: "/api/placeholder/100/100",
      quantity: 1,
    },
    {
      id: 2,
      name: "Smart Watch",
      model: "Ultra Series 3",
      price: 249.99,
      image: "/api/placeholder/100/100",
      quantity: 1,
    },
  ];

  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 5.99,
      time: "5-7 Business Days",
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 15.99,
      time: "2-3 Business Days",
    },
  ];

  const calculateSubtotal = () => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const handleCouponApply = () => {
    // Simple coupon validation logic
    if (couponCode.toUpperCase() === "SAVE10") {
      setAppliedCoupon({
        code: "SAVE10",
        discount: 0.1, // 10% discount
      });
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingCost = selectedShipping ? selectedShipping.price : 0;
    const couponDiscount = appliedCoupon
      ? subtotal * appliedCoupon.discount
      : 0;

    return subtotal + shippingCost - couponDiscount;
  };

  const handleSubmit = () => {
    const orderData = {
      selectedAddress,
      selectedShipping,
      selectedPayment,
      products,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      total: calculateTotal(),
    };

    console.log("Order Data:", orderData);
  };


  
  if (isLoading) {
    return (
      <div className="h-screen w-full absolute top-0 z-50 left-0 backdrop-blur-sm bg-black/30 flex justify-center items-center">
        <RotatingLines
          visible={true}
          height="50"
          width="50"
          color="grey"
          strokeColor="#fff"
          strokeWidth="2"
          animationDuration="8"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }
  

  return (
    <div className="container mx-auto p-4 dark:text-white max-w-4xl">
      {/* Address Selection */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <MapPin className="mr-2" /> Shipping Address
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedAddress?._id === address._id
                  ? "border-blue-500 bg-blue-50 dark:bg-black"
                  : "hover:bg-gray-100 hover:dark:bg-gray-500"
              }`}
              onClick={() => setSelectedAddress(address)}
            >
              <h3 className="font-semibold">{address.label}</h3>
              <p>{address.street}</p>
              <p>{`${address.city}, ${address.state} ${address.zip}`}</p>
              <p>{address.phone}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Listing */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <ShoppingCart className="mr-2" /> Order Summary
        </h2>
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover"
              />
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Model: {product.model}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">${product.price.toFixed(2)}</p>
              <p className="text-gray-600 dark:text-gray-400">
                Qty: {product.quantity}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Coupon Section */}
      <section className="mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            className="flex-grow p-2 border rounded dark:bg-black dark:border-blue-500"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button
            onClick={handleCouponApply}
            className="bg-blue-500 text-white p-2 rounded flex items-center"
          >
            <PercentIcon className="mr-2" /> Apply
          </button>
        </div>
        {appliedCoupon && (
          <p className="text-green-600 mt-2">
            Coupon {appliedCoupon.code} applied: 10% Discount
          </p>
        )}
      </section>

      {/* Shipping Method */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Truck className="mr-2" /> Shipping Method
        </h2>
        {shippingMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 border rounded-lg cursor-pointer mb-2 ${
              selectedShipping?.id === method.id
                ? "border-blue-500 bg-blue-50 dark:bg-black"
                : "hover:bg-gray-100 hover:dark:bg-gray-500"
            }`}
            onClick={() => setSelectedShipping(method)}
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{method.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {method.time}
                </p>
              </div>
              <p className="font-bold">${method.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Payment Method */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <CreditCard className="mr-2" /> Payment Method
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {["Credit Card", "PayPal", "Cash on Delivery"].map((method) => (
            <div
              key={method}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedPayment === method
                  ? "border-blue-500 bg-blue-50 dark:bg-black"
                  : "hover:bg-gray-100 hover:dark:bg-gray-500"
              }`}
              onClick={() => setSelectedPayment(method)}
            >
              {method}
            </div>
          ))}
        </div>
      </section>

      {/* Order Summary */}
      <section className="mb-6 bg-gray-100 dark:bg-transparent p-4 rounded-lg">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        {selectedShipping && (
          <div className="flex justify-between mb-2">
            <span>Shipping ({selectedShipping.name})</span>
            <span>${selectedShipping.price.toFixed(2)}</span>
          </div>
        )}
        {appliedCoupon && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Coupon Discount</span>
            <span>
              -${(calculateSubtotal() * appliedCoupon.discount).toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
      </section>

      {/* Complete Order Button */}
      <button
        className={`w-full p-3 rounded-lg text-white font-bold ${
          selectedAddress && selectedShipping && selectedPayment
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!(selectedAddress && selectedShipping && selectedPayment)}
        onClick={handleSubmit}
      >
        <Check className="inline mr-2" /> Complete Order
      </button>


       
    </div>
  );
};

export default CheckoutPage;
