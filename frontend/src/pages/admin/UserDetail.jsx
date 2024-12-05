import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ReviewList from "../../components/admin/ReviewList";

const UserDetail = () => {
  const user = {
    id: "12345",
    name: "John Doe",
    username: "johndoe",
    joinDate: "2023-01-01",
    updatedDate: "2024-01-01",
    purchases: 12,
    status: "Active",
    walletBalance: "$150",
    mobile: "123-456-7890",
    orders: [
      { id: "ORD001", date: "2023-10-10", amount: "$100" },
      { id: "ORD002", date: "2023-11-15", amount: "$50" },
    ],
    reviews: [
      {
        id: "REV001",
        comment: "Great product!",
        date: "2023-09-12",
        rating: 5,
      },
      {
        id: "REV002",
        comment: "Average experience.",
        date: "2023-10-05",
        rating: 3,
      },
    ],
    profileImage: "https://via.placeholder.com/150", // Replace with actual image URL
  };

  const handleEdit = () => {
    console.log("Edit User");
  };

  const handleBlock = () => {
    console.log("Block User");
  };

  const handleDelete = () => {
    console.log("Delete User");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white dark:bg-black dark:text-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            <div className="ml-6">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm">@{user.username}</p>
              <p className="text-sm">User ID: {user.id}</p>
              <p className="text-sm">Mobile: {user.mobile}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <p className="text-lg font-semibold">
              Wallet Balance: {user.walletBalance}
            </p>
            <p
              className={`font-bold ${
                {
                  Active: "text-green-400",
                  Blocked: "text-red-400",
                }[user.status]
              }`}
            >
              {user.status}
            </p>
          </div>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Details Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Details
            </h2>
            <div className="mt-4 text-gray-600 dark:text-white">
              <p>
                <strong>Join Date:</strong> {user.joinDate}
              </p>
              <p>
                <strong>Last Updated:</strong> {user.updatedDate}
              </p>
              <p>
                <strong>Purchases:</strong> {user.purchases}
              </p>
            </div>
          </div>

          {/* Orders Column */}
          <div>
            <h2 className="text-lg font-semibold  text-gray-800 dark:text-white">
              Orders
            </h2>
            <ul className="mt-4 text-gray-600  dark:text-white space-y-2">
              {user.orders.map((order) => (
                <li
                  key={order.id}
                  className="flex justify-between dark:bg-darkBackground bg-gray-100 p-4 rounded-md shadow-sm"
                >
                  <span>
                    Order ID: <strong>{order.id}</strong>
                  </span>
                  <span>{order.date}</span>
                  <span className="font-bold">{order.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewList reviews={user.reviews} />

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 dark:bg-black flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={handleEdit}
            className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700"
          >
            <FontAwesomeIcon icon="fa-solid fa-pen" className="me-3" />
            Edit
          </button>
          <button
            onClick={handleBlock}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-700"
          >
            <FontAwesomeIcon icon="fa-solid fa-ban" className="me-3" />
            Block
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700"
          >
            <FontAwesomeIcon icon="fa-solid fa-trash" className="me-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
