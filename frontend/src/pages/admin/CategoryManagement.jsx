import React, { useState } from "react";
import Form from "../../components/Form.jsx";
import ListItem from "../../components/admin/ListItem.jsx";
import { RotatingLines } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../components/Modal.jsx";
import { categoryValidation } from "../../validationSchemas.js";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
} from "../../redux/slices/categoryApiSlices.js";
import { errorToast, successToast } from "../../components/toast/index.js";

const CategoryManagement = () => {
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  //api's

  const [addCategory] = useAddCategoryMutation();

  const { data: categories, isLoading } = useGetAllCategoryQuery();
  const [deleteCategory] = useDeleteCategoryMutation()

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

  // List action methods
  const handleEdit = (category) => {
    console.log(category);
  };

  const handleSoftDelete = (category) => {
    console.log(category);
  };

  const handleDeleteBrand = async () => {
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      successToast('Category deleted');
      setIsModalOpen(false);
      setSelectedCategory(null)
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  // Form action method
  const handleAddCategory = async (data) => {
    try {
      await addCategory(data).unwrap();
      successToast("Category Added successfully");
      setIsModalFormOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  //to close the modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setIsModalFormOpen(false);
  };

  //control warning modal
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
    { key: "isSoftDeleted", label: "SoftDelete", render: (value) => value },
  ];

  const getCategoryControles = (category) => [
    {
      text: "Edit",
      action: handleEdit(category),
      style: "bg-red-700 hover:bg-red-800",
      icon: "fa-solid fa-pen",
    },
    {
      text: "SoftDelete",
      action: handleSoftDelete(category),
      style: "bg-red-700 hover:bg-red-800",
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
          description="This process cannot be undone. Make sure you are doing the right thing."
          controles={modalControles}
        />
      )}
      {isModalFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
          onClick={handleOverlayClick}
        >
          <div className="p-6 w-full max-w-lg ">
            <Form
              fields={categoryFields}
              title="Add Category"
              buttonText="Add Category"
              onSubmit={handleAddCategory}
              validationRules={categoryValidation}
            />
          </div>
        </div>
      )}

      <button
        className="bg-skyBlue hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
        onClick={() => setIsModalFormOpen(true)}
      >
        <FontAwesomeIcon icon="fa-solid fa-layer-group" /> Add Category
      </button>

      <div className="w-full max-w-5xl">
        <ListItem
          title="Category List"
          items={categories || []}
          columns={categoryColumns}
          icon="fa-solid fa-layer-group"
          textColor="text-skyBlue"
          controles={getCategoryControles}
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
