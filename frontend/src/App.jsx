import React, { useEffect } from "react";
import { Route, Router, Routes } from "react-router";
import HomePage from "./pages/user/HomePage";
import Products from "./pages/user/Products";
import AboutUs from "./pages/user/AboutUs";
import Cart from "./pages/user/Cart";
import Login from "./pages/user/Login";
import Orders from "./pages/user/Orders";
import Checkout from "./pages/user/Checkout";
import Navbar from "./components/user/Navbar";
import { useSelector } from "react-redux";
import ContactUs from "./pages/user/ContactUs";
import SignUp from "./pages/user/SignUp";
import VerifyOtp from "./pages/user/VerifyOtp";
import ProductDetails from "./pages/user/ProductDetails";

const App = () => {
  const theme = useSelector((state) => state.theme.theme);
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  });
  return (
    <div className="">
      <div className="mb-28">
        <Navbar />
      </div>
      <Routes>
        <Route path="/user" element={<HomePage />} />
        <Route path="/user/products" element={<Products />} />
        <Route path="/user/about" element={<AboutUs />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/orders" element={<Orders />} />
        <Route path="/user/product" element={<ProductDetails />} />
        <Route path="/user/checkout" element={<Checkout />} />
        <Route path="/user/contact" element={<ContactUs />} />
        <Route path="/user/signup" element={<SignUp />} />
        <Route path="/user/verify-otp" element={<VerifyOtp />} />
      </Routes>
    </div>
  );
};

export default App;
