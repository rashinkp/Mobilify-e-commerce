import React, { useEffect, useState } from "react";
import {
  MapPin,
  Truck,
  CreditCard,
  Check,
  PercentIcon,
  ShoppingCart,
  IndianRupee,
  Plus,
} from "lucide-react";
import { RotatingLines } from "react-loader-spinner";
import { useAddAddressMutation, useGetAddressQuery } from "../../redux/slices/addressApiSlice";
import { useGetCartQuery } from "../../redux/slices/cartApiSlice";
import { usePlaceOrderMutation } from "../../redux/slices/orderApiSlice";
import { errorToast, successToast } from "../../components/toast";
import { useNavigate } from "react-router";
import AddAddressForm from "../../components/user/AddAddressForm";
import { addressValidationSchema } from "../../validationSchemas";
const CheckoutPage = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
 const [addAddress] = useAddAddressMutation();
  const navigate = useNavigate();

  const [placeOrder] = usePlaceOrderMutation()

  //api calling

  // Address API response
  const {
    data: addressData,
    isLoading: isAddressLoading,
    isError: isAddressError,
    error: addressError,
  } = useGetAddressQuery(null);

  // Cart API response
  const {
    data: cartData = {},
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
    refetch: refetchCart,
  } = useGetCartQuery();

  const { addresses } = addressData || {};

  const products = cartData.cartItems || [];

  

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses]);

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
      (total, product) =>
        total + product?.productDetails?.price * product.quantity,
      0
    );
  };


    const handleAddAddress = async (data) => {
      console.log("Form Submitted:", data);
      const userId = cartData.userId
      try {
        await addAddress({ data, userId });
        successToast("Address added successfully");
      } catch (error) {
        errorToast(
          error?.data?.message ||
            error?.message ||
            error?.data ||
            "Error occurred while adding address"
        );
        console.log(error);
      }
      setIsAddingAddress(false);
    };
  

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.02;
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
    const tax = calculateTax()
    const shippingCost = selectedShipping ? selectedShipping.price : 0;
    const couponDiscount = appliedCoupon
      ? subtotal * appliedCoupon.discount
      : 0;

    return subtotal + tax + shippingCost - couponDiscount;
  };

  const handleSubmit = async() => {
   const orderItems = products.map((product) => ({
     productId: product.productDetails?._id,
     name: product?.productDetails?.name,
     model: product?.productDetails?.model,
     price: product?.productDetails?.price,
     quantity: product.quantity,
     imageUrl: product?.productDetails?.images[0]?.url,
   }));
     const subtotal = calculateSubtotal();
     const tax = calculateTax();
     const shippingCost = selectedShipping ? selectedShipping.price : 0;
     const couponDiscount = appliedCoupon
       ? subtotal * appliedCoupon.discount
       : 0;

    const total = subtotal + shippingCost + tax - couponDiscount;
    

    const orderData = {
      shippingAddress: {
        addressId: selectedAddress._id,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
        label: selectedAddress.label,
      },
      shipping: selectedShipping,
      paymentMethod: selectedPayment,
      orderItems: orderItems,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
    
    };

    console.log(orderData);


    try {
      const {orderId} = await placeOrder(orderData).unwrap();
      successToast('Order placed successfully');
      navigate(`/user/orderSuccess/`);
    } catch (error) {
      errorToast(error.message || error.data.message || 'Error while placing order')
      console.log(error)
    }

    console.log("Order Data:", orderData);
  };

  if (isAddressLoading || isCartLoading) {
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
        <div className=" flex flex-col ">
          <button
            onClick={() => setIsAddingAddress(true)}
            className="text-green-600 ms-auto mb-5 hover:text-green-700 flex items-center"
          >
            <Plus size={16} className="mr-2" /> Add New
          </button>
          {isAddingAddress && (
            <AddAddressForm
              onCancel={() => setIsAddingAddress(false)}
              validationSchema={addressValidationSchema}
              onSubmit={handleAddAddress}
            />
          )}
        </div>
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
            key={product._id}
            className="flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center space-x-4">
              <img
                src={product?.productDetails?.images[0]?.secure_url}
                alt={product?.productDetails?.name}
                className="w-16 h-16 object-cover"
              />
              <div>
                <h3 className="font-semibold">{product?.productDetails?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Model: {product?.productDetails?.model}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">
                &#x20b9;{product?.productDetails?.price}
              </p>
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
              <p className="font-bold">&#x20b9;{method.price.toFixed(2)}</p>
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
          <span>&#x20b9;{calculateSubtotal().toFixed(2)}</span>
        </div>
        {selectedShipping && (
          <div className="flex justify-between mb-2">
            <span>Shipping ({selectedShipping.name})</span>
            <span>&#x20b9;{selectedShipping.price.toFixed(2)}</span>
          </div>
        )}
        {appliedCoupon && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Coupon Discount</span>
            <span>
              -&#x20b9;
              {(calculateSubtotal() * appliedCoupon.discount).toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>&#x20b9;{calculateTax().toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>&#x20b9;{calculateTotal().toFixed(2)}</span>
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
