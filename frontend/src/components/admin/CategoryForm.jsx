import React from "react";
import Form from "../Form";
import { categoryValidation } from "../../validationSchemas";

const CategoryForm = ({ isModalFormOpen, onClose, onSubmit }) => {
  const categoryFields = [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      placeholder: "Enter new Category",
      required: true,
    },
    {
      name: "description",
      label: "Category Description",
      type: "text",
      placeholder: "Enter description",
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
          fields={categoryFields}
          title="Add Category"
          buttonText="Add Category"
          onSubmit={onSubmit}
          validationRules={categoryValidation}
        />
      </div>
    </div>
  );
};

export default CategoryForm;
