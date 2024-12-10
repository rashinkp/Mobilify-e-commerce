import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import AddCartButton from "../components/user/AddCartButton";
import { useParams } from "react-router";
import { useGetProductQuery } from "../redux/slices/productApiSlice";
import { RotatingLines } from "react-loader-spinner";
import noImage from '../assets/noImage.png'

const ProductDetails = () => {
  const { id } = useParams();
  
  const { data: product, isLoading, error } = useGetProductQuery(id);

  const [mainImage, setMainImage] = useState(noImage);
  
  useEffect(() => {
    setMainImage(product?.images[0]?.secure_url);
  },[product])

  


if (isLoading) {
  return (
    <div>
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
    </div>
  );
}
  return (
    <div className="max-w-6xl mx-auto p-5 bg-white dark:bg-black shadow-lg rounded-xl">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Section: Images */}
        <div className="relative ">
          <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={mainImage}
              alt="Main Product"
              className="max-h-full max-w-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-red-500 transition"
              aria-label="Add to Wishlist"
            >
              <FontAwesomeIcon icon="fa-regular fa-heart" size="xl" />
            </button>
          </div>

          <div className="flex justify-center mt-4 space-x-3">
            {product.images.map((thumb, index) => (
              <div
                key={index}
                className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                  mainImage === thumb
                    ? "border-blue-500"
                    : "border-transparent dark:border-gray-700"
                }`}
                onClick={() => setMainImage(thumb.secure_url)}
              >
                <img
                  src={thumb.secure_url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Model: <span className="font-semibold">{product.model}</span>
            </p>

            <div className="flex items-center mt-3">
              <div className="flex text-yellow-500 space-x-1 mr-2">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon="fa-solid fa-star"
                    className={
                      i < Math.floor(product.stars)
                        ? "text-yellow-500"
                        : "text-gray-300 dark:text-gray-600"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({product.reviewCount} Reviews)
              </span>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300">
            {product.description}
          </p>

          {/* Capacity Selection */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Select Storage & RAM:
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {product.capacities.map((capacity) => (
                <button
                  key={capacity.id}
                  onClick={() => setSelectedCapacity(capacity.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedCapacity === capacity.id
                      ? "bg-skyBlue text-white border-blue-600"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="font-bold">
                    {capacity.storage}GB / {capacity.ram}GB RAM
                  </div>
                  <div className="text-sm">
                    ₹{capacity.price.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div> */}

          {/* Color Selection */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Select Color:
            </h3>
            <div className="grid sm:grid-cols-4  gap-3">
              {product.color.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedVariant(color)}
                  className={`p-2 rounded-lg border-2 ${
                    selectedVariant === color
                      ? "border-skyBlue bg-skyBlue dark:bg-skyBlue text-lightText"
                      : "border-gray-200 dark:border-gray-700 dark:text-lightText hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div> */}

          {/* Price and Cart */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{product.price}
              </p>
              <p className="text-green-600 font-medium">
                {product.offerPercent}% OFF Applied
              </p>
            </div>
            <AddCartButton />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-16">
        {/* Product Specifications */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-800 ">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            Product Specifications
          </h3>
          <div className="grid md:grid-cols-1 gap-7">
            {/* Physical Specifications */}
            <div>
              <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Physical Details
              </h4>
              <p className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Size</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {product.size}
                </span>
              </p>

              <p className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">RAM</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {product.ram}
                </span>
              </p>

              <p className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Storage</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {product.storage}
                </span>
              </p>
            </div>

            {/* Connectivity and Additional Details */}
            <div>
              <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Connectivity & Additional Info
              </h4>
              <div className="space-y-2 text-sm">
                {/* add here also */}
                <p className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Network
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {product.network}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-800 grid grid-cols-1 gap-1 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">Warranty</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {product.warranty}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              Return Policy
            </p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {product.returnPolicy}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              Stock Status
            </p>
            <p
              className={`font-semibold ${
                product.stock >= 20 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock}
            </p>
          </div>

          <div>
            <p className="flex gap-10 items-center">
              <span className="text-gray-600 dark:text-gray-400">
                COD Available
              </span>
              <span
                className={`font-medium ${
                  product.COD ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.COD ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
