import React from 'react'
import { Routes,Route } from 'react-router'
import Dashboard from '../pages/admin/Dashboard'
import UserManagment from '../pages/admin/UserManagment';
import ProductManagement from '../pages/admin/ProductManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import AdminLogin from '../pages/admin/AdminLogin';
import Navbar from '../components/Navbar';
import AdminIcon from '../assets/Admin_Icon.svg'
import AdminDarkIcon from '../assets/Admin_Icon_Dark.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toggleTheme } from '../redux/slices/themeSlice';
import { useDispatch } from 'react-redux';

const AdminRoutes = () => {
  const dispatch = useDispatch()
  const icons = {
    light: AdminIcon,
    dark: AdminDarkIcon,
  };

    const links = [
      {
        text: "home",
        path: "/admin",
      },
      {
        text: "products",
        path: "/admin/products",
      },
      {
        text: "users",
        path: "/admin/users",
      },
      {
        text: "orders",
        path: "/admin/orders",
      },
      {
        text: "coupon",
        path: "/admin/coupon",
      },
  ];
  

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

  const rightSection = [
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
        <Navbar
          icons={icons}
          links={links}
          profile={profile}
          isLogged={true}
          rightSection={rightSection}
        />
      </div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/manage-user" element={<UserManagment />} />
        <Route path="/manage-product" element={<ProductManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    </>
  );
}

export default AdminRoutes