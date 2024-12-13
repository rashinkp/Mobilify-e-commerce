import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";

const MyAddress = () => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
    label: "",
    address: "",
  });

  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profileImage: "/api/placeholder/200/200",
    addresses: [
      { id: 1, label: "Home", address: "123 Main St, Cityville, State 12345" },
      {
        id: 2,
        label: "Work",
        address: "456 Business Ave, Worktown, State 67890",
      },
    ],
  });

  const handleAddAddress = () => {
    if (newAddress.label && newAddress.address) {
      setUser((prev) => ({
        ...prev,
        addresses: [
          ...prev.addresses,
          {
            id: prev.addresses.length + 1,
            ...newAddress,
          },
        ],
      }));
      setIsAddingAddress(false);
      setNewAddress({ label: "", address: "" });
    }
  };

  const handleDeleteAddress = (id) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((addr) => addr.id !== id),
    }));
  };

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
        <div className="bg-white dark:bg-black p-4 rounded-lg dark:border-none border mb-4">
          <input
            type="text"
            placeholder="Address Label (e.g., Home, Work)"
            className="w-full dark:bg-slate-800 dark:border-none p-2 border rounded-md mb-2"
            value={newAddress.label}
            onChange={(e) =>
              setNewAddress((prev) => ({
                ...prev,
                label: e.target.value,
              }))
            }
          />
          <textarea
            placeholder="Full Address"
            className="w-full p-2 border dark:bg-slate-800 dark:border-none rounded-md mb-2"
            value={newAddress.address}
            onChange={(e) =>
              setNewAddress((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAddAddress}
              className="bg-green-500  text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Save Address
            </button>
            <button
              onClick={() => setIsAddingAddress(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {user.addresses.map((address) => (
        <div
          key={address.id}
          className="bg-white dark:bg-slate-800 p-4 rounded-lg dark:border-none border mb-2 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">{address.label}</h3>
            <p className="text-gray-600 dark:text-white">{address.address}</p>
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
