import React, { useEffect, useState } from "react";
import ProductCard from "../../components/user/ProductCard";
import Footer from "../../components/user/Footer";
import { useGetAllProductsQuery } from "../../redux/slices/productApiSlice";
import Pagination from "../../components/Pagination";
import { useGetAllCategoryQuery } from "../../redux/slices/categoryApiSlices";
import { Link } from "react-router";
import { ChevronRight, Filter, Home, Search, SortAsc } from "lucide-react";
import { RotatingLines } from "react-loader-spinner";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [filter, setFilter] = useState("active");
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("CreatedAt");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data, isLoading, isError, error, refetch } = useGetAllProductsQuery({
    page: currentPage,
    limit: pageSize,
    sortBy:
      sortBy === "priceLowToHigh"
        ? "price"
        : sortBy === "priceHighToLow"
        ? "price"
        : sortBy === "nameAsc" || sortBy === "nameDesc"
        ? "name"
        : "createdAt",
    order: sortBy === "priceLowToHigh" || sortBy === "nameAsc" ? "asc" : "desc",
    filterBy: filter,
    searchTerm,
    categoryId: categoryFilter,
  });

  const { data: categories = [], isLoading: categoryLoading } =
    useGetAllCategoryQuery({ filterBy: "Active" });

  const { products = [], totalCount = 0 } = data || {};

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (totalCount) {
      setTotalPages(Math.ceil(totalCount / pageSize));
    }
  }, [totalCount]);

  if (isError) return <div>Error: {error.message}</div>;

  if (isLoading || categoryLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Enhanced Breadcrumb */}
        <div className="bg-gradient-to-r bg-indigo-500 shadow-md fixed w-full z-20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-white">
              <Link
                to="/user"
                className="text-white hover:text-white/80 transition-colors flex items-center"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
              <span className="font-medium">Products</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mx-auto px-20 py-10 pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
            <div className="grid gap-4 md:grid-cols-[1fr,auto]">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                  bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                />
              </div>

              {/* Filters Group */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                    rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">All Products</option>
                    <option value="high stock">High Stock</option>
                  </select>
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                  rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                    rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="latest">Latest</option>
                    <option value="priceLowToHigh">Price: Low to High</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="nameAsc">A-Z</option>
                    <option value="nameDesc">Z-A</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                refetch={refetch}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Products;
