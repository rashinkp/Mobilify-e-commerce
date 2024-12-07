import React, { useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import ListItem from "../../components/admin/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useDeleteUserMutation,
  useFetchUsersQuery,
} from "../../redux/slices/AdminApiSlices";
import { successToast, errorToast } from "../../components/toast/index.js";

const UserManagement = () => {
  const { data: users, error, isLoading, refetch } = useFetchUsersQuery();
  const [deleteUser] = useDeleteUserMutation();


  const handleEdit = (userId) => {
    console.log(`Editing user with ID: ${userId}`);
  };

  const handleBlock = (userId) => {
    console.log(`Blocking user with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    deleteUser(userId)
      .unwrap()
      .then(() => {
        successToast("User deleted successfully");
      })
      .catch((error) => {
        errorToast("Error while deleting user");
        console.log(error);
      });
  };

  // Variable to define controls
  const getUserControls = (userId) => {
    return [
      {
        text: "Edit",
        action: () => handleEdit(userId),
        style: "bg-green-700 hover:bg-green-800",
        icon: "fa-solid fa-pen",
      },
      {
        text: "Block",
        action: () => handleBlock(userId),
        style: "bg-yellow-700 hover:bg-yellow-800",
        icon: "fa-solid fa-ban",
      },
      {
        text: "Delete",
        action: () => handleDelete(userId),
        style: "bg-red-700 hover:bg-red-800",
        icon: "fa-solid fa-trash",
      },
    ];
  };

  const userColumns = [
    {
      key: "img",
      render: (img) => (
        <img src={img} alt="Product" className="w-12 h-12 rounded-full" />
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (value) => value,
    },
    {
      key: "email",
      label: "Email",
      render: (value) => value,
    },
    {
      key: "createdAt",
      label: "Join date",
      render: (value) => {
        const date = new Date(value); // Ensure it's a Date object
        return date.toLocaleString(); // Return formatted date
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            value ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "isBlock",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            !value ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {value ? "Block" : "Not Blocked"}
        </span>
      ),
    },
  ];

  return (
    <div className="pt-14">
      <div className="flex justify-center">
        <SearchBar />
      </div>
      <div className="max-w-7xl mt-10 ms-10 me-4 sm:me-10">
        <ListItem
          title="User List"
          items={users}
          columns={userColumns}
          icon="fa-user"
          textColor="text-skyBlue"
          controles={getUserControls}
        />
      </div>
    </div>
  );
};

export default UserManagement;
