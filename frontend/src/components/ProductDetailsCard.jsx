import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useGetProductQuery } from "../redux/slices/productApiSlice";
import { useToggleWishListMutation } from "../redux/slices/wishlistApiSlice";
import { RotatingLines } from "react-loader-spinner";
import AddCartButton from "../components/user/AddCartButton";
import ImageZoom from "./ImageZooming";
import {
  Box,
  ChevronRight,
  Home,
  Star,
  StarHalf,
  ShoppingCart,
  CreditCard,
  Check,
  PackageOpen,
} from "lucide-react";
import noImage from "../assets/noImage.png";

const ProductDetails = () => {
  const { id } = useParams();
  const [toggleWishlist] = useToggleWishListMutation();
  const { data: product, isLoading, refetch } = useGetProductQuery(id);
  const [mainImage, setMainImage] = useState(noImage);

  useEffect(() => {
    setMainImage(product?.images[0]?.secure_url);
  }, [product]);

  const finalPrice = () => {
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

  const handleFavClick = async () => {
    try {
      await toggleWishlist({ productId: product._id });
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyNow = () => {
    // Implement buy now logic
    console.log("Buy Now clicked");
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full absolute top-0 z-50 left-0 backdrop-blur-sm bg-black/30 flex justify-center items-center">
        <RotatingLines
          visible={true}
          height="50"
          width="50"
          color="grey"
          strokeWidth="2"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation */}
      <div className="bg-gradient-to-r bg-indigo-500 shadow-md fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-white">
            <Link
              to="/user"
              className="text-white hover:text-white/80 transition-colors flex items-center"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-white/60" />

            <Link
              to="/user/products"
              className="text-white hover:text-white/80 transition-colors flex items-center"
            >
              <Box className="w-4 h-4 mr-1" />
              Products
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
            <span className="font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className=" dark:bg-gray-800 ">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: Image Section */}
              <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
                <div className=" dark:bg-gray-900 rounded-xl p-6">
                  <ImageZoom
                    mainImage={mainImage}
                    product={product}
                    onFavClick={handleFavClick}
                  />
                </div>
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {product.images.map((thumb, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(thumb.secure_url)}
                      className={`relative aspect-square rounded-lg overflow-hidden
                        ${
                          mainImage === thumb.secure_url
                            ? "ring-2 ring-indigo-500"
                            : "ring-1 ring-gray-200 dark:ring-gray-700"
                        }
                        hover:ring-2 hover:ring-indigo-400 transition-all`}
                    >
                      <img
                        src={thumb.secure_url || noImage}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Details Section */}
              <div className="p-6 lg:p-8">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      {product.name}
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Model:{" "}
                      <span className="font-medium">{product.model}</span>
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product?.review?.averageRating || 0)
                              ? "fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({product?.review?.count || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{finalPrice()}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-green-600 font-medium">
                        {product.offerPercent + product?.category?.offer}% OFF
                      </span>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        icon: PackageOpen,
                        label: "RAM",
                        value: `${product.ram} GB`,
                      },
                      {
                        icon: Box,
                        label: "Storage",
                        value: `${product.storage} GB`,
                      },
                      {
                        icon: Check,
                        label: "Warranty",
                        value: product.warranty,
                      },
                      {
                        icon: CreditCard,
                        label: "COD",
                        value: product.COD ? "Available" : "Not Available",
                      },
                    ].map((feature, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg flex items-center gap-3"
                      >
                        <feature.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {feature.label}
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {feature.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stock Status */}
                  <p
                    className={`text-lg font-medium
                    ${
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock > 20
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : product.stock > 20
                      ? "In Stock"
                      : `Only ${product.stock} left`}
                  </p>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* <button
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      className="w-full px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 
                        disabled:bg-gray-400 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      Buy Now
                    </button> */}
                    <AddCartButton
                      productId={product._id}
                      disabled={product.stock === 0}
                      className="w-full px-6 py-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 
                        disabled:bg-gray-100 disabled:text-gray-400 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </AddCartButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
