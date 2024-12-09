import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetProductQuery } from "../../redux/slices/productApiSlice";
import { RotatingLines } from "react-loader-spinner";
import ReviewList from "../../components/admin/ReviewList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useProductApi from "../../hooks/useProductApi";
import { errorToast, successToast } from "../../components/toast";
import Modal from "../../components/Modal";

const ProductManagement = () => {
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const { productId } = useParams();
  const {deleteProduct} = useProductApi()
  const { data: product, isLoading, error } = useGetProductQuery(productId);
  const navigate = useNavigate();
  const reviews = [
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
  ];

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

  const handleDelete = async() => {
    try {
      await deleteProduct(product._id)
      successToast('Product deleted successfully')
      navigate('/admin/manage-products')
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  }

  return (
    <>
      {isDelModalOpen && (
        <Modal
          title="Are you sure?"
          description="This process cannot be undone..."
          controles={[
            {
              text: "Cancel",
              action: () => setIsDelModalOpen(false),
              style:
                "text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
            },
            {
              text: "Delete",
              action: handleDelete,
              style:
                "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800",
            },
          ]}
        />
      )}
      <div className="p-6 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center">
            <div className="flex-shrink-0">
              <img
                alt="Main Product Image"
                className="w-24 h-24 sm:w-64 sm:h-64 rounded-lg border-4 border-white shadow-md"
              />
            </div>
            <div className="ml-3 sm:ml-6">
              <h1 className="text-2xl font-bold">
                {product.name || "Product name not available"}
              </h1>
              <p className="text-sm">
                Model: {product.model || "Model not available"}
              </p>
              <p className="text-sm">Brand: related</p>
              <p className="text-sm">Category: related</p>

              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{product.price || "N/A"}
              </p>
              <p className="text-green-600 font-medium">
                {product.offerPercent
                  ? `${product.offerPercent}% OFF Applied`
                  : "No offers available"}
              </p>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 dark:bg-black lg:grid-cols-2 gap-6 p-6">
            {/* Left Column */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Description
              </h2>
              <p className="mt-4 text-gray-600 dark:text-white">
                {product.description || "Description not available"}
              </p>

              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                Product Specifications
              </h2>
              <ul className="mt-4 text-gray-600 dark:text-white space-y-2">
                <li>
                  <strong>Size:</strong> {product.size || "N/A"}
                </li>
                <li>
                  <strong>Network:</strong>{" "}
                  {product.network ? product.network : "N/A"}
                </li>
                <li>
                  <strong>Warranty:</strong> {product.warranty || "N/A"}
                </li>
                <li>
                  <strong>Return Policy:</strong>{" "}
                  {product.returnPolicy || "N/A"}
                </li>
                <li>
                  <strong>COD Available:</strong>{" "}
                  {product.codAvailable ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Storage:</strong> {product.storage || "N/A"}
                </li>
                <li>
                  <strong>RAM:</strong> {product.ram || "N/A"}
                </li>
              </ul>
            </div>

            {/* Right Column */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Images
              </h2>
              <div className="mt-4 flex flex-wrap gap-4"></div>
            </div>
          </div>

          <div>
            <ReviewList reviews={reviews} />
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 dark:bg-black flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700">
              <FontAwesomeIcon icon="fa-solid fa-pen" className="me-3" />
              Edit
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700">
              <FontAwesomeIcon
                icon="fa-solid fa-box-archive"
                className="me-3"
              />
              Archive
            </button>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-700">
              <FontAwesomeIcon
                icon="fa-regular fa-file-zipper"
                className="me-3"
              />
              SoftDelete
            </button>
            <button
              onClick={() => setIsDelModalOpen(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700"
            >
              <FontAwesomeIcon icon="fa-solid fa-trash" className="me-3" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductManagement;
