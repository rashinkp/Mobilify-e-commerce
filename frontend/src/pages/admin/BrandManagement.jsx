import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { successToast, errorToast } from "../../components/toast";
import { RotatingLines } from "react-loader-spinner";
import Modal from "../../components/Modal";
import BrandList from "../../components/brand/BrandList.jsx";
import BrandForm from "../../components/brand/BrandForm.jsx";
import Button from "../../components/ui/Button.jsx";
import useBrandApi from "../../hooks/useBrandApi.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import { Ban, ChevronRight, DatabaseBackup, Home } from "lucide-react";
import { Link } from "react-router";

const BrandManagement = () => {
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const { addBrand, deleteBrand, brands, isLoading } = useBrandApi();

  const [searchTerm, setSearchTerm] = useState("");

  const displayedBrands =
    searchTerm.trim() === ""
      ? brands
      : brands?.filter(
          (brand) =>
            brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            brand.website.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const handleAddBrand = async (data) => {
    try {
      await addBrand(data).unwrap();
      successToast("Brand added successfully");
      setIsModalFormOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  const handleDeleteBrand = async () => {
    try {
      await deleteBrand(selectedBrand._id).unwrap();
      successToast("Brand deleted successfully");
      setIsModalOpen(false);
      setSelectedBrand(null);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  const getBrandControles = (brand) => [
    {
      action: () => {
        setSelectedBrand(brand);
        setIsModalOpen(true);
      },
      style: "",
      icon: brand.isBlocked ? (
        <DatabaseBackup
          className="text-gray-500 hover:text-green-600"
          size={20}
        />
      ) : (
        <Ban className="text-gray-500 hover:text-red-600" size={20} />
      ),
    },
  ];

  const modalControles = [
    {
      text: "Cancel",
      action: () => setIsModalOpen(false),
      style:
        "text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
    },
    {
      text: selectedBrand?.isSoftDeleted ? "Restore" : "Delete",
      action: handleDeleteBrand,
      style: selectedBrand?.isSoftDeleted
        ? "text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800"
        : "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800",
    },
  ];

  return (
    <div className="p-5 sm:p-10  gap-6 items-center">
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <Link to="/admin" className="flex items-center hover:text-blue-600">
          <Home size={16} className="mr-2" />
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700">Brand Management</span>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Brand Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage and monitor all brands
        </p>
      </div>
      {isModalOpen && (
        <Modal
          title="Are you sure?"
          description="You should be very careful while handling this kind of deleting"
          controles={modalControles}
        />
      )}
      <BrandForm
        isModalFormOpen={isModalFormOpen}
        onClose={() => setIsModalFormOpen(false)}
        onSubmit={handleAddBrand}
      />

      <SearchBar searchTerm={setSearchTerm} />

      <div className="flex justify-end">
        <button
          onClick={() => setIsModalFormOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg flex items-center gap-2 transition duration-200"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" />
          Add Product
        </button>
      </div>

      <div className="">
        <BrandList
          brands={displayedBrands}
          getBrandControles={getBrandControles}
          icon="fa-solid fa-copyright"
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

export default BrandManagement;
