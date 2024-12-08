import React from "react";
import Form from "../Form";
import {
  brandValidationSchema
} from "../../validationSchemas";

const BrandForm = ({ isModalFormOpen, onClose, onSubmit }) => {
  const brandFields = [
    {
      name: "name",
      label: "Brand Name",
      placeholder: "Enter brand name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Brand Description",
      placeholder: "Enter brand description",
      type: "text",
      required: true,
    },
    {
      name: "website",
      label: "Website",
      placeholder: "Enter brand website URL",
      type: "text",
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
      onClick={handleOverlayClick}
    >
      <div
        className="p-6 w-full max-w-lg rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Form
          fields={brandFields}
          title="Add Category"
          buttonText="Add Category"
          onSubmit={onSubmit}
          validationRules={brandValidationSchema}
        />
      </div>
    </div>
  );
};

export default BrandForm;
