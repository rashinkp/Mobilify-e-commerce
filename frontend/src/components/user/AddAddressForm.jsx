import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

const AddAddressForm = ({ onSubmit, onCancel, validationSchema }) => {
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
    resolver: yupResolver(validationSchema),
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
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
      {errors.label && <p className="text-red-500">{errors.label.message}</p>}

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
      {errors.street && <p className="text-red-500">{errors.street.message}</p>}

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
      {errors.state && <p className="text-red-500">{errors.state.message}</p>}

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
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Define prop types for better type checking
AddAddressForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  validationSchema: PropTypes.object.isRequired,
};

export default AddAddressForm;
