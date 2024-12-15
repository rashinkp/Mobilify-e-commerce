import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useDeleteFromCartMutation, useGetCartQuery } from "../../redux/slices/cartApiSlice";
import { RotatingLines } from "react-loader-spinner";
import { Link } from "react-router";
import { errorToast, successToast } from "../../components/toast";

const ShoppingCart = () => {
  const { data = {}, isLoading, isError, error, refetch } = useGetCartQuery();
  const [deletItem] = useDeleteFromCartMutation();
  const cartItems = data?.cartItems || [];

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setProducts(cartItems);
    }
  }, [cartItems]);


  console.log(data)



  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id, change) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + change) }
          : product
      )
    );
  };

  const removeProduct = async(productId) => {
    try {
      await deletItem({ productId })
      successToast('Product removed from cart')
    } catch (error) {
      errorToast(error?.message || error?.data || 'Couldnt remove item from cart');
    }
  };

  // Ensure products is always an array when calling reduce
  const subtotal = Array.isArray(products)
    ? products.reduce(
        (total, product) => total + product?.productDetails?.price * product.quantity,
        0
      )
    : 0;

  const deliveryCharge = subtotal > 500 ? 0 : 15;
  const total = subtotal + deliveryCharge - discount;

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE20") {
      setDiscount(Math.min(subtotal * 0.2, 50));
    } else {
      setDiscount(0);
    }
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
            Shopping Cart <span>({data.totalProducts})</span>
          </h1>

          {products.map((product) => (
            <div
              key={product.productId}
              className="bg-white dark:bg-black dark:text-white shadow-md rounded-lg p-4 mb-4 flex items-center"
            >
              <img
                src={product?.productDetails?.images[0]?.secure_url}
                alt="Product image is not available"
                className="w-24 h-24 object-cover mr-6 rounded"
              />

              <div className="flex-grow">
                <h2 className="text-xl font-semibold">
                  {product?.productDetails?.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-300">
                  {product?.productDetails?.model}
                </p>
                <p className="text-primary font-bold">
                  ${product?.productDetails?.price}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => updateQuantity(product.productId, -1)}
                  className="p-2 bg-gray-200 dark:bg-slate-800 rounded-full"
                >
                  <Minus size={20} />
                </button>

                <span className="font-bold">{product.quantity}</span>

                <button
                  onClick={() => updateQuantity(product.productId, 1)}
                  className="p-2 bg-gray-200 rounded-full dark:bg-slate-800"
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
          ))}

          <Link to="/user/products" className="mt-6">
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
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
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Delivery</span>
              <span>
                {deliveryCharge === 0
                  ? "Free"
                  : `$${deliveryCharge.toFixed(2)}`}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Coupon Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t my-4"></div>

            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="mt-4 flex">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-grow p-2 border rounded-l dark:bg-slate-800 dark:border-none"
              />
              <button
                onClick={applyPromoCode}
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
              >
                Apply
              </button>
            </div>

            <button className="w-full mt-6 bg-green-500 text-white py-3 rounded hover:bg-green-600 transition text-lg font-bold">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
