import React, { useEffect, useState } from "react";
import { useApplicablesForCheckoutMutation } from "../../redux/slices/couponApiSlice";
import { Loader2 } from "lucide-react";

const ListCoupons = ({ products }) => {
  const [getCoupons, { isLoading }] = useApplicablesForCheckoutMutation();
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      const productIds = products.map((product) => product.productId);

      if (productIds.length === 0) return;

      try {
        // Send productIds directly as the array
        const response = await getCoupons(productIds).unwrap();
        setAvailableCoupons(response);
        setError("");
      } catch (err) {
        console.error("Coupon fetch error:", err);
        setError("Failed to load coupons");
        setAvailableCoupons([]);
      }
    };

    fetchCoupons();
  }, [products, getCoupons]);

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  if (!availableCoupons?.length) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No applicable coupons available
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-2">
        {availableCoupons.map((coupon) => (
          <button
            key={coupon._id}
            className="w-full p-3 border rounded-lg bg-white hover:bg-gray-50 flex justify-between items-center cursor-default"
          >
            <div className="text-left">
              <div className="font-medium">{coupon.couponId}</div>
              <div className="text-sm text-gray-600">{coupon.description}</div>
            </div>
            <div className="text-blue-500 font-medium">{coupon.discount}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListCoupons;
