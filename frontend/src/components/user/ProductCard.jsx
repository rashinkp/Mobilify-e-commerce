import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddCartButton from "./AddCartButton";
import { useNavigate } from "react-router";
import noImage from '../../assets/noImage.png'

const ProductCard = ({ product }) => {
  const { name, price, description, _id } = product;
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/user/product/${_id}`)
  }
  return (
    <>
      <div className="cursor-pointer">
        <div
          onClick={handleClick}
          className="border rounded-lg shadow-lg overflow-hidden w-80 bg-lightBackground h-72 flex justify-center items-center dark:bg-darkBackground"
        >
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
              src={product?.images[0]?.secure_url || noImage}
              alt="Product"
            />
          </div>
        </div>

        <div className="overflow-hidden w-80">
          {/* Lower part: Name, price, description, and rating */}
          <div className="p-4">
            <div
              onClick={handleClick}
              className="flex justify-between items-center mb-2"
            >
              <h3 className="text-lg font-semibold dark:text-lightText">
                {name}
              </h3>
              <span className="text-darkText font-extrabold text-lg dark:text-lightText">
                ${price}
              </span>
            </div>
            <p className="text-darkGray mb-2">{description}</p>
            <div onClick={handleClick} className="flex items-center mb-4">
              <span className="text-green-500 text-sm flex gap-1">
                <FontAwesomeIcon icon="fa-solid fa-star" />
                <FontAwesomeIcon icon="fa-solid fa-star" />
                <FontAwesomeIcon icon="fa-solid fa-star" />
                <FontAwesomeIcon icon="fa-solid fa-star" />
                <FontAwesomeIcon icon="fa-solid fa-star" />
              </span>
              <span className="text-darkGray ml-2">(156)</span>
            </div>
            <AddCartButton productId={product._id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
