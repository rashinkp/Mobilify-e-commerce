import React, { useState } from "react";
import { ShoppingCart, Plus, CreditCard } from "lucide-react";
import { useGetAllWishListQuery } from "../../redux/slices/wishlistApiSlice";
import { RotatingLines } from "react-loader-spinner";

const WishList = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useGetAllWishListQuery();

  const handleAddToCart = (productId) => {
    console.log("Added to cart:", productId);
  };

  const handleBuyNow = (productId) => {
    console.log("Buy now:", productId);
  };

  const handleAddAllToCart = () => {
    console.log("Added all to cart");
  };

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Global Actions */}
      <div className="mb-6 flex justify-end gap-3">
        <button
          onClick={handleAddAllToCart}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Add All to Cart
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-6">
        {products.map((product) => (
          <div
            key={product.productId}
            className="bg-white overflow-hidden border-b-2 border-gray-300 p-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Product Image */}
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col sm:flex-row items-center gap-5 justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.description}
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    ${product.price}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 ml-6">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 transition-colors hover:text-blue-600"
                  >
                    <ShoppingCart size={22} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 transition-colors hover:text-green-600"
                  >
                    <CreditCard size={22} />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishList;
