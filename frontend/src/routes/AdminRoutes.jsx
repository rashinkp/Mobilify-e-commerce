import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import UserManagment from "../pages/admin/UserManagment";
import ProductManagement from "../pages/admin/ProductManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import AdminLogin from "../pages/admin/AdminLogin";
import Sidebar from "../components/admin/Sidebar.jsx";
import CouponManagement from "../pages/admin/CouponManagement.jsx";
import AdminProfile from "../pages/admin/AdminProfile.jsx";
import ProductDetail from "../pages/admin/ProductDetail.jsx";
import CategoryManagement from "../pages/admin/CategoryManagement.jsx";
import UserDetail from "../pages/admin/UserDetail.jsx";
import { useLocation } from "react-router";
import BrandManagement from "../pages/admin/BrandManagement.jsx";
import ManageImage from "../pages/admin/ManageImage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import OrderDetail from "../pages/admin/OrderDetail.jsx";
import ManageCouponDetail from "../pages/admin/ManageCouponDetail.jsx";
import SalesReport from "../pages/admin/SalesManagement.jsx";
import ErrorPage from "../pages/Error.jsx";

// Admin Layout component
const AdminLayout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div className="ms-64 p-6">{children}</div>
    </>
  );
};

const AdminRoutes = () => {
  const location = useLocation();

  return (
    <>
      <Routes>
        {/* Protected routes with sidebar */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/manage-users"
            element={
              <AdminLayout>
                <UserManagment />
              </AdminLayout>
            }
          />
          <Route
            path="/manage-user"
            element={
              <AdminLayout>
                <UserDetail />
              </AdminLayout>
            }
          />
          <Route
            path="/manage-products"
            element={
              <AdminLayout>
                <ProductManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <AdminLayout>
                <ProductDetail />
              </AdminLayout>
            }
          />
          <Route
            path="/manage-orders"
            element={
              <AdminLayout>
                <OrderManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/order/:id"
            element={
              <AdminLayout>
                <OrderDetail />
              </AdminLayout>
            }
          />
          <Route
            path="/manage-brands"
            element={
              <AdminLayout>
                <BrandManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/manage-coupon"
            element={
              <AdminLayout>
                <CouponManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/manage-sales"
            element={
              <AdminLayout>
                <SalesReport />
              </AdminLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            }
          />
          <Route
            path="/manage-category"
            element={
              <AdminLayout>
                <CategoryManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/manage-image/:id"
            element={
              <AdminLayout>
                <ManageImage />
              </AdminLayout>
            }
          />
          <Route
            path="/manage-coupon/:id"
            element={
              <AdminLayout>
                <ManageCouponDetail />
              </AdminLayout>
            }
          />
        </Route>

        {/* Login route without sidebar */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Error routes without sidebar */}
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
        <Route
          path="/403"
          element={
            <ErrorPage
              code="403"
              title="Access Denied"
              message="You don't have permission to access this resource."
            />
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default AdminRoutes;
