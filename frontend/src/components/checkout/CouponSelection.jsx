import React from "react";
import { PercentIcon } from "lucide-react";

const CouponSection = ({
  couponCode,
  setCouponCode,
  handleCouponApply,
  appliedCoupon,
}) => {
  return (
    <section className="mb-6">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          className="flex-grow p-2 border rounded dark:bg-black dark:border-indigo-500"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button
          onClick={handleCouponApply}
          className="bg-indigo-600 text-white p-2 rounded flex items-center"
        >
          <PercentIcon className="mr-2" /> Apply
        </button>
      </div>
      {appliedCoupon && (
        <p className="text-green-600 mt-2">
          Coupon {appliedCoupon.couponCode} applied:{" "}
          {appliedCoupon.offerPercent}% Discount
        </p>
      )}
    </section>
  );
};

export default CouponSection