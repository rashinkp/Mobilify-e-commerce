import React, { useState } from "react";
import ListItem from "../admin/ListItem";
import { successToast, errorToast } from "../../components/toast/index.js";
import Modal from "../Modal";
import { RotatingLines } from "react-loader-spinner";
import { useCategoryApi } from "../../hooks/useCategoryApi.jsx";
import CategoryEditForm from "./CategoryEditForm";

const CategoryList = ({ categories, icon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { deleteCategory } = useCategoryApi();

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      successToast("Category deleted");
      setIsModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleSoftDeleteCategory = (category) => {
    console.log("Soft delete logic for:", category);
    // Add your soft-delete logic here
  };

  const getCategoryControles = (category) => [
    {
      text: "Edit",
      action: () => handleEditCategory(category),
      style: "bg-green-700 hover:bg-green-800",
      icon: "fa-solid fa-pen",
    },
    {
      text: "SoftDelete",
      action: () => handleSoftDeleteCategory(category),
      style: "bg-yellow-700 hover:bg-yellow-800",
      icon: "fa-solid fa-ban",
    },
    {
      text: "Delete",
      action: () => {
        setSelectedCategory(category);
        setIsModalOpen(true);
      },
      style: "bg-red-700 hover:bg-red-800",
      icon: "fa-solid fa-trash",
    },
  ];

  const categoryColumns = [
    { key: "name", label: "Category Name", render: (value) => value },
    { key: "description", label: "Description", render: (value) => value },
    {
      key: "isSoftDeleted",
      label: "SoftDelete",
      render: (value) => (value ? "True" : "False"),
    },
  ];

  return (
    <>
      {isModalOpen && (
        <Modal
          title="Are you sure?"
          description="This process cannot be undone..."
          controles={[
            {
              text: "Cancel",
              action: () => setIsModalOpen(false),
              style:
                "text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
            },
            {
              text: "Delete",
              action: handleDeleteCategory,
              style:
                "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800",
            },
          ]}
        />
      )}
      {isEditModalOpen && (
        <CategoryEditForm
          category={selectedCategory}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      <ListItem
        title="Category List"
        items={categories || []}
        columns={categoryColumns}
        icon={icon}
        textColor="text-skyBlue"
        controles={getCategoryControles}
      />
    </>
  );
};

export default CategoryList;
