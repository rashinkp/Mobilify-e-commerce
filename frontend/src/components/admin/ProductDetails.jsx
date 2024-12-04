import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import ArchiveButton from "../ui/ArchiveButton";
import SoftDeleteButton from "../ui/SoftDeleteButton";
import DeleteButton from "../ui/DeleteButton";
import EditButton from "../ui/EditButton";

const ProductDetails = () => {
  const [mainImage, setMainImage] = useState("/images/product1.jpg");

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
    color: ["Black", "Silver", "Rose Gold", "Blue"],
    capacities: [
      {
        storage: 64,
        ram: 4,
        price: 799,
        id: "basic",
      },
      {
        storage: 128,
        ram: 8,
        price: 999,
        id: "standard",
      },
      {
        storage: 256,
        ram: 16,
        price: 1299,
        id: "pro",
      },
      {
        storage: 512,
        ram: 32,
        price: 1599,
        id: "ultra",
      },
    ],
    physicalSpecs: {
      displaySize: "1.5-inch AMOLED",
      displayResolution: "390 x 450 pixels",
      weight: "48 grams",
      thickness: "10.7 mm",
      screenProtection: "Corning Gorilla Glass",
    },
    connectivity: {
      bluetooth: "5.0",
      wifi: "802.11 a/b/g/n",
      gps: "Yes",
      nfc: "Yes",
    },
    network: "4G LTE",
    stock: "In Stock",
  };

  const [selectedCapacity, setSelectedCapacity] = useState(
    product.capacities[0].id
  );

  const selectedCapacityDetails = selectedCapacity
    ? product.capacities.find((cap) => cap.id === selectedCapacity)
    : product.capacities[0];

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
            {thumbnails.map((thumb, index) => (
              <div
                key={index}
                className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                  mainImage === thumb
                    ? "border-blue-500"
                    : "border-transparent dark:border-gray-700"
                }`}
                onClick={() => setMainImage(thumb)}
              >
                <img
                  src={thumb}
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

          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{selectedCapacityDetails.price.toLocaleString()}
              </p>
              <p className="text-green-600 font-medium">
                {product.offer} Applied
              </p>
            </div>
          </div>
          <div className="flex flex-wrap  gap-3 p-4">
            {/* Edit Button */}
            <EditButton />

            {/* Archive Button */}
            <ArchiveButton />

            {/* Soft Delete Button */}
            <SoftDeleteButton />

            {/* Delete Permanently Button */}
            <DeleteButton />
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
              <div className="space-y-2 text-sm">
                {Object.entries(product.physicalSpecs).map(([key, value]) => (
                  <p key={key} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {value}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {/* Connectivity and Additional Details */}
            <div>
              <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Connectivity & Additional Info
              </h4>
              <div className="space-y-2 text-sm">
                {Object.entries(product.connectivity).map(([key, value]) => (
                  <p key={key} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {key.toUpperCase()}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {value}
                    </span>
                  </p>
                ))}
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
            <p className="text-gray-600 dark:text-gray-400 mb-1">Brand</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {product.brand}
            </p>
          </div>
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
            <p className="flex gap-10 items-center">
              <span className="text-gray-600 dark:text-gray-400">
                COD Available
              </span>
              <span
                className={`font-medium ${
                  product.codAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.codAvailable ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
