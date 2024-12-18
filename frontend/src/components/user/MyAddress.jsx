import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressQuery,
} from "../../redux/slices/addressApiSlice.js";
import { errorToast, successToast } from "../toast";
import { useSelector } from "react-redux";
import Modal from "../Modal.jsx";
import AddressEditForm from "./AddressEditForm.jsx";
import AddressAddForm from "./AddAddressForm.jsx";
import { RotatingLines } from "react-loader-spinner";
import { addressValidationSchema } from "../../validationSchemas.js";

const MyAddress = () => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const { userInfo } = useSelector((state) => state.userAuth);
  const userId = userInfo.id;
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [deleteAddress] = useDeleteAddressMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addAddress] = useAddAddressMutation();

  const { data, isLoading, isError, error } = useGetAddressQuery(userInfo.id);
  const { addresses } = data || {};

  const handleDeleteAddress = async () => {
    const { _id: addressId } = currentAddress;

    try {
      await deleteAddress(addressId);
      successToast("Address deleted successfully");
      setIsDelModalOpen(false);
    } catch (error) {
      console.error("Error deleting address:", error);
      errorToast(
        error?.data?.message ||
          error?.message ||
          "Error occurred while deleting address"
      );
      setIsDelModalOpen(false);
    }
  };

  const handleAddAddress = async (data) => {
    console.log("Form Submitted:", data);
    try {
      await addAddress({ data, userId });
      successToast("Address added successfully");
    } catch (error) {
      errorToast(
        error?.data?.message ||
          error?.message ||
          error?.data ||
          "Error occurred while adding address"
      );
      console.log(error);
    }
    setIsAddingAddress(false);
  };

  if (isError) return <div>Error: {error.message}</div>;

  if (isLoading) {
    return (
      <div>
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
      </div>
    );
  }

  return (
    <>
      {isDelModalOpen && (
        <Modal
          title="Are you sure?"
          description="This process cannot be undone..."
          controles={[
            {
              text: "Cancel",
              action: () => setIsDelModalOpen(false),
              style:
                "text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
            },
            {
              text: "Delete",
              action: handleDeleteAddress,
              style:
                "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800",
            },
          ]}
        />
      )}

      {isEditModalOpen && (
        <AddressEditForm
          address={currentAddress}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      <div className="bg-gray-50 dark:bg-transparent p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold dark:text-white text-gray-700">
            My Addresses
          </h2>
          <button
            onClick={() => setIsAddingAddress(true)}
            className="text-green-600 hover:text-green-700 flex items-center"
          >
            <Plus size={16} className="mr-2" /> Add New
          </button>
        </div>

        {isAddingAddress && (
          <AddressAddForm
            userId={userId}
            onCancel={() => setIsAddingAddress(false)}
            validationSchema={addressValidationSchema}
            onSubmit={handleAddAddress}
          />
        )}

        {addresses.map((address, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg dark:border-none border mb-2 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{address.label}</h3>{" "}
              <p className="text-gray-600 dark:text-gray-300">
                {address.street}, {address.city},{address.state},
                {address.postalCode},{address.country},
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                className="text-blue-600 hover:text-blue-700"
                onClick={() => {
                  setCurrentAddress(address);
                  setIsEditModalOpen(true);
                }}
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => {
                  setCurrentAddress(address);
                  setIsDelModalOpen(true);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyAddress;
