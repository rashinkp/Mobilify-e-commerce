import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import AddCartButton from './AddCartButton';

const ProductDetails = () => {

  const [mainImage, setMainImage] = useState("/images/product1.jpg"); // Default image

  const thumbnails = [
    "/images/product1.jpg",
    "/images/product2.jpg",
    "/images/product3.jpg",
    "/images/product4.jpg",
  ];

  const product = {
    name: "Stylish Smart Watch",
    model: "X100 Pro",
    stars: 4.5,
    reviewCount: 120,
    description:
      "A premium smartwatch with advanced fitness tracking, heart rate monitoring, and sleek design.",
    brand: "TechTime",
    offer: "25% OFF",
    returnPolicy: "30-day return policy",
    codAvailable: true,
    warranty: "1 Year Manufacturer Warranty",
    price: "₹9,999",
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto p-5 bg-[rgb(241,241,241)] dark:bg-black dark:text-white shadow-md rounded-md flex flex-col lg:flex-row gap-8">
        {/* Left Section: Images */}
        <div className="relative flex flex-col items-center lg:w-1/2">
          {/* Main Image Container */}
          <div className="w-full h-96 flex justify-center items-center border rounded-md overflow-hidden relative">
            <img
              src={mainImage}
              alt="Main Product"
              className="object-contain max-h-full"
            />
            {/* Love Icon */}
            <button
              className="absolute top-3 right-3 text-gray-400 dark:text-lightText hover:text-red-500 dark:hover:text-red-500"
              aria-label="Add to Wishlist"
            >
              <FontAwesomeIcon icon="fa-regular fa-heart" size="lg" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex mt-4 gap-3">
            {thumbnails.map((thumb, index) => (
              <div
                key={index}
                className={`w-16 h-16 border rounded-md overflow-hidden cursor-pointer ${
                  mainImage === thumb ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setMainImage(thumb)}
              >
                <img
                  src={thumb}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-lightText">
            {product.name}
          </h1>
          <p className="text-gray-600 dark:text-lightText">
            Model: <span className="font-medium">{product.model}</span>
          </p>

          {/* Ratings */}
          <div className="flex items-center mb-4">
            <span className="text-green-500 text-sm flex gap-1">
              <FontAwesomeIcon icon="fa-solid fa-star" />
              <FontAwesomeIcon icon="fa-solid fa-star" />
              <FontAwesomeIcon icon="fa-solid fa-star" />
              <FontAwesomeIcon icon="fa-solid fa-star" />
              <FontAwesomeIcon icon="fa-solid fa-star" />
            </span>
            <span className="text-darkGray dark:text-lightText ml-2">
              ({product.reviewCount})
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-lightText">
            {product.description}
          </p>

          {/* Additional Details */}
          <div className="space-y-2 text-sm text-gray-600 dark:text-lightText">
            <p>
              Brand: <span className="font-medium">{product.brand}</span>
            </p>
            <p>
              Offer:{" "}
              <span className="text-green-600 font-medium">
                {product.offer}
              </span>
            </p>
            <p>Return Policy: {product.returnPolicy}</p>
            <p>COD Available: {product.codAvailable ? "Yes" : "No"}</p>
            <p>Warranty: {product.warranty}</p>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex flex-col gap-3 mt-5">
            <p className="text-2xl font-bold text-gray-800 dark:text-lightText">
              {product.price}
            </p>
            <AddCartButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails