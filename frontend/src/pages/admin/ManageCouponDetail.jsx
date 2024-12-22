import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useGetACouponQuery } from "../../redux/slices/couponApiSlice";
import { RotatingLines } from "react-loader-spinner";
import Pagination from "../../components/Pagination";
import { useGetAllProductsQuery } from "../../redux/slices/productApiSlice";

const ManageCouponDetail = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: coupon = {},
    isLoading: couponLoading,
    isError,
    error,
    refetch,
  } = useGetACouponQuery({ id });

  const { data = [], isLoading: productLoading } = useGetAllProductsQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: searchTerm,
  });

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

  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  if (productLoading || couponLoading) {
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
    <div className="min-h-screen space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500">
        <button
          onClick={() => navigate("/")}
          className="flex items-center hover:text-blue-600"
        >
          <Home size={16} className="mr-2" />
          Dashboard
        </button>
        <ChevronRight size={16} className="mx-2" />
        <button onClick={() => navigate(-1)} className="hover:text-blue-600">
          Coupon Management
        </button>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700 font-medium">{coupon.couponId}</span>
      </nav>

      {/* Coupon Details Section */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Coupon Details
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              !coupon.isSoftDeleted
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {coupon.status ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Coupon ID</p>
            <p className="text-gray-900">{coupon._id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Code</p>
            <p className="text-gray-900">{coupon.couponId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Discount</p>
            <p className="text-gray-900">{coupon.discount}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Expiry Date</p>
            <p className="text-gray-900">{coupon.expiryDate}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-gray-900">{coupon.description}</p>
          </div>
        </div>
      </div>

      {/* Products Table Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Applicable Products
          </h2>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase ">
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
        <div className="flex justify-center mt-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageCouponDetail;
