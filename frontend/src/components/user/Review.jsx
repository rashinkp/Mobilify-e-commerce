import React from "react";

const Review = () => {
  return (
   <div className="p-6 m-5 max-w-5xl mx-auto bg-white dark:bg-black  border dark:border-none border-gray-200 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        {/* Profile Image */}
        <img
          className="w-12 h-12 rounded-full border border-gray-300 mr-4"
          src="https://via.placeholder.com/48"
          alt="User profile"
        />
        <div className="flex-1">
          <div className="text-lg font-semibold text-gray-800 dark:text-white">John Doe</div>
          <div className="ml-2 flex">
            {/* Full stars */}
            <span className="text-yellow-500">★</span>
            <span className="text-yellow-500">★</span>
            <span className="text-yellow-500">★</span>
            <span className="text-yellow-500">★</span>
            {/* Half star */}
            <span className="text-yellow-500">★</span>
            {/* Empty stars */}
            <span className="text-gray-300">★</span>
            <span className="text-gray-300">★</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 dark:text-lightText">
        This product is amazing! The build quality is top-notch, and it performs well beyond expectations. Highly recommend!
      </p>
    </div>
  );
};

export default Review;
