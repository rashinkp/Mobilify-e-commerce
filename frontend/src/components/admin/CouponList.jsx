import React, { useState } from "react";
import ListItem from "../admin/ListItem"; // Reuse ListItem component for displaying the list
import { successToast, errorToast } from "../../components/toast/index.js";
import Modal from "../Modal"; // Reuse Modal component
import { RotatingLines } from "react-loader-spinner";
import { useEditCouponMutation } from "../../redux/slices/couponApiSlice.js";
import { Ban, DatabaseBackup, Eye, Pen } from "lucide-react";
import CouponEditForm from "./CouponEditForm.jsx";
import { useNavigate } from "react-router";

const CouponList = ({ coupons, icon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editCoupon] = useEditCouponMutation();
  const navigate = useNavigate();

  const handleSoftDelete = async () => {
    setLoading(true);
    const coupon = selectedCoupon;
    const data = { isSoftDeleted: !coupon.isSoftDeleted };

    try {
      await editCoupon({
        _id: coupon._id,
        data,
      }).unwrap();
      showSuccessMessage(data.isSoftDeleted ? "softDelete" : "recover");
    } catch (error) {
      errorToast(
        error?.data?.message || error.message || "Failed to update coupon"
      );
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedCoupon(null);
    }
  };

  const showSuccessMessage = (action) => {
    const messageMap = {
      softDelete: "Coupon soft-deleted successfully",
      recover: "Coupon recovered successfully",
      update: "Coupon updated successfully",
    };
    successToast(messageMap[action]);
  };

  const getCouponControls = (coupon) => [
    {
      action: () => {
        navigate(`/admin/manage-coupon/${coupon._id}`)
      },
      style: "",
      icon: <Eye className="text-black hover:text-amber-600" size={20} />,
    },
    {
      action: () => {
        setSelectedCoupon(coupon);
        setIsEditModalOpen(true);
      },
      style: "",
      icon: <Pen className="text-black hover:text-blue-600" size={20} />,
    },
    {
      action: () => {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
      },
      style: "",
      icon: coupon.isSoftDeleted ? (
        <DatabaseBackup className="text-black hover:text-green-600" size={20} />
      ) : (
        <Ban className="text-black hover:text-red-600" size={20} />
      ),
    },
  ];

  const couponColumns = [
    { key: "couponId", label: "Coupon ID", render: (value) => value },
    { key: "title", label: "Title", render: (value) => value },
    { key: "discount", label: "Discount", render: (value) => `${value}%` },
    {
      key: "expiryDate",
      label: "Expiry Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "isSoftDeleted",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            !value ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {!value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <>
      {isModalOpen && (
        <Modal
          title="Are you sure?"
          description="Soft deleting the coupon will affect the active discount"
          controles={[
            {
              text: "Cancel",
              action: () => setIsModalOpen(false),
              style:
                "text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
            },
            {
              text: "Confirm",
              action: handleSoftDelete,
              style:
                "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800",
            },
          ]}
        />
      )}
      {isEditModalOpen && (
        <CouponEditForm
          coupon={selectedCoupon}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {loading && (
        <div className="flex justify-center mt-4">
          <RotatingLines width="50" strokeColor="#4A90E2" />
        </div>
      )}
      <ListItem
        items={coupons || []}
        columns={couponColumns}
        textColor="text-skyBlue"
        controles={getCouponControls}
      />
    </>
  );
};

export default CouponList;
