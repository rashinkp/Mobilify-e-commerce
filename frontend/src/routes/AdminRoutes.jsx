import React from 'react'
import { Routes,Route } from 'react-router'
import Dashboard from '../pages/admin/Dashboard'
import UserManagment from '../pages/admin/UserManagment';
import ProductManagement from '../pages/admin/ProductManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import AdminLogin from '../pages/admin/AdminLogin';
import Sidebar from '../components/admin/SideBar';
import CouponManagement from '../pages/admin/CouponManagement.jsx'
import SalesManagement from '../pages/admin/SalesManagement.jsx'
import AdminProfile from '../pages/admin/AdminProfile.jsx'
import ProductDetail from '../pages/admin/ProductDetail.jsx';
const AdminRoutes = () => {
  
  return (
    <>
      <Sidebar />
      <div className="ms-10 sm:ms-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manage-users" element={<UserManagment />} />
          <Route path="/manage-products" element={<ProductManagement />} />
          <Route path="/manage-product" element={<ProductDetail />} />
          <Route path="/manage-orders" element={<OrderManagement />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/manage-coupon" element={<CouponManagement />} />
          <Route path="/manage-sales" element={<SalesManagement />} />
          <Route path="/profile" element={<AdminProfile />} />
        </Routes>
      </div>
    </>
  );
}

export default AdminRoutes