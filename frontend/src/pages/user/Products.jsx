import React, { useEffect, useState } from "react";
import ProductCard from "../../components/user/ProductCard";
import SearchBar from "../../components/SearchBar";
import Footer from "../../components/user/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSort } from "@fortawesome/free-solid-svg-icons";
import useProductApi from "../../hooks/useProductApi";
import { RotatingLines } from "react-loader-spinner";
import BrudCrump from "../../components/BrudCrump";
import { useGetAllProductsQuery } from "../../redux/slices/productApiSlice";
import Pagination from "../../components/Pagination";
import { useGetAllCategoryQuery } from "../../redux/slices/categoryApiSlices";

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

  console.log(products);

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

  const brudCrumpList = [
    {
      name: "Home",
      icon: <FontAwesomeIcon icon="fa-solid fa-house" />,
      path: "/user",
    },
    {
      name: "Products",
      icon: <FontAwesomeIcon icon="fa-solid fa-mobile-button" />,
      path: "/user/products",
    },
  ];

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
      <div className="ms-10">
        <BrudCrump list={brudCrumpList} />
      </div>
      <div className="p-5">
        <SearchBar searchTerm={setSearchTerm} />
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-between w-full max-w-7xl mb-6 px-4 dark:text-lightText">
          <div className="flex flex-wrap gap-4 mb-4 md:mb-0 items-center w-full md:w-auto">
            <div className="flex items-center gap-5">
              <FontAwesomeIcon
                icon={faFilter}
                className="text-gray-800 dark:text-lightText text-lg mr-2"
              />
              <select
                className="px-1 py-2 border border-gray-300 rounded-md dark:bg-darkBackground focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="active">All Products</option>
                <option value="high stock">High Stock</option>
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
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center w-full md:w-auto mt-4 md:mt-0">
            <FontAwesomeIcon
              icon={faSort}
              className="text-gray-800 mr-2 dark:text-lightText text-lg"
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md dark:bg-darkBackground focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 5xl:grid-cols-5 justify-center px-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              refetch={refetch}
            />
          ))}
        </div>

        <div className="mt-16">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="mt-10 w-full max-w-7xl px-4">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Products;
