import React from "react";
import Form from "../Form.jsx";
import { categoryValidation } from "../../validationSchemas.js";
import { useEditCategoryMutation } from "../../redux/slices/categoryApiSlices.js";
import { errorToast, successToast } from "../toast/index.js";

const CategoryEditForm = ({ category, onClose }) => {
  const [editCategory] = useEditCategoryMutation();
  const categoryFields = [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      placeholder: "Enter category name",
      required: true,
      defaultValue: category?.name || "",
    },
    {
      name: "offer",
      label: "Offer Percentage",
      type: "number",
      placeholder: "Enter category offer percentage",
      required: true,
      defaultValue: category?.offer || "",
    },
    {
      name: "description",
      label: "Category Description",
      type: "text",
      placeholder: "Enter category description",
      required: true,
      defaultValue: category?.description || "",
    },
  ];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async(data) => {
    try {
      await editCategory({categoryId:category._id, data}).unwrap();
      successToast("Category updated successfully");
      onClose();
    } catch (error) {
       errorToast(
         error?.data?.message || error.message || "Failed to update category"
       );
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
          title="Edit Category"
          fields={categoryFields}
          onSubmit={handleSubmit}
          buttonText="Submit"
          validationRules={categoryValidation}
        />
      </div>
    </div>
  );
};

export default CategoryEditForm;
