import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useGetProductQuery } from "../../redux/slices/productApiSlice";
import { RotatingLines } from "react-loader-spinner";
import ReviewList from "../../components/admin/ReviewList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useProductApi from "../../hooks/useProductApi";
import { errorToast, successToast } from "../../components/toast";
import Modal from "../../components/Modal";
import ProductEditForm from "../../components/product/ProductEditForm.jsx";
import Button from "../../components/ui/Button";
import noImage from "../../assets/noImage.png";
import QunatityManage from "../../components/admin/QunatityManage";
import { Box, ChevronRight, Home } from "lucide-react";
import { format } from "date-fns";

const formatDateTime = (dateString) => format(new Date(dateString), "PPpp");

const ProductManagement = () => {
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isSoftDelModalOpen, setIsSoftDelModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { productId } = useParams();
  const { deleteProduct, updateProduct } = useProductApi();

  const {
    data: product = {},
    isLoading,
    error,
  } = useGetProductQuery(productId);
  const navigate = useNavigate();

  console.log(product);

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
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteProduct(product._id);
      successToast("Product deleted successfully");
      navigate(`/admin/manage-products`);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  const handleUpdate = () => {
    setIsEditModalOpen(true);
  };

  const handleSoftDelete = async () => {
    const data = product.isSoftDelete
      ? { isSoftDelete: false }
      : { isSoftDelete: true };
    try {
      await updateProduct({ productId: product._id, data });
      successToast(
        `${
          data.isSoftDelete
            ? "Successfully soft deleted"
            : "Successfully recovered"
        }`
      );
      setIsSoftDelModalOpen(false);
    } catch (error) {
      errorToast(
        error?.data?.message || error.message || "Failed to update product"
      );
      setIsSoftDelModalOpen(false);
    }
  };

  const handleMangeImages = () => {
    navigate(`/admin/manage-image/${product._id}`);
  };

  const finalPrice = () => {
    const effectiveOfferPercent =
      (product?.offerPercent || 0) + (product?.category?.offer || 0);

    return effectiveOfferPercent > 0
      ? (
          product.price -
          (product.price * effectiveOfferPercent) / 100
        ).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : product.price.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

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
                "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-300 px-5 py-2.5 rounded-lg font-medium transition-all",
            },
            {
              text: "Delete",
              action: handleDelete,
              style:
                "text-white bg-red-500 hover:bg-red-600 focus:ring-red-300 px-5 py-2.5 rounded-lg font-medium transition-all",
            },
          ]}
        />
      )}

      {isSoftDelModalOpen && (
        <Modal
          title={
            product.isSoftDelete
              ? "Are you sure to recover this product?"
              : "Are you sure to delete this product?"
          }
          description={
            product.isSoftDelete
              ? "This product will be restored and accessible for users again."
              : "Make sure before doing this process. This product won't be accessible for the user after that"
          }
          controles={[
            {
              text: "Cancel",
              action: () => setIsSoftDelModalOpen(false),
              style:
                "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-300 px-5 py-2.5 rounded-lg font-medium transition-all",
            },
            {
              text: product.isSoftDelete ? "Recover" : "Delete",
              action: handleSoftDelete,
              style:
                "text-white bg-red-500 hover:bg-red-600 focus:ring-red-300 px-5 py-2.5 rounded-lg font-medium transition-all",
            },
          ]}
        />
      )}

      {isEditModalOpen && (
        <ProductEditForm
          product={product}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      <div className="p-6 min-h-screen  dark:bg-gray-900">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm text-gray-500">
          <Link
            to="/admin"
            className="flex items-center hover:text-blue-600 transition-colors"
          >
            <Home size={16} className="mr-2" />
            Dashboard
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <Link
            to="/admin/manage-products"
            className="flex items-center hover:text-blue-600 transition-colors"
          >
            <Box size={16} className="mr-2" />
            Product Management
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-700">{product.name}</span>
        </div>

        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 ">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">
                  Model: {product.model || "N/A"}
                </span>
                <span className="text-gray-500">
                  Category: {product?.category?.name || "Not available"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full ${
                    product.isSoftDelete
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {product.isSoftDelete ? "Inactive" : "Active"}
                </span>
              </div>
            </div>
            <div className="text-right">
              {/* Actual Price with Strikethrough */}
              {product.offerPercent > 0 && (
                <div className="text-lg font-medium text-gray-500 line-through">
                  ₹
                  {product.price.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              )}

              {/* Discounted Price */}
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{finalPrice()}
              </div>

              {/* Offer Percentage */}
              {product.offerPercent > 0 && (
                <div className="text-green-600 font-medium mt-1">
                  {product.offerPercent + product?.category?.offer}% OFF
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Images Grid */}
            <div className="bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Product Images
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-lg"
                  >
                    <img
                      src={image.secure_url || noImage}
                      alt=""
                      className="mx-auto w-40 h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {product.description || "Description not available"}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 space-y-2">
              {/* Created At */}
              <div className="flex items-center gap-5">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                  Created At:
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {product.createdAt
                    ? formatDateTime(product.createdAt)
                    : "N/A"}
                </p>
              </div>

              {/* Last Updated At */}
              <div className="flex items-center gap-5">
                <h2 className="text-md font-semibold text-gray-800 dark:text-white">
                  Last Updated At:
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {product.updatedAt
                    ? formatDateTime(product.updatedAt)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Specifications */}
            <div className="bg-white dark:bg-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Product Specifications
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Size: {product.size || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Network: {product.network || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Storage: {product.storage || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      RAM: {product.ram || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Warranty: {product.warranty || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Return Policy: {product.returnPolicy ? "7 days" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      COD: {product.codAvailable ? "Available" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Management */}
            <div className="bg-white dark:bg-gray-800  p-6">
              <QunatityManage count={product.stock} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {/* <div className="mt-6 bg-white dark:bg-gray-800">
          <ReviewList reviews={reviews} />
        </div> */}

        {/* Action Buttons */}
        <div className="">
          <div className="flex justify-end mt-10">
            {/* Manage Images Button */}
            <button
              onClick={handleMangeImages}
              className="inline-flex items-center gap-2 px-4 py-2.5 hover:text-violet-700  transition-all duration-200 group"
            >
              <FontAwesomeIcon
                icon="fa-regular fa-image"
                className="text-sm transform group-hover:scale-110 transition-transform"
              />
              <span>Manage Images</span>
            </button>

            {/* Edit Product Button */}
            <button
              onClick={handleUpdate}
              className="inline-flex items-center gap-2 px-4 py-2.5 hover:text-blue-700  transition-all duration-200 group"
            >
              <FontAwesomeIcon
                icon="fa-solid fa-pen"
                className="text-sm transform group-hover:scale-110 transition-transform"
              />
              <span>Edit Product</span>
            </button>

            {/* Soft Delete/Recover Button */}
            <button
              onClick={() => setIsSoftDelModalOpen(true)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg  transition-all duration-200 group
            ${
              product?.isSoftDelete
                ? "hover:text-emerald-700 "
                : "hover:text-amber-700"
            }`}
            >
              <FontAwesomeIcon
                icon="fa-regular fa-file-zipper"
                className="text-sm transform group-hover:scale-110 transition-transform"
              />
              <span>
                {product?.isSoftDelete ? "Recover Product" : "Soft Delete"}
              </span>
            </button>

            {/* Delete Permanently Button */}
            <button
              onClick={handleDelete}
              disabled={true}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r hover:text-red-600 transition-all duration-200 opacity-50 cursor-not-allowed group"
            >
              <FontAwesomeIcon icon="fa-solid fa-trash" className="text-sm" />
              <span>Delete Permanently</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductManagement;
