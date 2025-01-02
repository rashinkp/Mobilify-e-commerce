import React from "react";
import {
  ShoppingCart,
  CreditCard,
  Trash2,
  Home,
  ChevronRight,
  User,
} from "lucide-react";
import { Link } from "react-router";
import {
  useAddAllToCartMutation,
  useGetAllWishListQuery,
  useRemoveFromWishlistMutation,
} from "../../redux/slices/wishlistApiSlice";
import { useAddToCartMutation } from "../../redux/slices/cartApiSlice";
import { incrementCartCount } from "../../redux/slices/cartCount";
import { useDispatch } from "react-redux";

const WishList = () => {
  const { data: products = [], isLoading, refetch } = useGetAllWishListQuery();

  const [addToCart] = useAddToCartMutation();
  const [remove] = useRemoveFromWishlistMutation();
  const [addAllToCart] = useAddAllToCartMutation();
  const dispatch = useDispatch();

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId }).unwrap();
      dispatch(incrementCartCount());
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuyNow = (productId) => {
    console.log("Buy now:", productId);
  };

  const handleAddAllToCart = async () => {
    try {
      await addAllToCart();
      dispatch(incrementCartCount(products.length));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await remove({ productId });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              to="/user/profile"
              className="text-white hover:text-white/80 transition-colors flex items-center"
            >
              <User className="w-4 h-4 mr-1" />
              Profile
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
            <span className="font-medium">My Wishlist</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl pt-20 mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Wishlist
          </h1>
          <button
            onClick={handleAddAllToCart}
            disabled={products.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            Add All to Cart
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Your wishlist is empty
            </p>
            <Link
              to="/user/products"
              className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div
                key={product.productId}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {product.description}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          ₹{product.price.toLocaleString("en-In")}
                        </span>
                      </div>
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => handleAddToCart(product.productId)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow(product.productId)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-indigo-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          <CreditCard className="w-4 h-4" />
                          Buy Now
                        </button>
                        <button
                          onClick={() => handleRemove(product.productId)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
