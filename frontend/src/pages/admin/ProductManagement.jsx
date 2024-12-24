import React, { useEffect, useState } from "react";
import { ChevronRight, Eye, Home } from "lucide-react";
import { Link } from "react-router-dom";
import ProductAddForm from "../../components/product/ProductAddForm.jsx";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useProductApi from "../../hooks/useProductApi";
import { errorToast, successToast } from "../../components/toast/index.js";
import ProductList from "../../components/product/ProductList.jsx";
import { RotatingLines } from "react-loader-spinner";
import { useGetAllProductsQuery } from "../../redux/slices/productApiSlice.js";
import Pagination from "../../components/Pagination.jsx";
import { useGetAllCategoryQuery } from "../../redux/slices/categoryApiSlices.js";

const ProductManagement = () => {
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  const [categoryFilter, setCategoryFilter] = useState("");

  const { addProduct } = useProductApi();

  const { data, isLoading, isError, error } = useGetAllProductsQuery({
    page: currentPage || 1,
    limit: pageSize,
    sortBy: "createdAt",
    filterBy: filter,
    order: "desc",
    categoryId: categoryFilter,
  });

  const { data: categories = [], isLoading: categoryLoading } =
    useGetAllCategoryQuery();

  const { products = [], totalCount = 0 } = data || {};

  useEffect(() => {
    if (totalCount) {
      setTotalPages(Math.ceil(totalCount / pageSize));
    }
  }, [totalCount]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isError) return <div>Error: {error.message}</div>;

  // Search filtering
  const displayedProduct =
    searchTerm.trim() === ""
      ? products || []
      : products?.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

  // Handling form submission for product addition
  const handleAddProduct = async (data) => {
    try {
      await addProduct(data).unwrap();
      successToast("Product added successfully");
      setIsModalFormOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <Link to="/admin" className="flex items-center hover:text-blue-600">
          <Home size={16} className="mr-2" />
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700">Product Management</span>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Product Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage and monitor your product inventory
        </p>
      </div>

      <div className="">
        {/* Product Add Form */}
        <ProductAddForm
          isModalFormOpen={isModalFormOpen}
          onClose={() => setIsModalFormOpen(false)}
          onSubmit={handleAddProduct}
        />

        <div className="mb-5">
          <SearchBar searchTerm={setSearchTerm} />
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-end mb-6 gap-4">
          {/* Search Bar */}

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Dropdown for Product Filter */}
            <select
              className="px-1 py-2 border border-gray-300 rounded-md dark:bg-darkBackground focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Products</option>
              <option value="active">Active Products</option>
              <option value="inactive">Inactive Products</option>
              <option value="low stock">Low Stock</option>
            </select>
            <select
              className="px-1 py-2 border border-gray-300 rounded-md dark:bg-darkBackground focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Add Product Button */}
            <button
              onClick={() => setIsModalFormOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg flex items-center gap-2 transition duration-200"
            >
              <FontAwesomeIcon icon="fa-solid fa-plus" />
              Add Product
            </button>
          </div>
        </div>

        {/* Product List */}
        <div>
          <ProductList products={displayedProduct} icon="fa-solid fa-box" />
        </div>

        {/* Pagination */}

        <div className="flex justify-center mt-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Loader Spinner */}
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
    </div>
  );
};

export default ProductManagement;
