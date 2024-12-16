import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { successToast, errorToast } from "../toast";
import { useAddToCartMutation } from "../../redux/slices/cartApiSlice";
import { RotatingLines } from "react-loader-spinner";
import { Ban } from "lucide-react";

const AddCartButton = ({ disabled = false, productId, quantity }) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAddButton = async () => {
    if (!productId) {
      errorToast("Product ID is missing");
      return;
    }

    try {
      // Trigger the add to cart mutation
      const response = await addToCart({ productId, quantity: 1 }).unwrap();
      successToast("Product added to cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      errorToast(error?.message || error?.data?.message||"Failed to add product to cart");
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={handleAddButton}
        className={`flex items-center justify-center border rounded-full py-2 px-4 w-full transition-all duration-300 
          ${
            disabled || isLoading
              ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
              : "border-darkText text-darkText dark:text-lightText dark:border-lightText hover:bg-darkText hover:text-lightText"
          }`}
        disabled={disabled || isLoading}
      >
        <span className="mr-2">
          <FontAwesomeIcon
            icon={["fas", "cart-shopping"]}
            size="lg"
            className={`
              ${
                disabled || isLoading
                  ? "text-gray-400"
                  : "dark:text-lightText  text-darkText"
              }`}
          />
        </span>
        {disabled ? "Out of Stock" : "Add to Cart"}
      </button>

      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-white/70 dark:bg-black/70 rounded-full"></div>
          <div className="relative z-2 flex items-center space-x-2 text-red-600">
            <Ban className="w-5 h-5" />
            <span className="font-semibold text-sm">Out of Stock</span>
          </div>
        </div>
      )}

      {isLoading && (
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
      )}
    </div>
  );
};

export default AddCartButton;
