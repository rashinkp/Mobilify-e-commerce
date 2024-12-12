import React from "react";
import ProductDetailsCard from '../../components/ProductDetailsCard.jsx'
import Review from "../../components/user/Review.jsx";
import Footer from '../../components/user/Footer.jsx'
import ProductCard from '../../components/user/ProductCard.jsx'
import useProductApi from "../../hooks/useProductApi.jsx";
import { RotatingLines } from "react-loader-spinner";

const ProductDetails = () => {
  
  const { products, isLoading } = useProductApi();
  
  if (isLoading) {
    return (
      <div className="h-screen w-full absolute top-0 z-50 left-0 backdrop-blur-sm bg-black/30 flex justify-center items-center">
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
    <div className="mx-5">
      <ProductDetailsCard />

      <div className="flex flex-col justify-center my-20">
        <p className="text-2xl text-center mb-10 font-bold dark:text-lightText">
          Related Products
        </p>
        <div className="grid xl:grid-cols-4 gap-7 lg:grid-cols-3 md:grid-cols-2  mx-auto">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      <Review />

      <Footer />
    </div>
  );
};

export default ProductDetails;
