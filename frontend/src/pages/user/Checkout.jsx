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
  Tag,
  ShoppingBasketIcon,
  Home,
  ChevronRight,
  User,
} from "lucide-react";
import { RotatingLines } from "react-loader-spinner";
import {
  useAddAddressMutation,
  useGetAddressQuery,
} from "../../redux/slices/addressApiSlice";
import { useGetCartQuery } from "../../redux/slices/cartApiSlice";
import {
  useFailedOrderMutation,
  usePlaceOrderMutation,
} from "../../redux/slices/orderApiSlice";
import { errorToast, successToast } from "../../components/toast";
import { Link, useNavigate } from "react-router";
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
import { useDebitAmountMutation } from "../../redux/slices/walletApiSlice.js";
import ListCoupons from "../../components/checkout/ListCoupons.jsx";

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
  const [showCoupons, setShowCoupons] = useState(false);
  const [paymentCancel, setPaymentCancel] = useState(false);
  const [placeOrder] = usePlaceOrderMutation();
  const [debitAmountFromWallet] = useDebitAmountMutation();
  const [addToFailedPayment] = useFailedOrderMutation();
  const [hasInsufficientStock, setHasInsufficientStock] = useState(false);

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
    if (products && products.length > 0) {
      const insufficientStock = products.some(
        (product) => product.productDetails?.stock < product.quantity
      );
      setHasInsufficientStock(insufficientStock > 0 ? true : false);
      console.log(hasInsufficientStock, "hasddjfsdlfdsaf");
    } else {
      setHasInsufficientStock(false);
    }
  }, [products]);

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

  const calculateSubtotal = Array.isArray(products)
    ? products.reduce((total, product) => {
        const price = product?.productDetails?.price || 0;
        const productOffer = product?.productDetails?.offerPercent || 0;
        const categoryOffer = product?.productDetails?.category?.offer || 0;
        const quantity = product?.quantity || 0;

        const offerPercent = Math.min(productOffer + categoryOffer, 100);

        const discountedPrice = (price * (100 - offerPercent)) / 100;

        return total + discountedPrice * quantity;
      }, 0)
    : 0;

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
    const subtotal = calculateSubtotal;
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
            setPaymentCancel(true);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    },
    [handleRazorpaySuccess]
  );

  const finalPrice = (product) => {
    const effectiveOfferPercent = Math.min(
      (product?.offerPercent || 0) + (product?.category?.offer || 0),
      100
    );

    return effectiveOfferPercent > 0
      ? product.price - (product.price * effectiveOfferPercent) / 100
      : product.price;
  };

  const handleSubmit = async (val = false) => {
    try {
      const orderItems = products.map((product) => ({
        productId: product.productDetails?._id,
        name: product?.productDetails?.name,
        model: product?.productDetails?.model,
        price: finalPrice(product?.productDetails),
        offerPrice:
          product?.productDetails.price - finalPrice(product?.productDetails),
        quantity: product.quantity,
        imageUrl: product?.productDetails?.images[0]?.url,
        returnPolicy: product?.productDetails?.returnPolicy,
        coupon:
          appliedCoupon?.productDetails?.productId ===
          product?.productDetails?._id
            ? appliedCoupon
            : null,
      }));

      const subtotal = calculateSubtotal;
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

      if (val) {
        await addToFailedPayment(orderData).unwrap();
        successToast("Order moved to failedPayment");
        navigate("/user/orders");
        return;
      }

      if (selectedPayment === "Razorpay") {
        await triggerRazorpayCheckout(orderData);
      } else if (selectedPayment === "Cash On Delivery") {
        const response = await placeOrder(orderData).unwrap();
        if (response) {
          successToast("Order placed successfully");
          navigate(`/user/orderSuccess`);
        } else {
          errorToast("Failed to place order. Please try again.");
        }
      } else if (selectedPayment === "Wallet") {
        const amount = orderData.total;
        await debitAmountFromWallet({ amount }).unwrap();

        const response = await placeOrder(orderData).unwrap();
        if (response) {
          successToast("Order placed successfully");
          navigate(`/user/orderSuccess`);
        } else {
          errorToast();
        }
      }
    } catch (error) {
      errorToast(
        error.message || error?.data?.message || "Error while placing order"
      );
      console.error("Order error:", error);
    }
  };

  console.log(products);

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
    <>
      <div className="bg-gradient-to-r bg-indigo-500 shadow-md fixed w-full z-20">
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
            <Link
              to="/user/cart"
              className="text-white hover:text-white/80 transition-colors flex items-center"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              My Cart
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
            <span className="font-medium">Checkout</span>
          </div>
        </div>
      </div>
      <div className="pt-20 container mx-auto p-4 dark:text-white max-w-4xl">
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

        <button
          onClick={() => setShowCoupons(!showCoupons)}
          className="text-indigo-500 text-sm flex items-center gap-1 mb-2"
        >
          <Tag size={16} />
          View available coupons
        </button>

        {showCoupons && <ListCoupons products={products} />}

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
        <div className="flex gap-5">
          <button
            className={`w-full p-3 rounded-lg text-white font-bold ${
              selectedAddress &&
              selectedShipping &&
              selectedPayment &&
              products.length > 0 &&
              !hasInsufficientStock
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={
              !(selectedAddress && selectedShipping && selectedPayment) ||
              products.length < 1 ||
              hasInsufficientStock
            }
            onClick={() => handleSubmit(false)}
          >
            <Check className="inline mr-2" /> Complete Order
          </button>

          {paymentCancel && (
            <button
              onClick={() => handleSubmit(true)}
              className="px-6 py-2 bg-yellow-600 text-white font-medium rounded-lg shadow-md hover:bg-yellow-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 flex items-center gap-3"
            >
              <ShoppingBasketIcon size={35} />
              Move to Pending Orders
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
