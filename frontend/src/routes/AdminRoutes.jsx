import React from "react";
import { Routes, Route } from "react-router";
import Dashboard from "../pages/admin/Dashboard";
import UserManagment from "../pages/admin/UserManagment";
import ProductManagement from "../pages/admin/ProductManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import AdminLogin from "../pages/admin/AdminLogin";
import Sidebar from "../components/admin/Sidebar.jsx";
import CouponManagement from "../pages/admin/CouponManagement.jsx";
import SalesManagement from "../pages/admin/SalesManagement.jsx";
import AdminProfile from "../pages/admin/AdminProfile.jsx";
import ProductDetail from "../pages/admin/ProductDetail.jsx";
import CategoryManagement from "../pages/admin/CategoryManagement.jsx";
import UserDetail from "../pages/admin/UserDetail.jsx";
import { useLocation } from "react-router";
import BrandManagement from "../pages/admin/BrandManagement.jsx";
import ManageImage from "../pages/admin/ManageImage.jsx";
const AdminRoutes = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/admin/login" && <Sidebar />}
      <div className="">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manage-users" element={<UserManagment />} />
          <Route path="/manage-user" element={<UserDetail />} />
          <Route path="/manage-products" element={<ProductManagement />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/manage-orders" element={<OrderManagement />} />
          <Route path="/manage-brands" element={<BrandManagement />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/manage-coupon" element={<CouponManagement />} />
          <Route path="/manage-sales" element={<SalesManagement />} />
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/manage-category" element={<CategoryManagement />} />
          <Route path="/manage-image/:id" element={<ManageImage />} />
        </Routes>
      </div>
    </>
  );
};

export default AdminRoutes;
