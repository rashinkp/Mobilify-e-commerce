import React from "react";
import Form from "../Form.jsx";
import { productValidation } from "../../validationSchemas.js";
import { errorToast, successToast } from "../toast/index.js";
import useProductApi from "../../hooks/useProductApi.jsx";
import { useCategoryApi } from "../../hooks/useCategoryApi.jsx";
import { getProductFields } from "../product/productFields.js";
import { useGetAllCategoryQuery } from "../../redux/slices/categoryApiSlices.js";

const ProductEditForm = ({ product, onClose }) => {
  const { updateProduct } = useProductApi();
  const { data: categories = [], isLoading } = useGetAllCategoryQuery({
    filterBy: "All",
  });

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  // Generate fields with default values using the product object
  const productFields = getProductFields(categoryOptions, product);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (data) => {
    try {
      await updateProduct({ productId: product._id, data }).unwrap();
      successToast("Product updated successfully");
      onClose();
    } catch (error) {
      errorToast(
        error?.data?.message || error.message || "Failed to update product"
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
      onClick={handleOverlayClick}
    >
      <div
        className="p-6 w-full max-w-lg rounded-lg shadow-lg h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Form
          title="Update Product"
          fields={productFields}
          onSubmit={handleSubmit}
          buttonText="Submit"
          validationRules={productValidation}
        />
      </div>
    </div>
  );
};

export default ProductEditForm;
