import React from "react";
import { Route, Routes, useNavigate } from "react-router";
import HomePage from "../pages/user/HomePage.jsx";
import VerifyOtp from "../pages/user/VerifyOtp.jsx";
import Products from "../pages/user/Products.jsx";
import AboutUs from "../pages/user/AboutUs.jsx";
import Cart from "../pages/user/Cart.jsx";
import Login from "../pages/user/Login.jsx";
import SignUp from "../pages/user/SignUp.jsx";
import Orders from "../pages/user/Orders.jsx";
import ProductDetails from "../pages/user/ProductDetails.jsx";
import Checkout from "../pages/user/Checkout.jsx";
import ContactUs from "../pages/user/ContactUs.jsx";
import Navbar from "../components/Navbar.jsx";
import UserProfile from "../pages/user/UserProfile.jsx";
import UserProfileDashboard from "../pages/user/UserProfile.jsx";


const UserRoutes = () => {
  
  return (
    <>
      <div className="mb-28">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/email-verification/:id" element={<VerifyOtp />} />
        <Route path="/profile" element={<UserProfileDashboard />} />
      </Routes>
    </>
  );
};

export default UserRoutes;
