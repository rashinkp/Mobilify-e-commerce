import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import SearchBar from "../../components/SearchBar";
import Form from "../../components/Form";
import ListItem from "../../components/admin/ListItem";
import {
  useAddBrandMutation,
  useDeleteBrandMutation,
  useGetAllBrandQuery,
} from "../../redux/slices/adminApiSlices.js";
import { successToast, errorToast } from "../../components/toast";
import { brandValidationSchema } from "../../validationSchemas";
import { RotatingLines } from "react-loader-spinner";
import Modal from "../../components/Modal";

const BrandManagement = () => {
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const formField = [
    {
      name: "name",
      label: "Brand Name",
      placeholder: "Enter brand name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Brand Description",
      placeholder: "Enter brand description",
      type: "text",
      required: true,
    },
    {
      name: "website",
      label: "Website",
      placeholder: "Enter brand website URL",
      type: "text",
      required: true,
    },
  ];

  const [addBrand] = useAddBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const { data: brands, isLoading } = useGetAllBrandQuery();

  const handleAddBrand = async (data) => {
    try {
      await addBrand(data).unwrap();
      successToast("Brand added successfully");
      setIsModalFormOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setIsModalFormOpen(false);
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

  const brandColumns = [
    { key: "name", label: "Brand Name", render: (value) => value },
    { key: "description", label: "Description", render: (value) => value },
    { key: "website", label: "Website", render: (value) => value },
  ];

  const getBrandControls = (brand) => [
    {
      text: "Delete",
      action: () => {
        setSelectedBrand(brand);
        setIsModalOpen(true);
      },
      style: "bg-red-700 hover:bg-red-800",
      icon: "fa-solid fa-trash",
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
              fields={formField}
              title="Add Brand"
              buttonText="Add Brand"
              onSubmit={handleAddBrand}
              validationRules={brandValidationSchema}
            />
          </div>
        </div>
      )}

      <button
        className="bg-skyBlue hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
        onClick={() => setIsModalFormOpen(true)}
      >
        <FontAwesomeIcon icon="fa-solid fa-plus" /> Add Brand
      </button>

      <div className="w-full max-w-5xl">
        <ListItem
          title="Brand List"
          items={brands || []}
          columns={brandColumns}
          icon="fa-copyright"
          textColor="text-skyBlue"
          controles={getBrandControls}
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
