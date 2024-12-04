import React from "react";
import SearchBar from "../../components/SearchBar";
import ListItem from "../../components/admin/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductManagement = () => {
  const handleEdit = () => {
    console.log("Handling edit");
  };

  const handleDelete = () => {
    console.log("Handling delete");
  };

  const productControls = [
    {
      text: "Edit",
      action: handleEdit,
      style: "bg-green-700 hover:bg-green-800",
      icon: "fa-solid fa-pen",
    },
    {
      text: "Delete",
      action: handleDelete,
      style: "bg-red-700 hover:bg-red-800",
      icon: "fa-solid fa-trash",
    },
  ];

  const productColumns = [
    {
      key: "img",
      
      render: (img) => (
        <img src={img} alt="Product" className="w-12 h-12 rounded-full" />
      ),
    },
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "sale", label: "Sales" },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <span
          className={`font-bold ${
            status === "Active" ? "text-green-600" : "text-red-700"
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  const products = [
    {
      img: "https://via.placeholder.com/50",
      name: "Product A",
      price: "$50",
      stock: 80,
      sale: 68,
      status: "Active",
      controls: productControls,
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
            <FontAwesomeIcon icon="fa-solid fa-plus" /> Add Product
          </button>
        </div>
        <ListItem
          title="Product List"
          items={products}
          columns={productColumns}
          icon="fa-box"
          textColor="text-skyBlue"
        />
      </div>
    </div>
  );
};

export default ProductManagement;
