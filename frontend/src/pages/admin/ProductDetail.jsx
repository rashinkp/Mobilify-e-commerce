import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
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

const ProductManagement = () => {
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { productId } = useParams();
  const { deleteProduct, updateProduct } = useProductApi();

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
    } catch (error) {
      errorToast(
        error?.data?.message || error.message || "Failed to update product"
      );
    }
  };

  const handleMangeImages = () => {
    navigate(`/admin/manage-image/${product._id}`);
  };


  const handleUpdateStock = () => {

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

      {isEditModalOpen && (
        <ProductEditForm
          product={product}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      <div className="p-6 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center">
            <div className="flex-shrink-0">
              <img
                src={product?.images[0]?.secure_url || noImage}
                alt="Main Product Image"
                className="w-24 h-24 sm:w-64 sm:h-64 rounded-lg border-4 border-white shadow-md object-cover"
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
              <p className="text-sm">Category: { product.category}</p>

              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{product.price || "N/A"}
              </p>
              <p className="text-green-600 font-medium">
                {product.offerPercent
                  ? `${product.offerPercent}% OFF Applied`
                  : "No offers available"}
              </p>

              <p
                className={`${
                  product.isSoftDelete ? `text-red-600` : "text-green-600"
                } font-bold`}
              >
                {product.isSoftDelete ? `Inactive` : "Active"}
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

              <QunatityManage count={product.stock} />
            </div>

            {/* Right Column */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Images
              </h2>
              <div className="mt-4 flex flex-wrap gap-4">
                {product?.images?.map((image, index) => (
                  <div className="w-44 h-44 border border-gray-200" key={index}>
                    <img
                      src={image.secure_url || noImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <ReviewList reviews={reviews} />
          </div>

          {/* Action Buttons */}
        </div>
        <div className="p-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            icon={<FontAwesomeIcon icon="fa-regular fa-image" />}
            text="Mange Images"
            action={handleMangeImages}
          />
          <Button
            icon={<FontAwesomeIcon icon="fa-solid fa-pen" />}
            text="Edit Product"
            action={handleUpdate}
          />
          <Button
            icon={
              <FontAwesomeIcon
                icon="fa-regular fa-file-zipper"
                className="me-3"
              />
            }
            text="Soft Delete"
            action={handleSoftDelete}
          />
          <Button
            icon={<FontAwesomeIcon icon="fa-solid fa-trash" className="me-3" />}
            text="Delete Permanantly"
            action={() => setIsDelModalOpen(true)}
          />
        </div>
      </div>
    </>
  );
};

export default ProductManagement;
