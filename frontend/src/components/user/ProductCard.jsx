import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductCard = () => {
  return (
    <>
      <div>
        <div className="border rounded-lg shadow-lg overflow-hidden w-96 bg-white h-96 px-4 pt-3">
          {/* Upper part: Love icon and product image */}
          <div className="p-4">
            <div className="flex justify-end mb-2">
              <span className="text-xl cursor-pointer flex justify-center  rounded-3xl w-12 h-12 items-center bg-black">
                <FontAwesomeIcon
                  icon={["far", "heart"]}
                  size="lg"
                  className="cursor-pointer text-white"
                />
              </span>
            </div>
            <img
              className="w-full h-64 object-cover rounded-md"
              src="https://via.placeholder.com/300"
              alt="Product"
            />
          </div>
        </div>

        <div className="overflow-hidden w-96">
          {/* Lower part: Name, price, description, and rating */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Iphone 16 Pro Max</h3>
              <span className="text-black font-extrabold text-lg">$175</span>
            </div>
            <p className="text-gray-600 mb-2">
              Description of the product goes here.
            </p>
            <div className="flex items-center mb-4">
              <span className="text-green-500 text-sm flex gap-1">
                <FontAwesomeIcon icon="fa-solid fa-star" />
                <FontAwesomeIcon icon="fa-solid fa-star" />
                <FontAwesomeIcon icon="fa-solid fa-star" />
                <FontAwesomeIcon icon="fa-solid fa-star" />
                <FontAwesomeIcon icon="fa-solid fa-star" />
              </span>
              <span className="text-gray-500 ml-2">(156)</span>
            </div>
            <button className="flex items-center justify-center border border-black rounded-full py-2 px-4 w-full text-black hover:border-purple-700">
              <span className="mr-2">
                <FontAwesomeIcon
                  icon={["fas", "cart-shopping"]}
                  size="lg"
                  className="cursor-pointer hover:text-purple-700"
                />
              </span>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
