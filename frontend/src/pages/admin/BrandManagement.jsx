import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import SearchBar from "../../components/SearchBar";
import Modal from "../../components/Modal";
import { brandValidationSchema } from "../../validationSchemas";
import Form from "../../components/Form";
import { useAddBrandMutation } from "../../redux/slices/AdminApiSlices";
import { errorToast, successToast } from "../../components/toast";

const BrandManagement = () => {
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const formField = [
    {
      name: "name",
      label: "Enter brand name",
      placeholder: "Enter brand name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Enter brand description",
      placeholder: "Enter brand description",
      type: "text",
      required: true,
    },
    {
      name: "website",
      label: "Brand Website",
      placeholder: "Enter brand website url",
      type: "text",
      required: true,
    },
  ];

  const [addBrand, { isLoading }] = useAddBrandMutation();

  const handleAddBrand = async (data) => {
    try {
      const res = await addBrand(data).unwrap();
      successToast("Brand added");
      setIsModalFormOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
      console.log(error?.data?.message || error.message || error.error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalFormOpen(false);
    }
  };
  return (
    <div className=" flex justify-center">
      {isModalFormOpen && (
        <div
          className="absolute z-10 h-screen w-full backdrop-blur-md flex items-center "
          onClick={handleOverlayClick}
        >
          <Form
            fields={formField}
            title="Add Brand"
            buttonText="Add Brand"
            onSubmit={handleAddBrand}
            validationRules={brandValidationSchema}
            setModal={setIsModalFormOpen}
          />
        </div>
      )}
      {/* {isModalOpen && (
        <Modal
          title="Are you sure?"
          description="This process cannot be undone. Make sure you are doing the right thing."
          controles={modalControles}
        />
      )} */}
      <div className="flex justify-center">
        {/* <SearchBar searchTerm={setSearchTerm} /> */}
      </div>
      <div className="max-w-7xl mt-10 ms-10 me-4 sm:me-10">
        <button
          className="bg-skyBlue hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
          onClick={() => setIsModalFormOpen(true)}
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" /> Add Brand
        </button>
        {/* <ListItem
          title="User List"
          items={displayedUsers || []} // Default to empty array if users is not available
          columns={userColumns}
          icon="fa-user"
          textColor="text-skyBlue"
          controles={getUserControls}
        /> */}
      </div>
      {/* {isLoading && (
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
      )} */}
    </div>
  );
};

export default BrandManagement;
