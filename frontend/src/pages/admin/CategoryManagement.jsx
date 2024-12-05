import React, { useState } from "react";
import Form from "../../components/Form.jsx";
import { categoryNameValidationSchema as categoryValidation } from "../../validationSchemas.js";
import ListItem from "../../components/admin/ListItem.jsx";

const CategoryManagement = () => {
  const categoryFields = [
    {
      name: "category",
      label: "Category Name",
      type: "text",
      placeholder: "Enter new Category",
      required: true,
    },
  ];

  // List action methods
  const handleEdit = () => {
    console.log("Category edit");
  };
  const handleDelete = () => {
    console.log("Category Delete");
  };

  // Form action method
  const handleAddCategory = () => {
    console.log("Category added");
  };

  // Passing actions to list
  const categoryControls = [
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

  const category = [
    {
      name: "Category Name",
      controls: categoryControls,
    },
  ];

  const columns = [{ key: "name", label: "Category Name" }];

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 mx-auto">
      {/* Form Section */}
      <div className="w-full lg:w-2/5  p-6 rounded-lg ">
        <Form
          title="Add Category"
          fields={categoryFields}
          onSubmit={handleAddCategory}
          buttonText="Add Category"
          validationRules={categoryValidation}
        />
      </div>

      {/* List Section */}
      <div className="w-full lg:w-3/5 p-6 rounded-lg">
        <ListItem
          title="Category List"
          items={category}
          columns={columns}
          icon="fa-layer-group"
          textColor="text-skyBlue"
        />
      </div>
    </div>
  );
};

export default CategoryManagement;
