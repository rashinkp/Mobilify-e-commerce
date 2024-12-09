import React, { useState } from "react";
import ProductAddForm from "../../components/product/ProductAddForm.jsx";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useProductApi from "../../hooks/useProductApi";
import { errorToast, successToast } from "../../components/toast/index.js";
import ProductList from "../../components/product/ProductList.jsx";
import { RotatingLines } from "react-loader-spinner";
const ProductManagement = () => {
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { addProduct, products, isLoading } = useProductApi();
  

  // search filtering
  const displayedProduct =
    searchTerm.trim() === ""
      ? products
      : products?.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // handling form submission of product adding
  const handleAddProduct = async (data) => {
    console.log(data)
    try {
      await addProduct(data).unwrap();
      successToast("Product added successfully");
      setIsModalFormOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };
  return (
    <div className="p-5 sm:p-10 flex flex-col gap-6 items-center h-full overflow-auto">
      <ProductAddForm
        isModalFormOpen={isModalFormOpen}
        onClose={() => setIsModalFormOpen(false)}
        onSubmit={handleAddProduct}
      />
      <SearchBar searchTerm={setSearchTerm} />
      <Button
        icon={<FontAwesomeIcon icon="fa-solid fa-plus" />}
        text="Add Product"
      />
      <div className="w-full max-w-5xl">
        <ProductList
          products={displayedProduct}
          icon="fa-solid fa-box"
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
          />
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
