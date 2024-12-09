import React from "react";
import Form from "../Form";
import { productValidation} from "../../validationSchemas.js";
import {productFields} from '../product/ProductFields.js'
const ProductAddForm = ({ isModalFormOpen, onClose, onSubmit }) => {
  

  if (!isModalFormOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md "
      onClick={handleOverlayClick}
    >
      <div
        className="p-6 w-full max-w-lg rounded-lg shadow-lg h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Form
          fields={productFields}
          title="Add Product"
          buttonText="Add Product"
          onSubmit={onSubmit}
          validationRules={productValidation}
        />
      </div>
    </div>
  );
};

export default ProductAddForm;
