import React from "react";
import { useNavigate } from "react-router";
import { Heart, Star, StarHalf } from "lucide-react";
import AddCartButton from "./AddCartButton";
import { useToggleWishListMutation } from "../../redux/slices/wishlistApiSlice";

const ProductCard = ({ product, refetch }) => {
  const navigate = useNavigate();
  const [toggleWishlist] = useToggleWishListMutation();

  const handleClick = (e) => {
    if (!e.target.closest(".wishlist-btn") && !e.target.closest(".cart-btn")) {
      navigate(`/user/product/${product._id}`);
      window.scrollTo(0, 0);
    }
  };

  const handleFavClick = async (e) => {
    e.stopPropagation();
    try {
      await toggleWishlist({ productId: product._id });
      refetch();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const finalPrice = () => {
    let effectiveOfferPercent =
      (product?.offerPercent || 0) + (product?.categoryDetails?.offer || 0);
    effectiveOfferPercent = Math.min(effectiveOfferPercent, 100);
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
    <div className="group relative w-80 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
      <div onClick={handleClick} className="cursor-pointer">
        {/* Image Container */}
        <div className="relative h-72 overflow-hidden rounded-t-xl">
          <img
            src={product?.images[0]?.secure_url || "/api/placeholder/320/288"}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleFavClick}
            className="wishlist-btn absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg 
              hover:scale-110 transition-transform duration-200"
          >
            <Heart
              className={`w-5 h-5 ${
                product.isInWishList
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            />
          </button>

          {/* Offer Badge */}
          {(product?.offerPercent || product?.categoryDetails?.offer) > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {Math.min(
                (product?.offerPercent || 0) +
                  (product?.categoryDetails?.offer || 0),
                100
              )}
              % OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
              {product.name}
            </h3>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price.toFixed(2)}
              </span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                ₹{finalPrice()}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => {
                const rating = product?.reviewStats?.avgRating || 0;
                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 !== 0 && i === fullStars;

                if (i < fullStars) {
                  return (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  );
                } else if (hasHalfStar) {
                  return (
                    <StarHalf
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  );
                }
                return (
                  <Star
                    key={i}
                    className="w-4 h-4 text-gray-300 dark:text-gray-600"
                  />
                );
              })}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({product?.reviewStats?.reviewCount || 0})
            </span>
          </div>

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="text-red-500 text-sm font-medium mb-2">
              Out of Stock
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="cart-btn">
            <AddCartButton
              productId={product._id}
              disabled={product.stock === 0}
              initialIsInCart={product?.isInCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
