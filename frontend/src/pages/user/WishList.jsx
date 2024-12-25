import React, { useState } from "react";
import { ShoppingCart, Plus, CreditCard, Trash2, Heart } from "lucide-react";
import {
  useAddAllToCartMutation,
  useGetAllWishListQuery,
  useRemoveFromWishlistMutation,
} from "../../redux/slices/wishlistApiSlice";
import { RotatingLines } from "react-loader-spinner";
import { useAddToCartMutation } from "../../redux/slices/cartApiSlice";
import { successToast } from "../../components/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BrudCrump from "../../components/BrudCrump";

const WishList = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useGetAllWishListQuery();

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [remove] = useRemoveFromWishlistMutation();
  const [addAllToCart] = useAddAllToCartMutation();

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId }).unwrap();
      successToast("Product moved to cart");
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyNow = (productId) => {
    console.log("Buy now:", productId);
  };

  const handleAddAllToCart = async () => {
    try {
      await addAllToCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await remove({ productId });
    } catch (error) {
      console.log(error);
    }
  };

  const brudCrumpList = [
    {
      name: "Home",
      icon: <FontAwesomeIcon icon="fa-solid fa-house" />,
      path: "/user",
    },
    {
      name: "Profile",
      icon: <FontAwesomeIcon icon="fa-solid fa-user" />,
      path: "/user/profile",
    },
    {
      name: "Wishlist",
      icon: <FontAwesomeIcon icon="fa-solid fa-user" />,
      path: "/user/wishlist",
    },
  ];

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
    <div className="px-5 sm:px-20 mx-auto">
      <div className="ms-10">
        <BrudCrump list={brudCrumpList} />
      </div>
      {/* Global Actions */}
      <div className="mb-6 flex justify-end gap-3">
        <button
          onClick={handleAddAllToCart}
          disabled={products.length === 0 || isAddingToCart}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          Add All to Cart
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-6">
        {products.length < 1 ? (
          <div className="text-center py-8 text-gray-500">
            No products in wish list
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.productId}
              className="bg-white dark:bg-inherit dark:text-white overflow-hidden border-b-2 border-gray-300 p-4"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 dark:text-white">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      ${product.price}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 ml-6">
                    <button
                      onClick={() => handleAddToCart(product.productId)}
                      className="flex items-center justify-center gap-2 px-4 py-2 transition-colors hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={22} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product.productId)}
                      className="flex items-center justify-center gap-2 px-4 py-2 transition-colors hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CreditCard size={22} />
                      Buy Now
                    </button>
                    <button
                      onClick={() => handleRemove(product.productId)}
                      className="flex items-center justify-center gap-2 px-4 py-2 transition-colors hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishList;
