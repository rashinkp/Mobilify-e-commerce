import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const SearchBar = () => {
  return (
    <div className="bg-gray-200 dark:bg-darkBackground dark:border h-14 flex items-center px-4 gap-3 w-full sm:w-[300px] md:w-[400px] lg:w-[500px] rounded-2xl shadow-md">
      <FontAwesomeIcon
        icon="fa-solid fa-magnifying-glass"
        className="text-gray-500 dark:text-gray-400"
      />
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent w-full h-full text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-0"
      />
    </div>
  );
};

export default SearchBar;
