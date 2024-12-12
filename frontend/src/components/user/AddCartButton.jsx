import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const AddCartButton = ({ disabled = false }) => {
  return (
    <>
      <button
        className={`flex items-center justify-center border border-darkText rounded-full py-2 px-4 w-full text-darkText dark:text-lightText dark:border-lightText 
          ${
            disabled
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "hover:bg-darkText hover:text-lightText"
          }`}
        disabled={disabled}
      >
        <span className="mr-2">
          <FontAwesomeIcon
            icon={["fas", "cart-shopping"]}
            size="lg"
            className={`dark:text-lightText ${disabled ? "text-gray-500" : ""}`}
          />
        </span>
        Add to Cart
      </button>
    </>
  );
};

export default AddCartButton;
