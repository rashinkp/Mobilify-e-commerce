import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useAddAddressMutation, useGetAddressQuery } from "../../redux/slices/addressApiSlice.js";
import { errorToast, successToast } from "../toast";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addressValidationSchema } from "../../validationSchemas";
import { useGetUserQuery } from "../../redux/slices/userApiSlices.js";
import { RotatingLines } from "react-loader-spinner";

// Validation schema using yup


const MyAddress = () => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const { userInfo } = useSelector((state) => state.userAuth);
  const userId = userInfo.id;

  const [addAddress] = useAddAddressMutation();

  const {data,isLoading,isError,error} = useGetAddressQuery(userInfo.id)
  const { addresses } = data || {}

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      label: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    resolver: yupResolver(addressValidationSchema),
  });

  const handleAddAddress = async (data) => {
     console.log("Form Submitted:", data); 
    try {
      await addAddress({ data, userId });
      successToast("Address added successfully");
      reset(); // Reset form fields after successful submit
    } catch (error) {
      errorToast(
        error?.data?.message ||
          error?.message ||
          error?.data ||
          "Error occurred while adding address"
      );
      console.log(error)
    }
    setIsAddingAddress(false);
  };

  const handleDeleteAddress = (id) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((addr) => addr.id !== id),
    }));
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
        <form
          onSubmit={handleSubmit(handleAddAddress)}
          className="bg-white dark:bg-black p-4 rounded-lg dark:border-none border mb-4"
        >
          <Controller
            name="label"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Label (Home, Work, etc.)"
                className="w-full dark:bg-slate-800 dark:border-none p-2 border rounded-md mb-2"
              />
            )}
          />
          {errors.label && (
            <p className="text-red-500">{errors.label.message}</p>
          )}

          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Street"
                className="w-full dark:bg-slate-800 dark:border-none p-2 border rounded-md mb-2"
              />
            )}
          />
          {errors.street && (
            <p className="text-red-500">{errors.street.message}</p>
          )}

          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="City"
                className="w-full dark:bg-slate-800 dark:border-none p-2 border rounded-md mb-2"
              />
            )}
          />
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}

          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="State"
                className="w-full dark:bg-slate-800 dark:border-none p-2 border rounded-md mb-2"
              />
            )}
          />
          {errors.state && (
            <p className="text-red-500">{errors.state.message}</p>
          )}

          <Controller
            name="postalCode"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Postal Code"
                className="w-full dark:bg-slate-800 dark:border-none p-2 border rounded-md mb-2"
              />
            )}
          />
          {errors.postalCode && (
            <p className="text-red-500">{errors.postalCode.message}</p>
          )}

          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Country"
                className="w-full dark:bg-slate-800 dark:border-none p-2 border rounded-md mb-2"
              />
            )}
          />
          {errors.country && (
            <p className="text-red-500">{errors.country.message}</p>
          )}

          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setIsAddingAddress(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.map((address, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 p-4 rounded-lg dark:border-none border mb-2 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">{address.label}</h3>{" "}
            {/* Display label */}
            <p className="text-gray-600 dark:text-gray-300">
              {address.street}, {address.city},{address.state},
              {address.postalCode},{address.country},
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-700">
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteAddress(address.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyAddress;
