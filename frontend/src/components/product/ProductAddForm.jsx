import React from "react";
import Form from "../Form";
import { productValidationSchema } from "../../validationSchemas";

const ProductAddForm = ({ isModalFormOpen, onClose, onSubmit }) => {
  const productFields = [
    {
      name: "name",
      label: "Product Name",
      type: "text",
      placeholder: "Enter new Product name",
      required: true,
    },
    {
      name: "description",
      label: "Product Description",
      type: "text",
      placeholder: "Enter description",
      required: true,
    },
    // {
    //   name: "brandId",
    //   label: "Brand",
    //   type: "select",
    //   placeholder: "Select brand",
    //   required: true,
    // },
    // {
    //   name: "categoryId",
    //   label: "Category",
    //   type: "select",
    //   placeholder: "Select category",
    //   required: true,
    // },
    {
      name: "offerPercent",
      label: "Offer Percent",
      type: "number",
      placeholder: "Enter offer percent",
      required: true,
    },
    {
      name: "returnPolicy",
      label: "Return Policy",
      type: "text",
      placeholder: "Enter return policy",
      required: false,
    },
    // {
    //   name: "COD",
    //   label: "Cash On Delivery",
    //   type: "select",
    //   placeholder:'Select an option',
    //   required: false,
    // },
    {
      name: "warranty",
      label: "Warranty",
      type: "text",
      placeholder: "Enter warranty details",
      required: true,
    },
    {
      name: "model",
      label: "Model",
      type: "text",
      placeholder: "Enter model",
      required: true,
    },
    {
      name: "size",
      label: "Size",
      type: "text",
      placeholder: "Enter size",
      required: true,
    },
    {
      name: "network",
      label: "Network",
      type: "text",
      placeholder: "Enter network",
      required: true,
    },
  ];

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
          validationRules={productValidationSchema}
        />
      </div>
    </div>
  );
};

export default ProductAddForm;
