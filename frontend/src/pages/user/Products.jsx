import React from "react";
import ProductCard from "../../components/user/ProductCard";

const Products = () => {
  return (
    <div className="flex gap-14  pt-20 justify-center">
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>
  );
};

export default Products;
