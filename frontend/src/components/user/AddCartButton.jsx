import React, { useState } from "react";
import { useAddToCartMutation } from "../../redux/slices/cartApiSlice";
import { successToast, errorToast } from "../toast";
import { RotatingLines } from "react-loader-spinner";
import { ShoppingCart, AlertCircle, ArrowBigRightDash } from "lucide-react";
import { useNavigate } from "react-router";
import { incrementCartCount } from "../../redux/slices/cartCount";
import { useDispatch, useSelector } from "react-redux";

const AddCartButton = ({
  disabled = false,
  productId,
  quantity,
  initialIsInCart,
}) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.userAuth);


  // Local state to manage cart status
  const [isInCart, setIsInCart] = useState(initialIsInCart);

  const handleAddButton = async () => {
    if (!productId) {
      errorToast("Product ID is missing");
      return;
    }

    if (!userInfo) {
      return navigate('/user/login')
    }


    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      dispatch(incrementCartCount());
      successToast("Product added to cart");
      setIsInCart(true); 
    } catch (error) {
      errorToast(
        error?.message ||
          error?.data?.message ||
          "Failed to add product to cart"
      );
    }
  };

  return (
    <div className="relative w-full">
      {isInCart ? (
        <button
          onClick={() => navigate("/user/cart")}
          disabled={disabled || isLoading}
          className={`group w-full px-6 py-3 rounded-lg 
          flex items-center justify-center gap-3
          font-medium transition-all duration-300
          ${
            disabled || isLoading
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 active:scale-98 hover:shadow-lg"
          }`}
        >
          <span
            className={`${
              disabled || isLoading ? "text-gray-400" : "text-white"
            }`}
          >
            Go to Cart
          </span>

          <ArrowBigRightDash
            className={`w-5 h-5 transition-transform group-hover:scale-110
            ${disabled || isLoading ? "text-gray-400" : "text-white"}
          `}
          />
        </button>
      ) : (
        <button
          onClick={handleAddButton}
          disabled={disabled || isLoading}
          className={`group w-full px-6 py-3 rounded-lg 
          flex items-center justify-center gap-3
          font-medium transition-all duration-300
          ${
            disabled || isLoading
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 active:scale-98 hover:shadow-lg"
          }`}
        >
          <ShoppingCart
            className={`w-5 h-5 transition-transform group-hover:scale-110
            ${disabled || isLoading ? "text-gray-400" : "text-white"}
          `}
          />
          <span
            className={`${
              disabled || isLoading ? "text-gray-400" : "text-white"
            }`}
          >
            Add to Cart
          </span>
        </button>
      )}

      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 rounded-lg backdrop-blur-sm" />
          <div className="relative z-10 flex items-center gap-2 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Out of Stock</span>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-indigo-600/10 backdrop-blur-sm">
          <RotatingLines width="32" strokeColor="#4f46e5" strokeWidth="3" />
        </div>
      )}
    </div>
  );
};

export default AddCartButton;
