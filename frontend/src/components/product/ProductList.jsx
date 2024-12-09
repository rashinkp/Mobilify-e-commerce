import React, { useState } from "react";
import ListItem from "../admin/ListItem";
import { useNavigate } from "react-router";

const ProductList = ({ products, icon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const productColumns = [
    { key: "name", label: "Name", render: (value) => value },
    { key: "model", label: "Model", render: (value) => value },
    { key: "price", label: "Price", render: (value) => value },
    { key: "stock", label: "Stock", render: (value) => value },
    {
      key: "isSoftDelete",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            !value ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {!value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];


  const handleClick = (product) => {
    navigate(`/admin/product/${product._id}`);
  };




    
  return (
    <>
      {isModalOpen && (
        <Modal
          title="Are you sure?"
          description="This process cannot be undone..."
          controles={[
            {
              text: "Cancel",
              action: () => setIsModalOpen(false),
              style:
                "text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
            },
            {
              text: "Delete",
              action: handleDeleteProduct,
              style:
                "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800",
            },
          ]}
        />
      )}
      <ListItem
        title="Product List"
        items={products || []}
        columns={productColumns}
        icon={icon}
        textColor="text-skyBlue"
        clickList={handleClick}
      />
    </>
  );
};

export default ProductList;
