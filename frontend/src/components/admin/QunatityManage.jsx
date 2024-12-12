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
      if(stock < 0) throw 'stock can not be less than 0'
      const data = { stock };
      await updateProduct({ data, productId });
      successToast("Product Stock updated successfully")
    } catch (error) {
      errorToast(error?.data?.message || error?.message || error || 'Error occured while updating product quantity');
    }
  };

  const handleStockChange = (value) => {
    setStock(value);
  };

  return (
    <div className="mt-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <span className="dark:text-white font-bold text-lg">Quantity:</span>
        <div className="flex gap-3 items-center mt-3 sm:mt-0">
          <Button
            icon={<FontAwesomeIcon icon="fa-solid fa-minus" />}
            action={() => setStock((prev) => Number(prev) - 1)}
          />
          <input
            type="number"
            value={stock}
            onChange={(e) => handleStockChange(e.target.value)}
            className="w-16 text-center dark:bg-gray-800 dark:text-white border rounded-md py-1"
            min="0"
          />
          <Button
            icon={<FontAwesomeIcon icon="fa-solid fa-plus" />}
            action={() => setStock((prev) => Number(prev) + 1)}
          />
          <button
            onClick={handleUpdateStock}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default QunatityManage;
