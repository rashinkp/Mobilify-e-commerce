import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Home, Pen } from "lucide-react";
import { useGetACouponQuery } from "../../redux/slices/couponApiSlice";
import { RotatingLines } from "react-loader-spinner";
import CouponApplicable from "../../components/admin/CouponApplicable";

const ManageCouponDetail = () => {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { id } = useParams();

  const {
    data: coupon = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useGetACouponQuery({ id });

  if (isLoading) {
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

  // Toggle the edit section
  const toggleEdit = () => {
    setIsEditOpen((prev) => !prev); // Toggle the value of isEditOpen
  };

  return (
    <div className=" p-4 min-h-screen space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500">
        <button
          onClick={() => navigate("/admin")}
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
            {coupon.isSoftDeleted ? "Inactive" : "Active"}
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
            <p className="text-gray-900">
              {new Date(coupon.expiryDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-gray-900">{coupon.description}</p>
          </div>
        </div>
      </div>

      {/* Applicable Products Section */}
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Applicable Products
        </h2>
        <button
          className="flex items-center gap-2 hover:text-green-600"
          onClick={toggleEdit} // Toggle edit section visibility
        >
          <Pen size={16} className="" />
          {isEditOpen ? "Close Edit" : "Edit"}
        </button>
      </div>

      {/* Conditionally render CouponApplicable component */}
      {isEditOpen && <CouponApplicable coupon={coupon} />}
    </div>
  );
};

export default ManageCouponDetail;
