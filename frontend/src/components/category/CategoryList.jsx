import React, { useState } from "react";
import ListItem from "../admin/ListItem";
import { successToast, errorToast } from "../../components/toast/index.js";
import Modal from "../Modal";
import { RotatingLines } from "react-loader-spinner";
import { useCategoryApi } from "../../hooks/useCategoryApi.jsx";
import CategoryEditForm from "./CategoryEditForm";
import { useEditCategoryMutation } from "../../redux/slices/categoryApiSlices.js";
import { Ban, DatabaseBackup, Pen } from "lucide-react";

const CategoryList = ({ categories, icon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [editCategory] = useEditCategoryMutation();

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleSoftDelete = async () => {
    const category = selectedCategory;
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
    } finally {
      setIsModalOpen(false);
    }
  };

  const getCategoryControles = (category) => [
    {
      action: () => handleEditCategory(category),
      style: "",
      icon: <Pen className="text-black" size={20} />,
    },
    {
      action: () => {
        setSelectedCategory(category);
        setIsModalOpen(true)
      },
      style: "",
      icon: category.isSoftDeleted ? (
        <DatabaseBackup
          className="text-gray-500 hover:text-green-600"
          size={20}
        />
      ) : (
        <Ban className="text-gray-500 hover:text-red-600" size={20} />
      ),
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
          description="Soft deleting the category can completely change the products and all in your website"
          controles={[
            {
              text: "Cancel",
              action: () => setIsModalOpen(false),
              style:
                "text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
            },
            {
              text: "Confirm",
              action: handleSoftDelete,
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
        items={categories || []}
        columns={categoryColumns}
        textColor="text-skyBlue"
        controles={getCategoryControles}
      />
    </>
  );
};

export default CategoryList;
