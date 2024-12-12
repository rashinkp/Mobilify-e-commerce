import React, { useState } from "react";
import ProductCard from "../../components/user/ProductCard";
import SearchBar from "../../components/SearchBar";
import Footer from "../../components/user/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSort } from "@fortawesome/free-solid-svg-icons";
import useProductApi from "../../hooks/useProductApi";
import { RotatingLines } from "react-loader-spinner";
import BrudCrump from "../../components/BrudCrump";

const Products = () => {
  const { products, isLoading } = useProductApi();
  const [searchTerm, setSearchTerm] = useState("");
  const displayedProduct =
    searchTerm.trim() === ""
      ? products || []
      : products?.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
  
  
  if (isLoading) {
    return (
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
    )
  }

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
  return (
    <>
      <div className="ms-10">
        <BrudCrump list={brudCrumpList} />
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-8 w-full flex justify-center max-w-7xl px-4">
          <SearchBar searchTerm={setSearchTerm} />
        </div>

        <div className="flex flex-wrap justify-between w-full max-w-7xl mb-6 px-4 dark:text-lightText">
          <div className="flex flex-wrap gap-4 mb-4 md:mb-0 items-center w-full md:w-auto">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faFilter}
                className="text-gray-800 dark:text-lightText text-lg mr-2"
              />
              <select className="px-1 py-2 border border-gray-300 rounded-md dark:bg-darkBackground focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200">
                <option value="">Brand</option>
                <option value="brand1">Brand 1</option>
                <option value="brand2">Brand 2</option>
                <option value="brand3">Brand 3</option>
              </select>
            </div>

            <div className="flex items-center">
              <select className="px-3 py-2 border border-gray-300 dark:bg-darkBackground rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200">
                <option value="">Storage</option>
                <option value="64GB">64GB</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
              </select>
            </div>

            <div className="flex items-center">
              <select className="px-3 py-2 border border-gray-300 dark:bg-darkBackground rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200">
                <option value="">RAM</option>
                <option value="4GB">4GB</option>
                <option value="6GB">6GB</option>
                <option value="8GB">8GB</option>
              </select>
            </div>

            <div className="flex items-center">
              <select className="px-3 py-2 border border-gray-300 dark:bg-darkBackground rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200">
                <option value="">Color</option>
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="blue">Blue</option>
              </select>
            </div>

            <div className="flex items-center">
              <select className="px-3 py-2 border border-gray-300 rounded-md dark:bg-darkBackground focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200">
                <option value="">Size</option>
                <option value="6.1">6.1"</option>
                <option value="6.7">6.7"</option>
                <option value="7.0">7.0"</option>
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center w-full md:w-auto mt-4 md:mt-0">
            <FontAwesomeIcon
              icon={faSort}
              className="text-gray-800 mr-2 dark:text-lightText text-lg"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-md dark:bg-darkBackground focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200">
              <option value="latest">Latest</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 5xl:grid-cols-5 justify-center px-4">
          {displayedProduct.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-20 w-full max-w-7xl px-4">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Products;
