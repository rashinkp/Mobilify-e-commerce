import React, { useState } from "react";
import CategoryForm from "../../components/category/CategoryForm.jsx";
import CategoryList from "../../components/category/CategoryList.jsx";
import Button from "../../components/ui/Button.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import { useCategoryApi } from "../../hooks/useCategoryApi.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RotatingLines } from "react-loader-spinner";
import { errorToast, successToast } from "../../components/toast/index.js";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router";

const CategoryManagement = () => {
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { addCategory, categories, isLoading } = useCategoryApi();

  const displayedCategory =
    searchTerm.trim() === ""
      ? categories
      : categories?.filter((category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const handleAddCategory = async (data) => {
    try {
      await addCategory(data).unwrap();
      successToast("Category added successfully");
      setIsModalFormOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  return (
    <div className="">
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <Link to="/admin" className="flex items-center hover:text-blue-600">
          <Home size={16} className="mr-2" />
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700">Category Management</span>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Category Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage and monitor your category
        </p>
      </div>
      <CategoryForm
        isModalFormOpen={isModalFormOpen}
        onClose={() => setIsModalFormOpen(false)}
        onSubmit={handleAddCategory}
      />
      <SearchBar searchTerm={setSearchTerm} />

      <div className="flex justify-end">
        <button
          onClick={() => setIsModalFormOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg flex items-center gap-2 transition duration-200"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" />
          Add Category
        </button>
      </div>

      <div className="">
        <CategoryList
          categories={displayedCategory}
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
          />
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
