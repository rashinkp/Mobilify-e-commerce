import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import ReviewList from "../../components/admin/ReviewList";

const ProductManagement = () => {
  const [product, setProduct] = useState({
    name: "Smartphone X",
    model: "SMX123",
    category: "Electronics",
    mainImage: "https://via.placeholder.com/400x400",
    additionalImages: [
      "https://via.placeholder.com/200x200",
      "https://via.placeholder.com/200x200",
      "https://via.placeholder.com/200x200",
      "https://via.placeholder.com/200x200",
    ],
    description:
      "The Smartphone X features state-of-the-art technology with an ultra-fast processor, high-resolution camera, and sleek design.",
    offer: "25% off applied",
    specifications: {
      displaySize: "6.5 inches",
      weight: "180g",
      network: ["5G", "4G"],
      brand: "TechBrand",
      warranty: "1 year",
      returnPolicy: "30 days",
      codAvailable: true,
    },
    capacity: [
      {
        id: 1,
        storage: "64GB",
        ram: "4GB",
        stockCount: 20,
      },
      {
        id: 2,
        storage: "128GB",
        ram: "6GB",
        stockCount: 15,
      },
      {
        id: 3,
        storage: "256GB",
        ram: "8GB",
        stockCount: 10,
      },
    ],
    reviews: [
      {
        id: "REV001",
        comment: "Great product!",
        date: "2023-09-12",
        rating: 5,
      },
      {
        id: "REV002",
        comment: "Average experience.",
        date: "2023-10-05",
        rating: 3,
      },
    ],
  });

  const handleAddCapacity = () => {
    const newStorage = prompt("Enter new storage size (e.g., 512GB):");
    const newRam = prompt("Enter new RAM size (e.g., 8GB):");
    if (newStorage && newRam) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        capacity: [
          ...prevProduct.capacity,
          { id: Date.now(), storage: newStorage, ram: newRam, stockCount: 0 },
        ],
      }));
    }
  };

  const handleReduceStock = (id) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      capacity: prevProduct.capacity.map((item) =>
        item.id === id && item.stockCount > 0
          ? { ...item, stockCount: item.stockCount - 1 }
          : item
      ),
    }));
  };

  return (
    <div className="p-6 min-h-screen ">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center">
          <div className="flex-shrink-0">
            <img
              src={product.mainImage}
              alt="Main Product Image"
              className="w-24 h-24 sm:w-64 sm:h-64  rounded-lg border-4 border-white shadow-md"
            />
          </div>
          <div className="ml-3 sm:ml-6">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm">Model: {product.model}</p>
            <p className="text-sm">Category: {product.category}</p>
            <p className="text-sm text-green-500">{product.offer}</p>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 dark:bg-black  lg:grid-cols-2 gap-6 p-6">
          {/* Left Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Description
            </h2>
            <p className="mt-4 text-gray-600 dark:text-white">
              {product.description}
            </p>

            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">
              Product Specifications
            </h2>
            <ul className="mt-4 text-gray-600 dark:text-white space-y-2">
              <li>
                <strong>Display Size:</strong>{" "}
                {product.specifications.displaySize}
              </li>
              <li>
                <strong>Weight:</strong> {product.specifications.weight}
              </li>
              <li>
                <strong>Network:</strong>{" "}
                {product.specifications.network.join(", ")}
              </li>
              <li>
                <strong>Brand:</strong> {product.specifications.brand}
              </li>
              <li>
                <strong>Warranty:</strong> {product.specifications.warranty}
              </li>
              <li>
                <strong>Return Policy:</strong>{" "}
                {product.specifications.returnPolicy}
              </li>
              <li>
                <strong>COD Available:</strong>{" "}
                {product.specifications.codAvailable ? "Yes" : "No"}
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Images
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {product.additionalImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Additional Image ${index + 1}`}
                  className="w-full object-cover h-32 rounded-lg border border-gray-300 shadow-md"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Capacity Management */}
        <div className="p-6  dark:bg-black">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Capacity Management
          </h2>
          <button
            onClick={handleAddCapacity}
            className="bg-blue-600 text-white  px-4 py-2 rounded-md shadow hover:bg-blue-700 mt-4"
          >
            Add New Capacity
          </button>
          <div className="mt-6 space-y-4">
            {product.capacity.map((item) => (
              <div
                key={item.id}
                className="sm:flex  justify-between items-center p-4 border border-gray-300 rounded-md shadow-sm"
              >
                <div className="text-gray-800 dark:text-white">
                  <strong>Storage:</strong> {item.storage} |{" "}
                  <strong>RAM:</strong> {item.ram} | <strong>Stock:</strong>{" "}
                  {item.stockCount}
                </div>
                <div className="flex mt-5 sm:mt-0 items-center gap-7">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReduceStock(item.id)}
                      className="bg-skyBlue text-white px-2 py-1 rounded-md shadow"
                    >
                      <FontAwesomeIcon icon="fa-solid fa-minus" />
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={item.stockCount}
                      className="w-12 text-center border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={() => handleReduceStock(item.id)}
                      className="bg-skyBlue text-white px-2 py-1 rounded-md shadow"
                    >
                      <FontAwesomeIcon icon="fa-solid fa-plus" />
                    </button>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon="fa-solid fa-trash"
                      className="text-red-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div>
          <ReviewList reviews={product.reviews} />
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 dark:bg-black flex flex-col gap-2 sm:flex-row sm: justify-end">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700">
            <FontAwesomeIcon icon="fa-solid fa-pen" className="me-3" />
            Edit
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700">
            <FontAwesomeIcon icon="fa-solid fa-box-archive" className="me-3" />
            Archive
          </button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-700 ">
            <FontAwesomeIcon
              icon="fa-regular fa-file-zipper"
              className="me-3"
            />
            SoftDelete
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 ">
            <FontAwesomeIcon icon="fa-solid fa-trash" className="me-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
