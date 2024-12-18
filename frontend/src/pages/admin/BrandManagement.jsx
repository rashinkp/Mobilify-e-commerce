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
import { Ban, DatabaseBackup } from "lucide-react";

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
      text: "Delete",
      action: handleDeleteBrand,
      style:
        "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800",
    },
  ];

  return (
    <div className="p-5 sm:p-10  gap-6 items-center">
      {isModalOpen && (
        <Modal
          title="Are you sure?"
          description="This process cannot be undone. Make sure you are doing the right thing."
          controles={modalControles}
        />
      )}
      <BrandForm
        isModalFormOpen={isModalFormOpen}
        onClose={() => setIsModalFormOpen(false)}
        onSubmit={handleAddBrand}
      />

      <SearchBar searchTerm={setSearchTerm} />

      <Button
        icon={<FontAwesomeIcon icon="fa-solid fa-layer-group" />}
        text="Add Brand"
        colorStyle="bg-skyBlue hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
        action={() => setIsModalFormOpen(true)}
      />

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
