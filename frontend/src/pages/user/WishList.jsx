import React, { useState } from "react";
import { ShoppingCart, Plus, CreditCard } from "lucide-react";

const WishList = () => {
  const [products] = useState([
    {
      id: 1,
      name: 'Apple MacBook Pro 17"',
      color: "Silver",
      category: "Laptop",
      price: 2999,
      image: "/api/placeholder/200/200",
    },
    {
      id: 2,
      name: "Microsoft Surface Pro",
      color: "White",
      category: "Laptop PC",
      price: 1999,
      image: "/api/placeholder/200/200",
    },
    {
      id: 3,
      name: "Magic Mouse 2",
      color: "Black",
      category: "Accessories",
      price: 99,
      image: "/api/placeholder/200/200",
    },
  ]);

  const handleAddToCart = (productId) => {
    console.log("Added to cart:", productId);
  };

  const handleBuyNow = (productId) => {
    console.log("Buy now:", productId);
  };

  const handleAddAllToCart = () => {
    console.log("Added all to cart");
  };

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
      <div className="space-y-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white overflow-hidden border-b-2 border-gray-300"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Product Image */}
              <div className="w-full sm:w-48 h-48 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 p-4">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Color: {product.color}</p>
                      <p>Category: {product.category}</p>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        ${product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 transition-colors hover:text-blue-600"
                    >
                      <ShoppingCart className="" size={22} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 transition-colors hover:text-green-600"
                    >
                      <CreditCard className="" size={22} />
                      Buy Now
                    </button>
                  </div>
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
