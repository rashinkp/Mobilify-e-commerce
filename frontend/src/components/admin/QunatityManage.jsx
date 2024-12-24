import React, { useState } from "react";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router";
import useProductApi from "../../hooks/useProductApi";
import { errorToast, successToast } from "../toast";

const QunatityManage = ({ count }) => {
  const [stock, setStock] = useState(count);
  const { productId } = useParams();
  // const [updateStock] = useUpdateProductStockMutation();
  const { updateProduct } = useProductApi();

  const handleUpdateStock = async () => {
    try {
      if (stock < 0) throw "stock can not be less than 0";
      const data = { stock };
      await updateProduct({ data, productId });
      successToast("Product Stock updated successfully");
    } catch (error) {
      errorToast(
        error?.data?.message ||
          error?.message ||
          error ||
          "Error occured while updating product quantity"
      );
    }
  };

  const handleStockChange = (value) => {
    setStock(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Manage Stock
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Current stock: {count} units
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setStock((prev) => Math.max(0, Number(prev) - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              aria-label="Decrease quantity"
            >
              <FontAwesomeIcon icon="fa-solid fa-minus" className="text-xs" />
            </button>

            <input
              type="number"
              value={stock}
              onChange={(e) => handleStockChange(e.target.value)}
              className="w-16 text-center bg-transparent border-none text-gray-900 dark:text-white text-lg font-medium focus:outline-none focus:ring-0"
              min="0"
              aria-label="Quantity"
            />

            <button
              onClick={() => setStock((prev) => Number(prev) + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              aria-label="Increase quantity"
            >
              <FontAwesomeIcon icon="fa-solid fa-plus" className="text-xs" />
            </button>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdateStock}
            disabled={count === stock}
            className="px-4 py-2.5 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600
            bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm"
          >
            {count === stock ? (
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon="fa-solid fa-check" className="text-xs" />
                Updated
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon="fa-solid fa-arrow-up"
                  className="text-xs"
                />
                Update Stock
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QunatityManage;
