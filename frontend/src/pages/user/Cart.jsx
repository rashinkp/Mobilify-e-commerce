import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, AlertOctagon } from "lucide-react";
import {
  useDeleteFromCartMutation,
  useGetCartQuery,
  useUpdateProductQuantityMutation,
} from "../../redux/slices/cartApiSlice";
import { RotatingLines } from "react-loader-spinner";
import { Link, useNavigate } from "react-router";
import { errorToast, successToast } from "../../components/toast";

const ShoppingCart = () => {
  const { data = {}, isLoading, isError, error, refetch } = useGetCartQuery();
  const [deletItem] = useDeleteFromCartMutation();
  const [updateCartQuantity] = useUpdateProductQuantityMutation();
  const cartItems = data?.cartItems || [];

  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  console.log(products);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const filteredItems = cartItems.filter(
        (item) => Object.keys(item).length > 0
      );
      setProducts(filteredItems);
    } else {
      setProducts([]);
    }
  }, [cartItems]);

  const [discount, setDiscount] = useState(0);

  const incrementQuantity = async (productId) => {
    const updatedQuantity = data?.cartItems?.reduce((quantity, product) => {
      if (product.productId === productId) {
        quantity = product.quantity + 1;
      }
      return quantity;
    }, null);

    try {
      await updateCartQuantity({ productId, updatedQuantity }).unwrap();
    } catch (error) {
      errorToast(
        error?.message ||
          error?.data?.message ||
          "error occured while updating data"
      );
      console.log(error);
    }
  };


  const decrementQuantity = async (productId) => {
    const product = data?.cartItems?.find(
      (item) => item.productId === productId
    );

    if (!product) {
      errorToast("Product not found in cart.");
      return;
    }

    if (product.quantity === 1) {
      errorToast("Minimum cart count is 1. Cannot decrement further.");
      return;
    }

    const updatedQuantity = product.quantity - 1;

    try {
      await updateCartQuantity({ productId, updatedQuantity }).unwrap();
    } catch (error) {
      errorToast(
        error?.message || error?.data || "Could not update cart quantity"
      );
      console.error(error);
    }
  };

  const removeProduct = async (productId) => {
    try {
      await deletItem({ productId });
      successToast("Product removed from cart");
    } catch (error) {
      errorToast(
        error?.message || error?.data || "Couldnt remove item from cart"
      );
    }
  };

  const subtotal = Array.isArray(products)
    ? products.reduce((total, product) => {
        const price = product?.productDetails?.price || 0;
        const productOffer = product?.productDetails?.offerPercent || 0;
        const categoryOffer = product?.productDetails?.category?.offer || 0;
        const quantity = product?.quantity || 0;

        const offerPercent = Math.min(productOffer + categoryOffer, 100);

        console.log(offerPercent);

        const discountedPrice = (price * (100 - offerPercent)) / 100;

        return total + discountedPrice * quantity;
      }, 0)
    : 0;

  const deliveryCharge =
    products.length > 0 ? (subtotal > 1000000 ? 0 : 15) : 0;
  const total = subtotal + deliveryCharge - discount;

  const isAnyProductOutOfStock = products.some(
    (product) => product?.productDetails?.stock < 1
  );

  const handleProceed = () => {
    navigate("/user/checkout");
  };

  //price after offer

  const finalPrice = (product) => {
    const effectiveOfferPercent =
      (product?.offerPercent || 0) + (product?.category?.offer || 0);

    return effectiveOfferPercent > 0
      ? (
          product.price -
          (product.price * effectiveOfferPercent) / 100
        ).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : product.price.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-darkBackground min-h-screen">
      {isLoading && (
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
          />
        </div>
      )}
      {isError && (
        <div className="text-red-500 text-center mt-4">
          Failed to load cart: {error?.data?.message || error?.message}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Cart Items */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
            Shopping Cart{" "}
            <span>({data?.totalProducts || cartItems?.length || 0})</span>
          </h1>

          {cartItems.length < 1 ? (
            <span className="block text-center dark:text-white mb-10">
              No products
            </span>
          ) : (
            products.map((product) => (
              <div
                key={product.productId}
                className="bg-white dark:bg-black dark:text-white shadow-md rounded-lg p-4 mb-4 flex items-center relative overflow-hidden"
              >
                {product?.productDetails?.stock < 1 && (
                  <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/50 dark:bg-black/50 flex flex-col items-center justify-center space-y-4">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                      <AlertOctagon className="mr-2" size={20} />
                      Out of Stock
                    </span>
                    <button
                      onClick={() => removeProduct(product.productId)}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-full hover:bg-red-200 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 size={16} />
                      <span>Remove from Cart</span>
                    </button>
                  </div>
                )}

                <img
                  src={product?.productDetails?.images[0]?.secure_url || ""}
                  alt="Product image is not available"
                  className={`w-24 h-24 object-cover mr-6 rounded ${
                    product?.productDetails?.stock < 1 ? "opacity-50" : ""
                  }`}
                />

                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">
                    {product?.productDetails?.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-300">
                    {product?.productDetails?.model}
                  </p>
                  <p className="text-primary font-bold">
                    <span className="text-gray-500 line-through mr-2">
                      ₹
                      {product?.productDetails?.price.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span>₹{finalPrice(product?.productDetails)}</span>
                  </p>

                  {product?.productDetails?.stock < 1 && (
                    <p className="text-red-500 font-semibold mt-2">
                      Currently Unavailable
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => decrementQuantity(product.productId)}
                    disabled={
                      product.quantity === 1 ||
                      product?.productDetails?.stock < 1
                    }
                    className={`p-2 rounded-full ${
                      product.quantity === 1 ||
                      product?.productDetails?.stock < 1
                        ? "bg-gray-300 dark:bg-slate-700 cursor-not-allowed"
                        : "bg-gray-200 dark:bg-slate-800"
                    }`}
                  >
                    <Minus size={20} />
                  </button>

                  <span className="font-bold">{product.quantity}</span>

                  <button
                    onClick={() => incrementQuantity(product.productId)}
                    disabled={
                      product?.productDetails?.stock < 1 ||
                      product.quantity >= 10
                    }
                    className={`p-2 rounded-full disabled:cursor-not-allowed disabled: dark:bg-slate-700 ${
                      product?.productDetails?.stock < 1
                        ? "bg-gray-300 dark:bg-slate-700 cursor-not-allowed"
                        : "bg-gray-200 dark:bg-slate-800"
                    }`}
                  >
                    <Plus size={20} />
                  </button>

                  <button
                    onClick={() => removeProduct(product.productId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}

          <Link to="/user/products" className="mt-6">
            <button className="bg-purple-800 text-white px-6 py-2 rounded hover:bg-purple-600 transition">
              Continue Shopping
            </button>
          </Link>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div className="bg-white dark:bg-black dark:text-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>
                {`${"\u20B9"}`}
                {subtotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Delivery</span>
              <span>
                {deliveryCharge === 0
                  ? "Free"
                  : `${"\u20B9"}${deliveryCharge.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Coupon Discount</span>
                <span>
                  -&#x20b9;
                  {discount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            <div className="border-t my-4"></div>

            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>
                {"\u20B9"}
                {total.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <button
              className={`w-full mt-6 bg-purple-800 text-white py-3 rounded hover:bg-purple-600 transition text-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed`}
              disabled={products.length < 1 || isAnyProductOutOfStock}
              onClick={handleProceed}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
