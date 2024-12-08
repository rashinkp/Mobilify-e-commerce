import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers,
  faBox,
  faShoppingCart,
  faChartLine,
  faTags,
  faUserCircle,
  faCog,
  faMoon,
  faSun,
  faLayerGroup,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/slices/themeSlice.js";
import SideBarkLink from "./SideBarkLink.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useAdminLogoutMutation } from "../../redux/slices/AdminApiSlices.js";
import { adminLogout } from "../../redux/slices/authAdmin.js";
import { successToast } from "../toast/index.js";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useAdminLogoutMutation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useSelector((state) => state.theme.theme);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(adminLogout());
      successToast("Logout successfull");
      navigate("/admin/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className={`h-screen fixed pe-2 ${
        isSidebarOpen ? "w-64" : "w-16"
      } bg-gray-100 dark:bg-black dark:text-white text-darkText  flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <h1 className={`text-lg font-bold ${!isSidebarOpen && "hidden"}`}>
          Admin Panel
        </h1>
        <button
          className="text-darkText hover:text-black dark:text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FontAwesomeIcon icon="fa-solid fa-bars" />
        </button>
      </div>

      {/* Sidebar Links */}
      <div className="flex-1 px-2 space-y-2 mt-4">
        <Link to="/admin" onClick={() => setIsSidebarOpen(false)}>
          <SideBarkLink
            icon={faTachometerAlt}
            label="Dashboard"
            isSidebarOpen={isSidebarOpen}
            path="/admin"
          />
        </Link>

        <Link to="/admin/manage-users" onClick={() => setIsSidebarOpen(false)}>
          <SideBarkLink
            icon={faUsers}
            label="User Management"
            isSidebarOpen={isSidebarOpen}
            path="/admin/manage-users"
          />
        </Link>

        <Link
          to="/admin/manage-products"
          onClick={() => setIsSidebarOpen(false)}
        >
          <SideBarkLink
            icon={faBox}
            label="Product Management"
            isSidebarOpen={isSidebarOpen}
            path="/admin/manage-products"
          />
        </Link>

        <Link to="/admin/manage-orders" onClick={() => setIsSidebarOpen(false)}>
          <SideBarkLink
            icon={faShoppingCart}
            label="Order Management"
            isSidebarOpen={isSidebarOpen}
            path="/admin/manage-orders"
          />
        </Link>

        <Link
          to="/admin/manage-category"
          onClick={() => setIsSidebarOpen(false)}
        >
          <SideBarkLink
            icon={faLayerGroup}
            label="Category Management"
            isSidebarOpen={isSidebarOpen}
            path="/admin/manage-category"
          />
        </Link>

        <Link to="/admin/manage-brands" onClick={() => setIsSidebarOpen(false)}>
          <SideBarkLink
            icon={faListUl}
            label="Brand Management"
            isSidebarOpen={isSidebarOpen}
            path="/admin/manage-brands"
          />
        </Link>

        <Link to="/admin/manage-sales" onClick={() => setIsSidebarOpen(false)}>
          <SideBarkLink
            icon={faChartLine}
            label="Sales"
            isSidebarOpen={isSidebarOpen}
            path="/admin/manage-sales"
          />
        </Link>

        <Link to="/admin/manage-coupon" onClick={() => setIsSidebarOpen(false)}>
          <SideBarkLink
            icon={faTags}
            label="Coupons"
            isSidebarOpen={isSidebarOpen}
            path="/admin/manage-coupon"
          />
        </Link>

        <Link to="/admin/profile" onClick={() => setIsSidebarOpen(false)}>
          <SideBarkLink
            icon={faUserCircle}
            label="Admin Profile"
            isSidebarOpen={isSidebarOpen}
            path="/admin/profile"
          />
        </Link>
      </div>

      {/* Settings Section */}
      <div className="border-t border-gray-700 p-4">
        <button
          className="flex items-center justify-between w-full text-darkText dark:text-white "
          onClick={toggleTheme}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCog} className="mr-2" />
            <span className={`${!isSidebarOpen && "hidden"}`}>Settings</span>
          </div>
          <FontAwesomeIcon
            icon={theme === "light" ? faSun : faMoon}
            onClick={() => dispatch(toggleTheme())}
          />
        </button>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600`}
        >
          <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
