import React from "react";
import SearchBar from "../../components/SearchBar";
import ListItem from "../../components/admin/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserManagement = () => {
  const handleEdit = (userId) => {
    console.log(`Editing user with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    console.log(`Deleting user with ID: ${userId}`);
  };

  const userControls = (userId) => [
    {
      text: "Edit",
      action: () => handleEdit(userId),
      style: "bg-green-700 hover:bg-green-800",
      icon: "fa-solid fa-pen",
    },
    {
      text: "Delete",
      action: () => handleDelete(userId),
      style: "bg-red-700 hover:bg-red-800",
      icon: "fa-solid fa-trash",
    },
  ];

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
      key: "dat",
      label: "Join date",
      render: (value) => value,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            value === "Active"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const users = [
    {
      id: "user1",
      name: "John Doe",
      img: "https://via.placeholder.com/50",
      email: "johndoe@example.com",
      date: "12/12/2023",
      status: "Active",
      controls: userControls("user1"),
    },
    {
      id: "user2",
      name: "Jane Smith",
      img: "https://via.placeholder.com/50",
      email: "janesmith@example.com",
      date: "12/12/2023",
      status: "Inactive",
      controls: userControls("user2"),
    },
    {
      id: "user3",
      name: "Michael Brown",
      img: "https://via.placeholder.com/50",
      email: "michaelbrown@example.com",
      date: "12/12/2023",
      status: "Active",
      controls: userControls("user3"),
    },
  ];

  return (
    <div className="pt-14">
      <div className="flex justify-center">
        <SearchBar />
      </div>
      <div className="max-w-7xl mt-10 mx-auto">
        <div className="flex justify-end mb-5">
          <button className="bg-skyBlue hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <FontAwesomeIcon icon="fa-solid fa-plus" /> Add User
          </button>
        </div>
        <ListItem
          title="User List"
          items={users}
          columns={userColumns}
          icon="fa-user"
          textColor="text-skyBlue"
        />
      </div>
    </div>
  );
};

export default UserManagement;
