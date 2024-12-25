import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddCartButton from "./AddCartButton";
import { useNavigate } from "react-router";
import noImage from "../../assets/noImage.png";
import { useToggleWishListMutation } from "../../redux/slices/wishlistApiSlice";

const ProductCard = ({ product, refetch }) => {
  const { name, price, description, _id } = product;
  const [toggleWishlist] = useToggleWishListMutation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);

  const handleClick = (e) => {
    // Prevent navigation if clicking on the heart icon or add to cart button
    if (!e.target.closest(".wishlist-btn") && !e.target.closest(".cart-btn")) {
      navigate(`/user/product/${_id}`);
    }
  };

  const handleFavClick = async (e) => {
    e.stopPropagation();
    try {
      await toggleWishlist({ productId: _id });
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
    <div className="cursor-pointer">
      <div
        onClick={handleClick}
        className="border rounded-lg shadow-lg overflow-hidden w-80 bg-lightBackground h-72 flex justify-center items-center dark:bg-darkBackground"
      >
        {/* Upper part: Love icon and product image */}
        <div className="relative px-2">
          <span
            className="wishlist-btn absolute top-3 right-4 text-xl cursor-pointer flex justify-center rounded-3xl w-10 h-10 items-center bg-darkText dark:bg-darkBackground"
            onClick={handleFavClick}
          >
            {product.isInWishList ? (
              <FontAwesomeIcon
                icon="fa-solid fa-heart"
                className="text-red-600"
                size="md"
              />
            ) : (
              <FontAwesomeIcon
                icon="fa-regular fa-heart"
                className="text-white"
                size="md"
              />
            )}
          </span>
          <img
            className="w-64 h-60 object-cover rounded-md"
            src={product?.images[0]?.secure_url || noImage}
            alt="Product"
          />
        </div>
      </div>

      <div className="overflow-hidden w-80">
        {/* Lower part: Name, price, description, and rating */}
        <div className="p-4">
          <div
            onClick={handleClick}
            className="flex justify-between items-center mb-2"
          >
            <h3 className="text-lg font-semibold dark:text-lightText">
              {name}
            </h3>
            <div className="flex flex-col">
              {/* Original Price */}
              <span className="text-darkGray line-through mr-2">
                {"\u20B9"}
                {price.toFixed(2)}
              </span>
              {/* Offer Price */}
              <span className="text-darkText font-extrabold text-lg dark:text-lightText">
                {"\u20B9"}
                {finalPrice()}
              </span>
            </div>
          </div>
          <p className="text-darkGray mb-2">{description}</p>
          <div onClick={handleClick} className="flex items-center mb-4">
            <span className="text-green-500 text-sm flex gap-1">
              <FontAwesomeIcon icon="fa-solid fa-star" />
              <FontAwesomeIcon icon="fa-solid fa-star" />
              <FontAwesomeIcon icon="fa-solid fa-star" />
              <FontAwesomeIcon icon="fa-solid fa-star" />
              <FontAwesomeIcon icon="fa-solid fa-star" />
            </span>
            <span className="text-darkGray ml-2">(156)</span>
          </div>
          <div className="cart-btn">
            <AddCartButton
              productId={product._id}
              disabled={product.stock === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
