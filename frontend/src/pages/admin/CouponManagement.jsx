import React, { useState } from "react";
// import CouponForm from "../../components/coupon/CouponForm.jsx";
// import CouponList from "../../components/coupon/CouponList.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RotatingLines } from "react-loader-spinner";
import { errorToast, successToast } from "../../components/toast/index.js";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router";
import CouponForm from "../../components/admin/CouponForm.jsx";
import {
  useAddCouponMutation,
  useGetAllCouponQuery,
} from "../../redux/slices/couponApiSlice.js";
import CouponList from "../../components/admin/CouponList.jsx";

const CouponManagement = () => {
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [addCoupon] = useAddCouponMutation();
  const {
    data: coupons = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useGetAllCouponQuery();

  const [searchTerm, setSearchTerm] = useState("");

  const displayedCoupons =
    searchTerm.trim() === ""
      ? coupons
      : coupons?.filter((coupon) =>
          coupon.couponId.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const handleAddCoupon = async (data) => {
    try {
      await addCoupon(data).unwrap();
      successToast("Coupon added successfully");
      setIsModalFormOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error.message || error.error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <Link to="/admin" className="flex items-center hover:text-blue-600">
          <Home size={16} className="mr-2" />
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700">Coupon Management</span>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Coupon Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage and monitor your coupons
        </p>
      </div>
      <CouponForm
        isModalFormOpen={isModalFormOpen}
        onClose={() => setIsModalFormOpen(false)}
        onSubmit={handleAddCoupon}
      />
      <SearchBar searchTerm={setSearchTerm} />

      <div className="flex justify-end">
        <button
          onClick={() => setIsModalFormOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg flex items-center gap-2 transition duration-200"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" />
          Add Coupon
        </button>
      </div>

      <div className="">
        <CouponList coupons={displayedCoupons} />
      </div>
      {isLoading && (
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
      )}
    </div>
  );
};

export default CouponManagement;
