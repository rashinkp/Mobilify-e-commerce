import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddCartButton from "./AddCartButton";

const ProductCard = () => {
  return (
    <>
      <div className="cursor-pointer">
        <div className="border rounded-lg shadow-lg overflow-hidden w-80 bg-lightBackground h-72 flex justify-center items-center dark:bg-darkBackground">
          {/* Upper part: Love icon and product image */}
          <div className="relative px-2">
            <span className="absolute top-3 right-4 text-xl cursor-pointer flex justify-center rounded-3xl w-10 h-10 items-center bg-darkText dark:bg-darkBackground">
              <FontAwesomeIcon
                icon={["far", "heart"]}
                size="sm"
                className="cursor-pointer text-lightText"
              />
            </span>
            <img
              className=" w-64 h-60 object-cover rounded-md"
              src="https://via.placeholder.com/300"
              alt="Product"
            />
          </div>
        </div>

        <div className="overflow-hidden w-80">
          {/* Lower part: Name, price, description, and rating */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold dark:text-lightText">
                Iphone 16 Pro Max
              </h3>
              <span className="text-darkText font-extrabold text-lg dark:text-lightText">
                $175
              </span>
            </div>
            <p className="text-darkGray mb-2">
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
              <span className="text-darkGray ml-2">(156)</span>
            </div>
            <AddCartButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
