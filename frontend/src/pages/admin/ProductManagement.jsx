import React, { useEffect, useState } from "react";
import ProductAddForm from "../../components/product/ProductAddForm.jsx";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useProductApi from "../../hooks/useProductApi";
import { errorToast, successToast } from "../../components/toast/index.js";
import ProductList from "../../components/product/ProductList.jsx";
import { RotatingLines } from "react-loader-spinner";
import { useGetAllProductsQuery, useGetProductsQuery } from "../../redux/slices/productApiSlice.js";
import Pagination from "../../components/Pagination.jsx";

const ProductManagement = () => {
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8; 

  const { addProduct } = useProductApi();

  // const { data: products, error, isLoading } = useGetProductsQuery();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetAllProductsQuery({
    page: currentPage || 1,
    limit: pageSize,
    sortBy: "createdAt",
    filterBy:filter,
    order: "desc",
  });

  const { products = [], totalCount = 0 } = data || {};


  useEffect(() => {
    if (totalCount) {
      setTotalPages(Math.ceil(totalCount / pageSize))
    }
  }, [totalCount]);


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }


  if (isError) return <div>Error: {error.message}</div>;

  // search filtering
  const displayedProduct =
    searchTerm.trim() === ""
      ? products || []
      : products?.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];



  // handling form submission of product adding
  const handleAddProduct = async (data) => {
    try {
      await addProduct(data).unwrap();
      successToast("Product added successfully");
      setIsModalFormOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
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
    <div className="p-5 sm:p-10 flex flex-col gap-6 items-center h-full overflow-auto">
      {/* Product Add Form */}
      <ProductAddForm
        isModalFormOpen={isModalFormOpen}
        onClose={() => setIsModalFormOpen(false)}
        onSubmit={handleAddProduct}
      />

      {/* Search Bar */}
      <SearchBar searchTerm={setSearchTerm} />

      <div className="flex justify-between w-full max-w-5xl items-center">
        {/* Add Product Button */}
        <Button
          icon={<FontAwesomeIcon icon="fa-solid fa-plus" />}
          text="Add Product"
          action={() => setIsModalFormOpen(true)}
        />

        {/* Dropdown for Product Filter */}
        <select
          className="ml-4 p-2 border rounded-md shadow-md bg-white dark:bg-black dark:text-white dark:border-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="active">Active Products</option>
          <option value="low stock">Low Stock</option>
        </select>
      </div>

      {/* Product List */}
      <div className="w-full max-w-5xl mt-5">
        <ProductList products={displayedProduct} icon="fa-solid fa-box" />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Loader Spinner */}
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
