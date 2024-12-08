import React, { useState } from "react";
import ListItem from "../admin/ListItem";
import { successToast, errorToast } from "../../components/toast/index.js";
import Modal from "../Modal";
import { RotatingLines } from "react-loader-spinner";
import { useCategoryApi } from "../../hooks/useCategoryApi.jsx";
import CategoryEditForm from "./CategoryEditForm";
import { useEditCategoryMutation } from "../../redux/slices/categoryApiSlices.js";

const CategoryList = ({ categories, icon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { deleteCategory } = useCategoryApi();
  const [editCategory] = useEditCategoryMutation();

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

  const handleSoftDelete = async (category) => {
    const data = { isSoftDeleted: !category.isSoftDeleted };

    try {
      await editCategory({
        categoryId: category._id,
        data,
      }).unwrap();
      successToast(
        `${
          data.isSoftDeleted
            ? "Category soft-deleted successfully"
            : "Category recovered successfully"
        }`
      );
    } catch (error) {
      errorToast(
        error?.data?.message || error.message || "Failed to update category"
      );
    }
  };

  const getCategoryControles = (category) => [
    {
      text: "Edit",
      action: () => handleEditCategory(category),
      style: "bg-green-700 hover:bg-green-800",
      icon: "fa-solid fa-pen",
    },
    {
      text: category.isSoftDeleted ? "Recover" : "SoftDelete",
      action: () => handleSoftDelete(category),
      style: "bg-yellow-700 hover:bg-yellow-800",
      icon: category.isSoftDeleted ? "fa-solid fa-hammer" : "fa-solid fa-ban",
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
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            !value ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {!value ? "Active" : "Inactive"}
        </span>
      ),
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
