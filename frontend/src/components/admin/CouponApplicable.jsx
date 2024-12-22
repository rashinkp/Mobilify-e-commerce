import React, { useEffect, useState } from "react";
import { useGetAllProductsQuery } from "../../redux/slices/productApiSlice.js";
import { RotatingLines } from "react-loader-spinner";
import Pagination from "../Pagination.jsx";
import { useUpdateApplicablesMutation } from "../../redux/slices/couponApiSlice.js";
import { successToast } from "../toast/index.js";

const CouponApplicable = ({ coupon }) => {
  const { _id: couponId, applicables = [] } = coupon;
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [initialSelectedProducts, setInitialSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [updateApplicable] = useUpdateApplicablesMutation();

  const { data = [], isLoading: productLoading } = useGetAllProductsQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: searchTerm,
  });

  const { products = [], totalCount = 0 } = data || {};

  // Initialize selected products from coupon applicables
  useEffect(() => {
    if (applicables?.length > 0) {
      setSelectedProducts(applicables);
      setInitialSelectedProducts(applicables);
    }
  }, [applicables]);

  const hasChanges =
    JSON.stringify([...selectedProducts].sort()) !==
    JSON.stringify([...initialSelectedProducts].sort());

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

  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleUpdate = async () => {
    if (!hasChanges || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateApplicable({ selectedProducts, couponId });
      setInitialSelectedProducts(selectedProducts);
      successToast("Updated!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (productLoading) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
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
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleUpdate}
            disabled={!hasChanges || isUpdating}
            className={`px-4 py-2 rounded-lg ${
              hasChanges && !isUpdating
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition-colors duration-200`}
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product
                </th>
                <th scope="col" className="px-6 py-3">
                  Id
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Select
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-3"
                  >
                    <img
                      src={product.images[0].secure_url}
                      alt={product.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {product.name}
                  </th>
                  <td className="px-6 py-4">{product._id}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleProductSelection(product._id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-5 pb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default CouponApplicable;
