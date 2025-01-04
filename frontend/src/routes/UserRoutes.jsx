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
import EnterOtp from "../components/EnterOtp.jsx";
import EnterNewPassword from "../components/EnterNewPassword.jsx";
import CheckoutPage from "../pages/user/Checkout.jsx";
import OrderSuccessPage from "../pages/user/SuccessfulOrder.jsx";
import OrderDetailsPage from "../pages/user/Order.jsx";
import OrderListingPage from "../components/MyOrders.jsx";
import ProtectUser from "../pages/user/UserProtect.jsx";
import WishList from "../pages/user/WishList.jsx";
import Wallet from "../pages/user/Wallet.jsx";
import ErrorPage from "../pages/Error.jsx";

// Layout component that includes Navbar
const MainLayout = ({ children }) => {
  return (
    <>
      <div className="mb-20">
        <Navbar />
      </div>
      {children}
    </>
  );
};

const UserRoutes = () => {
  return (
    <Routes>
      {/* Protected routes with navbar */}
      <Route element={<ProtectUser />}>
        <Route
          path="/cart"
          element={
            <MainLayout>
              <Cart />
            </MainLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <MainLayout>
              <OrderListingPage />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <UserProfileDashboard />
            </MainLayout>
          }
        />
        <Route
          path="/orderSuccess"
          element={
            <MainLayout>
              <OrderSuccessPage />
            </MainLayout>
          }
        />
        <Route
          path="/orderDetail/:ordId"
          element={
            <MainLayout>
              <OrderDetailsPage />
            </MainLayout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <MainLayout>
              <WishList />
            </MainLayout>
          }
        />
        <Route
          path="/wallet"
          element={
            <MainLayout>
              <Wallet />
            </MainLayout>
          }
        />
      </Route>

      {/* Public routes with navbar */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/products"
        element={
          <MainLayout>
            <Products />
          </MainLayout>
        }
      />
      <Route
        path="/about"
        element={
          <MainLayout>
            <AboutUs />
          </MainLayout>
        }
      />
      <Route
        path="/login"
        element={
          <MainLayout>
            <Login />
          </MainLayout>
        }
      />
      <Route
        path="/product/:id"
        element={
          <MainLayout>
            <ProductDetails />
          </MainLayout>
        }
      />
      <Route
        path="/checkout"
        element={
          <MainLayout>
            <CheckoutPage />
          </MainLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <MainLayout>
            <ContactUs />
          </MainLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <MainLayout>
            <SignUp />
          </MainLayout>
        }
      />
      <Route
        path="/email-verification/:id"
        element={
          <MainLayout>
            <VerifyOtp />
          </MainLayout>
        }
      />
      <Route
        path="/forgotPassword/email"
        element={
          <MainLayout>
            <EnterEamil />
          </MainLayout>
        }
      />
      <Route
        path="/forgotPassword/otp"
        element={
          <MainLayout>
            <EnterOtp />
          </MainLayout>
        }
      />
      <Route
        path="/forgotPassword"
        element={
          <MainLayout>
            <EnterNewPassword />
          </MainLayout>
        }
      />

      {/* Error routes without navbar */}
      <Route path="/404" element={<ErrorPage />} />
      <Route
        path="/500"
        element={
          <ErrorPage
            code="500"
            title="Server Error"
            message="Something went wrong on our end. Please try again later."
          />
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default UserRoutes;
