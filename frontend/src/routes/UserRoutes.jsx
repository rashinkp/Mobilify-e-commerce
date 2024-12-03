import React from "react";
import { Route, Routes } from "react-router";
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
import IconMain from "../assets/Icon_Main.svg";
import IconMainWhite from "../assets/Icon_Main_white.svg";
import { text } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleTheme } from "../redux/slices/themeSlice.js";
import { useDispatch } from "react-redux";

const UserRoutes = () => {
  const dispatch = useDispatch();
  const icons = {
    light: IconMain,
    dark: IconMainWhite,
  };


  const profile = {
    img: "https://via.placeholder.com/150",
    list: [
      {
        text: "Profile",
        path: "/user/profile",
      },
      {
        text: "Orders",
        path: "/user/orders",
      },
      {
        text: "Wishlist",
        path: "/user/profile",
      },
      {
        text: "Wallet",
        path: "/user/wallet",
      },
      {
        text: "Logout",
        path: "/user/logout",
      },
    ],
  };

  const links = [
    {
      text: "home",
      path: "/user",
    },
    {
      text: "products",
      path: "/user/products",
    },
    {
      text: "contact",
      path: "/user/contact",
    },
    {
      text: "about us",
      path: "/user/about",
    },
  ];

  const rightSection = [
    {
      text: "Wish List",
      icon: (
        <FontAwesomeIcon
          icon={["far", "heart"]}
          size="xl"
          className="cursor-pointer dark:text-lightText hover:text-primary"
        />
      ),
      path: "/user/wishlist",
    },
    {
      text: "My Cart",
      icon: (
        <FontAwesomeIcon
          icon={["fas", "cart-shopping"]}
          size="xl"
          className="cursor-pointer dark:text-lightText hover:text-primary"
        />
      ),
      path: "/user/cart",
    },
    {
      text: "Toggle Theme",
      icon: (
        <FontAwesomeIcon
          size="xl"
          onClick={() => dispatch(toggleTheme())}
          icon="fa-solid fa-moon"
          className="cursor-pointer  hover:text-primary dark:text-lightText dark:hover:text-primary"
        />
      ),
      onClick: () => dispatch(toggleTheme()),
    },
  ];
  return (
    <>
      <div className="mb-28">
        <Navbar icons={icons} links={links} rightSection={rightSection} profile={profile} isLogged={true} role='user'/>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/product" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
      </Routes>
    </>
  );
};

export default UserRoutes;
