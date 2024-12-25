import React from "react";
 const OrderTotal = ({
  calculateSubtotal,
  selectedShipping,
  appliedCoupon,
  calculateTotal,
}) => {
  return (
    <section className="mb-6 bg-gray-100 dark:bg-transparent p-4 rounded-lg">
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>&#x20b9;{calculateSubtotal.toFixed(2)}</span>
      </div>
      {selectedShipping && (
        <div className="flex justify-between mb-2">
          <span>Shipping ({selectedShipping.name})</span>
          <span>&#x20b9;{selectedShipping.price.toFixed(2)}</span>
        </div>
      )}
      {appliedCoupon && (
        <div className="flex justify-between mb-2 text-green-600">
          <span>Coupon Discount</span>
          <span>-&#x20b9;{appliedCoupon.couponDiscount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between font-bold text-lg border-t pt-2">
        <span>Total</span>
        <span>&#x20b9;{calculateTotal().toFixed(2)}</span>
      </div>
    </section>
  );
};


export default OrderTotal