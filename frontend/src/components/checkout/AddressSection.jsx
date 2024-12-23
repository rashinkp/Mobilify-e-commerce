import React from "react";
import { MapPin, Plus } from "lucide-react";
import AddAddressForm from "../user/AddAddressForm";
import { addressValidationSchema } from "../../validationSchemas";

const  AddressSection = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
  isAddingAddress,
  setIsAddingAddress,
  handleAddAddress,
}) => {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <MapPin className="mr-2" /> Shipping Address
      </h2>
      <div className="flex flex-col">
        <button
          onClick={() => setIsAddingAddress(true)}
          className="text-green-600 ms-auto mb-5 hover:text-green-700 flex items-center"
        >
          <Plus size={16} className="mr-2" /> Add New
        </button>
        {isAddingAddress && (
          <AddAddressForm
            onCancel={() => setIsAddingAddress(false)}
            validationSchema={addressValidationSchema}
            onSubmit={handleAddAddress}
          />
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div
            key={address._id}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedAddress?._id === address._id
                ? "border-blue-500 bg-blue-50 dark:bg-black"
                : "hover:bg-gray-100 hover:dark:bg-gray-500"
            }`}
            onClick={() => setSelectedAddress(address)}
          >
            <h3 className="font-semibold">{address.label}</h3>
            <p>{address.street}</p>
            <p>{`${address.city}, ${address.state} ${address.zip}`}</p>
            <p>{address.phone}</p>
          </div>
        ))}
      </div>
    </section>
  );
};


export default AddressSection