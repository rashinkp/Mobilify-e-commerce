import React, { useState } from "react";
import CategoryForm from "../../components/category/CategoryForm.jsx";
import CategoryList from "../../components/category/CategoryList.jsx";
import Button from "../../components/ui/Button.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import { useCategoryApi } from "../../hooks/useCategoryApi.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RotatingLines } from "react-loader-spinner";
import { errorToast, successToast } from "../../components/toast/index.js";

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
    <div className="p-5 sm:p-10 flex flex-col gap-6 items-center">
      <CategoryForm
        isModalFormOpen={isModalFormOpen}
        onClose={() => setIsModalFormOpen(false)}
        onSubmit={handleAddCategory}
      />
      <SearchBar searchTerm={setSearchTerm} />
      <Button
        icon={<FontAwesomeIcon icon="fa-solid fa-layer-group" />}
        text="Add Category"
        colorStyle="bg-skyBlue hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
        action={() => setIsModalFormOpen(true)}
      />
      <div className="w-full max-w-5xl">
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
