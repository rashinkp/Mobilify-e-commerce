import React from "react";
import {
  LayoutDashboard,
  Users,
  Box,
  ShoppingCart,
  BarChart3,
  Tags,
  User,
  Settings,
  LogOut,
  Layers,
  List,
  Sun,
  Moon
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/slices/themeSlice";
import { useAdminLogoutMutation } from "../../redux/slices/adminApiSlices";
import { adminLogout } from "../../redux/slices/authAdmin";
import { successToast } from "../toast/index";

const SidebarLink = ({ icon: Icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <div
      className={`
        group flex items-center 
        px-4 py-3 
        transition-colors duration-200 
        ${
          isActive
            ? "  text-blue-600"
            : "  text-gray-600 dark:text-gray-300"
        }
        rounded-lg
        cursor-pointer
      `}
    >
      <Icon
        className={`
          mr-3
          ${isActive ? "text-blue-600" : "text-white dark:text-gray-400"}
        `}
        size={20}
      />
      <span
        className={`
          text-sm font-medium 
          ${isActive ? "text-blue-600" : "text-white dark:text-gray-200"}
        `}
      >
        {label}
      </span>
    </div>
  );
};



const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);

  const [logoutApiCall] = useAdminLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(adminLogout());
      successToast("Logout successful");
      navigate("/admin/login");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleThemeHandler = () => {
    dispatch(toggleTheme());
  };

  const sidebarLinks = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin",
    },
    {
      icon: Users,
      label: "User Management",
      path: "/admin/manage-users",
    },
    {
      icon: Box,
      label: "Product Management",
      path: "/admin/manage-products",
    },
    {
      icon: ShoppingCart,
      label: "Order Management",
      path: "/admin/manage-orders",
    },
    {
      icon: Layers,
      label: "Category Management",
      path: "/admin/manage-category",
    },
    {
      icon: List,
      label: "Brand Management",
      path: "/admin/manage-brands",
    },
    {
      icon: BarChart3,
      label: "Sales",
      path: "/admin/manage-sales",
    },
    {
      icon: Tags,
      label: "Coupons",
      path: "/admin/manage-coupon",
    },
    {
      icon: User,
      label: "Admin Profile",
      path: "/admin/profile",
    },
  ];

  return (
    <div
      className={`
        fixed 
        left-0 
        top-0 
        h-screen 
        w-64
        bg-black 
        text-white
        dark:bg-gray-900 
        flex 
        flex-col 
        dark:border-gray-800
        ps-3
        pt-4 
        z-50
      `}
    >
      {/* Sidebar Header */}
      <div
        className="
          flex 
          items-center 
          px-4 
          py-4 
          dark:border-gray-800
        "
      >
        <h1
          className="
            text-xl 
            font-bold 
            text-white 
            dark:text-white
          "
        >
          Admin Panel
        </h1>
      </div>

      {/* Sidebar Links */}
      <nav className="flex-1 py-4">
        <div className="space-y-2">
          {sidebarLinks.map((link, index) => (
            <Link key={index} to={link.path}>
              <SidebarLink
                icon={link.icon}
                label={link.label}
                path={link.path}
              />
            </Link>
          ))}
        </div>
      </nav>

      {/* Settings and Logout Section */}
      <div className=" dark:border-gray-800 p-4 space-y-3">
        {/* Theme Toggle */}
        <div
          className={`
            flex 
            items-center 
            justify-between
            cursor-pointer
            p-2 
            rounded-lg
          `}
          onClick={toggleThemeHandler}
        >
          <div className="flex items-center">
            <Settings
              className="text-white dark:text-gray-400 mr-3"
              size={20}
            />
            <span className="text-sm text-white dark:text-gray-300">
              Settings
            </span>
          </div>
          {theme === "light" ? (
            <Sun className="text-yellow-500" size={20} />
          ) : (
            <Moon className="text-indigo-500" size={20} />
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`
            w-full 
            flex 
            px-4
            py-2 
            hover:text-red-600
            text-white
            dark:text-gray-300
            rounded-lg 
            dark:hover:text-red-600
            transition-colors
            items-center 
            space-x-2
          `}
        >
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
