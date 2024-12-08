import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import ListItem from "../../components/admin/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useBlockUserMutation,
  useDeleteUserMutation,
  useFetchUsersQuery,
} from "../../redux/slices/AdminApiSlices.js";
import { successToast, errorToast } from "../../components/toast/index.js";
import { RotatingLines } from "react-loader-spinner";
import Modal from "../../components/Modal.jsx";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users, error, isLoading, refetch } = useFetchUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [blockUser] = useBlockUserMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const displayedUsers =
    searchTerm.trim() === ""
      ? users
      : users?.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBlock = (user) => {
    blockUser(user._id)
      .unwrap()
      .then(() => {
        successToast(`${user.isBlocked ? "User Unblocked" : "User blocked"}`);
        setSelectedUser(null);
      })
      .catch((error) => {
        errorToast("Error while blocking user");
        console.error(error);
      });
  };

  const handleDelete = () => {
    deleteUser(selectedUser._id)
      .unwrap()
      .then(() => {
        successToast("User deleted successfully");
        setIsModalOpen(false);
        setSelectedUser(null);
      })
      .catch((error) => {
        errorToast("Error while deleting user");
        console.error(error);
      });
  };

  // Variable to define controls
  const getUserControls = (user) => {
    const isBlocked = user.isBlocked;
    return [
      {
        text: isBlocked ? "Unblock" : "Block",
        action: () => {
          setSelectedUser(user);
          handleBlock(user);
        },
        style: "bg-yellow-700 hover:bg-yellow-800",
        icon: "fa-solid fa-ban",
      },
      {
        text: "Delete",
        action: () => {
          setSelectedUser(user);
          openModal();
        },
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
      key: "isBlocked",
      label: "Block status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            !value ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {!value ? "Not Blocked" : "Bloked"}
        </span>
      ),
    },
  ];

  const modalControles = [
    {
      text: "Cancel",
      action: closeModal,
      style:
        "text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
    },
    {
      text: "Delete",
      action: handleDelete,
      style:
        "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800",
    },
  ];

  return (
    <div className="pt-14">
      {isModalOpen && (
        <Modal
          title="Are you sure?"
          description="This process cannot be undone. Make sure you are doing the right thing."
          controles={modalControles}
        />
      )}
      <div className="flex justify-center">
        <SearchBar searchTerm={setSearchTerm} />
      </div>
      <div className="max-w-7xl mt-10 ms-10 me-4 sm:me-10">
        <ListItem
          title="User List"
          items={displayedUsers || []} // Default to empty array if users is not available
          columns={userColumns}
          icon="fa-user"
          textColor="text-skyBlue"
          controles={getUserControls}
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

export default UserManagement;
