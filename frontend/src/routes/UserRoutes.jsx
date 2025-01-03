import React from "react";
import { Route, Routes, useNavigate } from "react-router";
import HomePage from "../pages/user/HomePage.jsx";
import VerifyOtp from "../pages/user/VerifyOtp.jsx";
import Products from "../pages/user/Products.jsx";
import AboutUs from "../pages/user/AboutUs.jsx";
import Cart from "../pages/user/Cart.jsx";
import Login from "../pages/user/Login.jsx";
import SignUp from "../pages/user/SignUp.jsx";
import ProductDetails from "../pages/user/ProductDetails.jsx";
import Checkout from "../pages/user/Checkout.jsx";
import ContactUs from "../pages/user/ContactUs.jsx";
import Navbar from "../components/Navbar.jsx";
import UserProfile from "../pages/user/UserProfile.jsx";
import UserProfileDashboard from "../pages/user/UserProfile.jsx";
import EnterEamil from "../components/EnterEamil.jsx";
import EnterOtp from '../components/EnterOtp.jsx'
import EnterNewPassword from "../components/EnterNewPassword.jsx";
import CheckoutPage from "../pages/user/Checkout.jsx";
import OrderSuccessPage from "../pages/user/SuccessfulOrder.jsx";
import OrderDetailsPage from "../pages/user/Order.jsx";
import OrderListingPage from "../components/MyOrders.jsx";
import ProtectUser from "../pages/user/UserProtect.jsx";
import WishList from "../pages/user/WishList.jsx";
import Wallet from '../pages/user/Wallet.jsx'

const UserRoutes = () => {
  
  return (
    <>
      <div className="mb-20">
        <Navbar />
      </div>
      <Routes>
        <Route element={<ProtectUser />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrderListingPage />} />
          <Route path="/profile" element={<UserProfileDashboard />} />
          <Route path="/orderSuccess" element={<OrderSuccessPage />} />
          <Route path="/orderDetail/:ordId" element={<OrderDetailsPage />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/wallet" element={<Wallet />} />
        </Route>

        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/email-verification/:id" element={<VerifyOtp />} />
        <Route path="/forgotPassword/email" element={<EnterEamil />} />
        <Route path="/forgotPassword/otp" element={<EnterOtp />} />
        <Route path="/forgotPassword" element={<EnterNewPassword />} />
      </Routes>
    </>
  );
};

export default UserRoutes;
