import React from "react";
import SearchBar from "../../components/SearchBar";
import ListItem from "../../components/admin/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrderManagement = () => {
  const handleChange = (userId) => {
    console.log(`Changing order with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    console.log(`Deleting user with ID: ${userId}`);
  };

  const orderControle = (userId) => [
    {
      text: "Update ",
      action: () => handleChange(userId),
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

  const orderColumns = [
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
      key: "date",
      label: "Order Date",
      render: (value) => value,
    },

    {
      key: "price",
      label: "Price",
      render: (value) => value,
    },
    {
      key: "payment",
      label: "Payment Status",
      render: (value) => value,
    },
    {
      key: "status",
      label: "Order Status",
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

  const orders = [
    {
      id: "user1",
      name: "John Doe",
      img: "https://via.placeholder.com/50",
      date: "12/12/2024",
      payment: "Done",
      price: 125,
      status: "Active",
      controls: orderControle("order1"),
    },
    {
      id: "user2",
      name: "Jane Smith",
      img: "https://via.placeholder.com/50",
      date: "12/12/2024",
      payment: "Done",
      price: 125,
      status: "Inactive",
      controls: orderControle("order3"),
    },
    {
      id: "user3",
      name: "Michael Brown",
      img: "https://via.placeholder.com/50",
      date: "12/12/2024",
      payment: "Done",
      price: 125,
      status: "Active",
      controls: orderControle("order2"),
    },
  ];

  return (
    <div className="pt-14">
      <div className="flex justify-center">
        <SearchBar />
      </div>
      <div className="max-w-7xl mt-10 ms-10 me-4 sm:me-10">
        <ListItem
          title="Order List"
          items={orders}
          columns={orderColumns}
          icon="fa-cart-shopping"
          textColor="text-skyBlue"
        />
      </div>
    </div>
  );
};

export default OrderManagement;
