import React, { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import CategoryForm from "../../components/admin/CategoryForm";
import CategoryList from "../../components/admin/CategoryList";
import Modal from "../../components/Modal";
import { useCategoryApi } from "../../hooks/useCategoryApi.jsx";
import { successToast, errorToast } from "../../components/toast/index.js";
import Button from "../../components/ui/Button.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CategoryManagement = () => {
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addCategory, deleteCategory, categories, isLoading } =
    useCategoryApi();

  const handleAddCategory = async (data) => {
    try {
      await addCategory(data).unwrap();
      successToast("Category Added successfully");
      setIsModalFormOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  const handleDeleteBrand = async () => {
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      successToast("Category deleted");
      setIsModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  const modalControles = [
    {
      text: "Cancel",
      action: () => setIsModalOpen(false),
      style:
        "text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
    },
    {
      text: "Delete",
      action: handleDeleteBrand,
      style:
        "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800",
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

  const getCategoryControles = (category) => [
    {
      text: "Edit",
      action: () => console.log(category),
      style: "bg-green-700 hover:bg-green-800",
      icon: "fa-solid fa-pen",
    },
    {
      text: "SoftDelete",
      action: () => console.log(category),
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

  return (
    <div className="p-5 sm:p-10 flex flex-col gap-6 items-center">
      {isModalOpen && (
        <Modal
          title="Are you sure?"
          description="This process cannot be undone..."
          controles={modalControles}
        />
      )}
      <CategoryForm
        isModalFormOpen={isModalFormOpen}
        onClose={() => setIsModalFormOpen(false)}
        onSubmit={handleAddCategory}
      />
      <Button
        icon={<FontAwesomeIcon icon="fa-solid fa-layer-group" />}
        text="Add Category"
        colorStyle="bg-skyBlue hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
        action={() => setIsModalFormOpen(true)}
      />

      <div className="w-full max-w-5xl">
        <CategoryList
          categories={categories}
          categoryColumns={categoryColumns}
          getCategoryControles={getCategoryControles}
          icon="fa-solid fa-layer-group"
        />
      </div>
      {isLoading && (
        <div className="h-screen w-full absolute top-0 z-50 left-0 backdrop-blur-sm bg-black/30 flex justify-center items-center">
          <RotatingLines
            visible={true}
            height="50"
            width="50"
            color="grey"
            strokeColor="#fff"
            strokeWidth="2"
            animationDuration="8"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
