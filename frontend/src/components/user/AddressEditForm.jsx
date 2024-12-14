import React from 'react'
import Form from '../Form';
import { useUpdateAddressMutation } from '../../redux/slices/addressApiSlice';
import { addressValidationSchema } from '../../validationSchemas';
import { errorToast, successToast } from '../toast';

const AddressEditForm = ({ address, onClose }) => {


  const [editAddress] = useUpdateAddressMutation();
    const addressFields = [
      {
        name: "street",
        label: "Street",
        type: "text",
        placeholder: "Enter street",
        required: true,
        defaultValue: address?.street || "",
      },
      {
        name: "city",
        label: "City",
        type: "text",
        placeholder: "Enter city",
        required: true,
        defaultValue: address?.city || "",
      },
      {
        name: "state",
        label: "State",
        type: "text",
        placeholder: "Enter state",
        required: true,
        defaultValue: address?.state || "",
      },
      {
        name: "postalCode",
        label: "Postal Code",
        type: "text",
        placeholder: "Enter postal code",
        required: true,
        defaultValue: address?.postalCode || "",
      },
      {
        name: "country",
        label: "Country",
        type: "text",
        placeholder: "Enter country",
        required: true,
        defaultValue: address?.country || "",
      },
      {
        name: "label",
        label: "Label",
        type: "text",
        placeholder: "Enter label (e.g., Home, Work)",
        required: false,
        defaultValue: address?.label || "",
      },
    ];

  
    const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
  const handleSubmit = async (data) => {
      console.log
      try {
        await editAddress({ addressId: address._id, data }).unwrap();
        successToast("Address updated successfully");
        onClose();
      } catch (error) {
         errorToast(
           error?.data?.message || error.message || "Failed to update address"
         );
      }
  };
  

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md overflow-auto "
        onClick={handleOverlayClick}
      >
        <div
          className="p-6 w-full max-w-lg rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <Form
            title="Edit Address"
            fields={addressFields}
            onSubmit={handleSubmit}
            buttonText="Submit"
            validationRules={addressValidationSchema}
          />
        </div>
      </div>
    </>
  );
}

export default AddressEditForm