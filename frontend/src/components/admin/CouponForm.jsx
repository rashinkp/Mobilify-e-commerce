import React from "react";
import Form from "../Form";
import { couponValidation } from "../../validationSchemas";
import { useCategoryApi } from "../../hooks/useCategoryApi";

const CouponForm = ({ isModalFormOpen, onClose, onSubmit }) => {
  // const { categories = [], isLoading } = useCategoryApi();

  // console.log(categories)

  const couponFields = [
    {
      name: "couponId",
      label: "Coupon ID",
      type: "text",
      placeholder: "Enter unique Coupon ID",
      required: true,
    },
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter Coupon Title",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter Coupon Description",
      required: true,
    },
    {
      name: "discount",
      label: "Discount",
      type: "number",
      placeholder: "Enter Discount Percentage",
      required: true,
      min: 1,
    },
    {
      name: "minAmount",
      label: "Mininmu Amount",
      type: "number",
      placeholder: "Enter Mininmu Amount",
      required: true,
    },
    {
      name: "maxAmount",
      label: "Maximum Amount",
      type: "number",
      placeholder: "Enter Discount Maximum Amount",
      required: true,
    },
    {
      name: "expiryDate",
      label: "Expiry Date",
      type: "date",
      placeholder: "Select Expiry Date",
      required: true,
    },
    // {
    //   name: "applicableCategories",
    //   label: "Applicable Categories",
    //   type: "select",
    //   placeholder: "select",
    //   required: true,
    // },
  ];

  if (!isModalFormOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // if (isLoading) {
  //         return (
  //           <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
  //             <RotatingLines
  //               visible={true}
  //               height="50"
  //               width="50"
  //               color="grey"
  //               strokeColor="#fff"
  //               strokeWidth="2"
  //               animationDuration="8"
  //               ariaLabel="rotating-lines-loading"
  //             />
  //           </div>
  //         );
  //       }

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
          fields={couponFields}
          title="Add Coupon"
          buttonText="Add Coupon"
          onSubmit={onSubmit}
          validationRules={couponValidation}
        />
      </div>
    </div>
  );
};

export default CouponForm;
