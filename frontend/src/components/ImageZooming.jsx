import React, { useState, useRef } from "react";
import { Heart } from "lucide-react";

const ImageZoom = ({ mainImage, product, onFavClick }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isZoomed || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setPosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[500px] dark:bg-gray-900 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={mainImage}
          alt="Main Product"
          className="max-h-full max-w-full object-contain transition-transform duration-200"
          style={{
            transform: isZoomed ? "scale(2)" : "scale(1)",
            transformOrigin: `${position.x * 100}% ${position.y * 100}%`,
          }}
        />
      </div>

      <button
        onClick={onFavClick}
        className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-red-500 transition"
        aria-label="Add to Wishlist"
      >
        <Heart
          className={product.isInWishList ? "text-red-600 fill-current" : ""}
          size={24}
        />
      </button>
    </div>
  );
};

export default ImageZoom;
