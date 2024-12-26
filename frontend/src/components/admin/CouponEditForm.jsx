import React from "react";
import Form from "../Form.jsx";
import { couponValidation } from "../../validationSchemas.js"; // Add a validation schema for coupons
import { useEditCouponMutation } from "../../redux/slices/couponApiSlice.js";
import { errorToast, successToast } from "../toast/index.js";

const CouponEditForm = ({ coupon, onClose }) => {
  const [editCoupon] = useEditCouponMutation();

  const couponFields = [
    {
      name: "couponId",
      label: "Coupon Code",
      type: "text",
      placeholder: "Enter coupon code",
      required: true,
      defaultValue: coupon?.couponId || "",
    },
    {
      name: "discount",
      label: "Discount (%)",
      type: "number",
      placeholder: "Enter discount percentage",
      required: true,
      defaultValue: coupon?.discount || "",
      min: 1,
      max: 100,
    },
    {
      name: "minAmount",
      label: "Mininmu Amount",
      type: "number",
      placeholder: "Enter Mininmu Amount",
      required: true,
      defaultValue: coupon?.minAmount,
    },
    {
      name: "maxAmount",
      label: "Maximum Amount",
      type: "number",
      placeholder: "Enter Discount Maximum Amount",
      required: true,
      defaultValue: coupon?.maxAmount,
    },
    {
      name: "expiryDate",
      label: "Expiry Date",
      type: "date",
      placeholder: "Select expiry date",
      required: true,
      defaultValue: coupon?.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split("T")[0]
        : "",
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Enter a description",
      required: false,
      defaultValue: coupon?.description || "",
    },
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter a title",
      required: false,
      defaultValue: coupon?.title || "",
    },
  ];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (data) => {
    console.log(data);
    try {
      await editCoupon({ _id: coupon._id, data }).unwrap();
      successToast("Coupon updated successfully");
      onClose();
    } catch (error) {
      errorToast(
        error?.data?.message || error.message || "Failed to update coupon"
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
      onClick={handleOverlayClick}
    >
      <div
        className="p-6 w-full max-w-lg rounded-lg shadow-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <Form
          title="Edit Coupon"
          fields={couponFields}
          onSubmit={handleSubmit}
          buttonText="Submit"
          validationRules={couponValidation}
        />
      </div>
    </div>
  );
};

export default CouponEditForm;
