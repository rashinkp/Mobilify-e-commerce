import React from "react";
import Form from "../Form.jsx";
import { productValidation } from "../../validationSchemas.js";
import { errorToast, successToast } from "../toast/index.js";
import useProductApi from "../../hooks/useProductApi.jsx";
import { productFields } from "./ProductFields.js";

const ProductEditForm = ({ product, onClose }) => {
  const { updateProduct } = useProductApi();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (data) => {

    try {
      updateProduct({ productId: product._id, data }).unwrap();
      successToast("Product updated successfully");
      onClose();
    } catch (error) {
      errorToast(
        error?.data?.message || error.message || "Failed to update product"
      );
    }
  };

 

  const response = productFields.map((item) => {
    return {...item,defaultValue:product[item.name]}
  })

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
          fields={response}
          onSubmit={handleSubmit}
          buttonText="Submit"
          validationRules={productValidation}
        />
      </div>
    </div>
  );
};

export default ProductEditForm;
