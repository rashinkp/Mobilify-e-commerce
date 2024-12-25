import React from "react";
import Form from "../Form";
import { getProductFields } from "../product/productFields.js";
import { productValidation } from "../../validationSchemas.js";
import { useGetAllCategoryQuery } from "../../redux/slices/categoryApiSlices.js";

const ProductAddForm = ({ isModalFormOpen, onClose, onSubmit }) => {
  const { data: categories = [], isLoading } = useGetAllCategoryQuery({
    filterBy: "All",
  });

  if (!isModalFormOpen) return null;

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  const productFields = getProductFields(categoryOptions);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  {
    isLoading && (
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
        />
      </div>
    );
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
      onClick={handleOverlayClick}
    >
      <div
        className="p-6 w-full max-w-lg rounded-lg shadow-lg h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Form
          fields={productFields}
          title="Add Product"
          buttonText="Add Product"
          onSubmit={onSubmit}
          validationRules={productValidation}
        />
      </div>
    </div>
  );
};

export default ProductAddForm;
