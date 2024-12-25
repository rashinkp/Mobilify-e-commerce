import React, { useState } from "react";
import { Ban, ChevronRight, DatabaseBackup, Eye, Home } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import ListItem from "../../components/admin/ListItem";
import {
  useBlockUserMutation,
  useFetchUsersQuery,
} from "../../redux/slices/adminApiSlices.js";
import { successToast, errorToast } from "../../components/toast/index.js";
import { RotatingLines } from "react-loader-spinner";
import Modal from "../../components/Modal.jsx";
import noImage from "../../assets/noImage.png";
import { Link } from "react-router-dom";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users, isLoading } = useFetchUsersQuery();
  const [blockUser] = useBlockUserMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmingBlocking, setIsConfirmingBlock] = useState(false);

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

  const handleBlock = async () => {
    const user = selectedUser;
    try {
      await blockUser(user._id).unwrap();
      successToast(`${user.isBlocked ? "User Unblocked" : "User blocked"}`);
      setSelectedUser(null);
      closeModal();
    } catch (error) {
      errorToast("Error while blocking user");
      console.error(error);
    }
  };

  // Variable to define controls
  const getUserControls = (user) => {
    const isBlocked = user.isBlocked;
    return [
      {
        action: () => {
          setSelectedUser(user);
        },
        style: "",
        icon: <Eye className="text-gray-500 hover:text-blue-600" />,
      },
      {
        action: () => {
          setSelectedUser(user);
          setIsConfirmingBlock(true);
          openModal();
        },
        style: "",
        icon: isBlocked ? (
          <DatabaseBackup
            className="text-gray-500 hover:text-green-600"
            size={20}
          />
        ) : (
          <Ban className="text-gray-500 hover:text-red-600" size={20} />
        ),
      },
    ];
  };

  const userColumns = [
    {
      label: "Image",
      key: "picture",
      render: (img) =>
        img?.secure_url ? (
          <img
            src={img.secure_url || noImage}
            alt="Product"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <img
            src={noImage}
            alt="Product"
            className="w-12 h-12 rounded-full object-cover"
          />
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
        const date = new Date(value);
        return date.toLocaleString();
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
          {!value ? "Not Blocked" : "Blocked"}
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
      text: selectedUser?.isBlocked ? "Unblock" : "Block",
      action: handleBlock,
      style:
        "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800",
    },
  ];

  return (
    <div className="p-4">
      {/* Breadcrumbs */}
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <Link to="/admin" className="flex items-center hover:text-blue-600">
          <Home size={16} className="mr-2" />
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700">User Management</span>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          User Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage and monitor user accounts
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar searchTerm={setSearchTerm} />
      </div>

      {/* Modal and Table */}
      {isModalOpen && (
        <Modal
          title={selectedUser?.isBlocked ? "Unblock User?" : "Block User?"}
          description={
            selectedUser?.isBlocked
              ? "Are you sure you want to unblock this user? They will regain access."
              : "Are you sure you want to block this user? They will lose access."
          }
          controles={modalControles}
        />
      )}

      <ListItem
        items={displayedUsers || []}
        columns={userColumns}
        textColor="text-skyBlue"
        controles={getUserControls}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
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
      )}
    </div>
  );
};

export default UserManagement;
