import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const ManageCouponDetail = () => {
  const navigate = useNavigate();

  // Dummy data for coupon and products
  const coupon = {
    couponId: "C12345",
    code: "SAVE50",
    discount: 50,
    expiryDate: "2024-12-31",
    description: "Save 50% on selected items",
    status: "Active",
  };

  const products = [
    {
      _id: "P001",
      name: "Product 1",
      image: "/api/placeholder/64/64",
      category: "Electronics",
      price: "$299",
    },
    {
      _id: "P002",
      name: "Product 2",
      image: "/api/placeholder/64/64",
      category: "Clothing",
      price: "$59",
    },
    {
      _id: "P003",
      name: "Product 3",
      image: "/api/placeholder/64/64",
      category: "Home",
      price: "$149",
    },
    {
      _id: "P004",
      name: "Product 4",
      image: "/api/placeholder/64/64",
      category: "Electronics",
      price: "$199",
    },
  ];

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

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
              coupon.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {coupon.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Coupon ID</p>
            <p className="text-gray-900">{coupon.couponId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Code</p>
            <p className="text-gray-900">{coupon.code}</p>
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
                  Category
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
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {product.name}
                  </th>
                  <td className="px-6 py-4">{product.category}</td>
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
      </div>
    </div>
  );
};

export default ManageCouponDetail;
