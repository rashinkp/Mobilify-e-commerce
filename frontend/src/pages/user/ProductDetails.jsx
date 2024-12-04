import React from "react";
import ProductDetailsCard from '../../components/ProductDetailsCard.jsx'
import Review from "../../components/user/Review.jsx";
import Footer from '../../components/user/Footer.jsx'
import ProductCard from '../../components/user/ProductCard.jsx'

const ProductDetails = () => {
  


  return (
    <div className="mx-5">
      <ProductDetailsCard />

      <div className="flex flex-col justify-center my-20">
        <p className="text-2xl text-center mb-10 font-bold dark:text-lightText">Related Products</p>
        <div className="grid xl:grid-cols-4 gap-7 lg:grid-cols-3 md:grid-cols-2  mx-auto">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>

      <Review />

      <Footer />
    </div>
  );
};

export default ProductDetails;
