import React, { useEffect } from "react";
import Banner1 from "../../assets/Banner1_Home.svg";
import Banner2 from "../../assets/Banner2_Home.svg";
import ProductCard from "../../components/user/ProductCard.jsx";
import Footer from "../../components/user/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RotatingLines } from "react-loader-spinner";
import useProductApi from "../../hooks/useProductApi.jsx";
const HomePage = () => {
  const { userInfo } = useSelector((state) => state.userAuth);
  const navigate = useNavigate()
  useEffect(() => {
    if (!userInfo) {
      navigate('/user/login')
    }
  }, [userInfo, navigate])
  
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
    <div className="">
      <img src={Banner1} className="w-full mb-20 object-fill" alt="" />
      <div className="px-16">
        <p className="font-extrabold text-4xl dark:text-lightText">
          New <span className="text-primary">arrival</span> for you
        </p>
        <div className="mt-14 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 5xl:grid-cols-5 justify-center px-4">
          {products.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      </div>
      <img src={Banner2} className="w-full mt-20 object-cover mb-20" alt="" />
      <div className="px-16">
        <p className="font-extrabold text-4xl dark:text-lightText">
          Flash sale for <span className="text-primary">best</span> sellers
        </p>
        <div className="mt-14 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 5xl:grid-cols-5 justify-center px-4">
          {products.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      </div>
      <div className="px-20 mt-20 mb-20">
        <p className="font-extrabold text-center text-4xl dark:text-lightText">
          Empower <span className="text-primary">Your</span> World, One Mobile
          at a Time.
        </p>
      </div>
      <div className="flex justify-center items-center w-full px-4 mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
