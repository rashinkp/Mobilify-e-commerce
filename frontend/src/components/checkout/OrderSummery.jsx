import React from "react";
import { ShoppingCart } from "lucide-react";

const OrderSummary = ({ products }) => {

  const finalPrice = (product) => {
    const effectiveOfferPercent =
      (product?.offerPercent || 0) + (product?.category?.offer || 0);

    return effectiveOfferPercent > 0
      ? (
          product.price -
          (product.price * effectiveOfferPercent) / 100
        ).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : product.price.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };


  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <ShoppingCart className="mr-2" /> Order Summary
      </h2>
      {products.length === 0 ? (
        <>No products add products</>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center space-x-4">
              <img
                src={product?.productDetails?.images[0]?.secure_url}
                alt={product?.productDetails?.name}
                className="w-16 h-16 object-cover"
              />
              <div>
                <h3 className="font-semibold">
                  {product?.productDetails?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Model: {product?.productDetails?.model}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">
                <span className="text-gray-500 line-through mr-2">
                  &#x20b9;{product?.productDetails?.price.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
                </span>
                <span>
                  &#x20b9;
                  {finalPrice(product?.productDetails)}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Qty: {product.quantity}
              </p>
            </div>
          </div>
        ))
      )}
    </section>
  );
};


export default OrderSummary