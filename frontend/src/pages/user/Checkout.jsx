import React, { useCallback, useEffect, useState } from "react";
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
import {
  useAddAddressMutation,
  useGetAddressQuery,
} from "../../redux/slices/addressApiSlice";
import { useGetCartQuery } from "../../redux/slices/cartApiSlice";
import { usePlaceOrderMutation } from "../../redux/slices/orderApiSlice";
import { errorToast, successToast } from "../../components/toast";
import { useNavigate } from "react-router";
import AddAddressForm from "../../components/user/AddAddressForm";
import { addressValidationSchema } from "../../validationSchemas";
import { useVerifyPaymentMutation } from "../../redux/slices/paymentApiSlice.js";
import { useApplyCouponMutation } from "../../redux/slices/couponApiSlice.js";
import AddressSection from "../../components/checkout/AddressSection.jsx";
import CouponSelection from "../../components/checkout/CouponSelection.jsx";
import ShippingSection from "../../components/checkout/ShippingSection.jsx";
import PaymentSection from "../../components/checkout/PaymentSection.jsx";
import OrderTotal from "../../components/checkout/OrderTotal.jsx";
import OrderSummery from "../../components/checkout/OrderSummery.jsx";
const CheckoutPage = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [verifyPayment] = useVerifyPaymentMutation();
  const [addAddress] = useAddAddressMutation();
  const navigate = useNavigate();
  const [applyCoupon] = useApplyCouponMutation();

  const [placeOrder] = usePlaceOrderMutation();

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
        total +
        ((product?.productDetails?.price *
          (100 - product?.productDetails?.offerPercent)) /
          100 || product?.product?.offerPercent) *
          product.quantity,
      0
    );
  };

  const handleAddAddress = async (data) => {
    console.log("Form Submitted:", data);
    const userId = cartData.userId;
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

  const handleCouponApply = async () => {
    const orderProducts = products.map(
      (product) => product?.productDetails?._id
    );

    try {
      const response = await applyCoupon({
        couponCode,
        orderProducts,
      }).unwrap();
      setAppliedCoupon(response);
      console.log(response);
      successToast("Coupon Applied successfully");
    } catch (error) {
      errorToast(
        error?.data?.message ||
          error?.message ||
          error?.data ||
          "Error occurred while applying coupon"
      );
      console.log(error);
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingCost = selectedShipping ? selectedShipping.price : 0;
    const couponDiscount = appliedCoupon ? appliedCoupon.couponDiscount : 0;

    return subtotal + shippingCost - couponDiscount;
  };

  const handleRazorpaySuccess = useCallback(
    async (razorpayOrderData, response) => {
      try {
        const paymentId = response.razorpay_payment_id;
        const orderId = razorpayOrderData.orderId;

        const verifyPaymentResponse = await verifyPayment({
          paymentId,
        });

        if (verifyPaymentResponse) {
          const orderResponse = await placeOrder({
            ...razorpayOrderData,
            paymentId,
            paymentStatus: "Successful",
          });

          if (!orderResponse) {
            errorToast("Failed to create order. Please try again.");
            return;
          }
          successToast("Payment successful!");
          navigate(`/user/orderSuccess`);
        } else {
          errorToast("Payment verification failed. Please try again.");
        }
      } catch (error) {
        errorToast("Error processing payment. Please try again.");
        console.error("Payment error:", error);
      }
    },
    [verifyPayment, placeOrder, navigate]
  );

  const triggerRazorpayCheckout = useCallback(
    (razorpayOrderData) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_K5otU6Q5C8lSi8",
        amount: razorpayOrderData.total * 100,
        currency: "INR",
        order_id: razorpayOrderData.orderNumber,
        handler: (response) =>
          handleRazorpaySuccess(razorpayOrderData, response),
        prefill: {
          name: razorpayOrderData.customerName || "",
          email: razorpayOrderData.email || "",
          contact: razorpayOrderData.phone || "",
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: () => {
            errorToast("Payment cancelled. Please try again.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    },
    [handleRazorpaySuccess]
  );

  const handleSubmit = async () => {
    try {
      const orderItems = products.map((product) => ({
        productId: product.productDetails?._id,
        name: product?.productDetails?.name,
        model: product?.productDetails?.model,
        price:
          (product?.productDetails?.price *
            (100 - product?.productDetails?.offerPercent)) /
          100,
        quantity: product.quantity,
        imageUrl: product?.productDetails?.images[0]?.url,
        returnPolicy: product?.productDetails?.returnPolicy,
        coupon:
          appliedCoupon?.productDetails?.productId === product?.productDetails?._id ? appliedCoupon : null,
      }));


      const subtotal = calculateSubtotal();
      const shippingCost = selectedShipping?.price || 0;
      const couponDiscount = appliedCoupon ? appliedCoupon.couponDiscount : 0;
      const total = subtotal + shippingCost - couponDiscount;

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
        orderItems,
        couponCode,
        total,
      };

      if (selectedPayment === "Razorpay") {
        await triggerRazorpayCheckout(orderData);
      } else if (selectedPayment === "Cash On Delivery") {
        const response = await placeOrder(orderData);
        if (response) {
          successToast("Order placed successfully");
          navigate(`/user/orderSuccess`);
        } else {
          errorToast("Failed to place order. Please try again.");
        }
      }
    } catch (error) {
      errorToast(error.message || "Error while placing order");
      console.error("Order error:", error);
    }
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
      <AddressSection
        addresses={addresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        isAddingAddress={isAddingAddress}
        setIsAddingAddress={setIsAddingAddress}
        handleAddAddress={handleAddAddress}
      />

      <OrderSummery products={products} />

      <CouponSelection
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        handleCouponApply={handleCouponApply}
        appliedCoupon={appliedCoupon}
      />

      <ShippingSection
        shippingMethods={shippingMethods}
        selectedShipping={selectedShipping}
        setSelectedShipping={setSelectedShipping}
      />

      <PaymentSection
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
      />

      <OrderTotal
        calculateSubtotal={calculateSubtotal}
        selectedShipping={selectedShipping}
        appliedCoupon={appliedCoupon}
        calculateTotal={calculateTotal}
      />

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
