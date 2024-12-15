import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { successToast, errorToast } from "../toast";
import { useAddToCartMutation } from "../../redux/slices/cartApiSlice";
import { RotatingLines } from "react-loader-spinner";
const AddCartButton = ({ disabled = false, productId , quantity }) => {
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
      errorToast("Failed to add product to cart");
    }
  };



  return (
    <>
      <button
        onClick={handleAddButton}
        className={`flex items-center justify-center border border-darkText rounded-full py-2 px-4 w-full text-darkText dark:text-lightText dark:border-lightText 
          ${
            disabled || isLoading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "hover:bg-darkText hover:text-lightText"
          }`}
        disabled={disabled || isLoading}
      >
        <span className="mr-2">
          <FontAwesomeIcon
            icon={["fas", "cart-shopping"]}
            size="lg"
            className={`dark:text-lightText ${
              disabled || isLoading ? "text-gray-500" : ""
            }`}
          />
        </span>
        Add to cart
      </button>
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
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
    </>
  );
};

export default AddCartButton;
