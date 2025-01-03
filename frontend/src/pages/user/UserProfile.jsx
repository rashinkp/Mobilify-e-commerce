import React, { useEffect, useRef, useState } from "react";
import {
  User,
  ShoppingBag,
  Wallet,
  Heart,
  Lock,
  LogOut,
  Camera,
  MapPinHouse,
  Mail,
  ChevronRight,
  Box,
  Home,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUserQuery,
  useLogoutMutation,
  useUploadUserProfileMutation,
} from "../../redux/slices/userApiSlices";
import { userLogout } from "../../redux/slices/authUser";
import { googleLogout } from "@react-oauth/google";
import { errorToast, successToast } from "../../components/toast";
import { Link, useNavigate } from "react-router";
import MyProfile from "../../components/MyProfile";
import MyAddress from "../../components/user/MyAddress";
import { RotatingLines } from "react-loader-spinner";
import noImage from "../../assets/noImage.png";
import MyEmail from "../../components/user/MyEmail";

import { uploadImageToCloudinary } from "../../uploads/cloudinaryConfig";
import ChangePassword from "../../components/ChangePassword";
import OrderListingPage from "../../components/MyOrders";
import WishList from "./WishList";
import WalletDashboard from "../../pages/user/Wallet.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BrudCrump from "../../components/BrudCrump.jsx";

const UserProfileDashboard = () => {
  const { data, isLoading, isError, error, refetch } = useGetUserQuery();
  const { user } = data || {};
  const imageRef = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadImgUrl] = useUploadUserProfileMutation();
  const [activeSection, setActiveSection] = useState("profile");

  const handleImageChange = () => {
    imageRef.current.click();
  };

  useEffect(() => {
    if (data) {
      refetch();
    }
  }, [data, refetch]);

  //handling image uploading and sending url
  const handleProfileImageChange = async (e) => {
    setIsUploading(true);
    const file = e.target.files[0];
    try {
      if (file) {
        const data = await uploadImageToCloudinary(file);
        await uploadImgUrl(data);
        setIsUploading(false);
        successToast("Image updated successfully");
        refetch();
      }
    } catch (error) {
      errorToast("Update error:", error);
      setIsUploading(false);
    }
  };

  const MenuSection = ({ icon: Icon, title, section }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`flex items-center w-full p-3 rounded-lg transition-colors ${
        activeSection === section
          ? "bg-indigo-100 text-indigo-600"
          : "hover:bg-gray-100 dark:hover:text-black text-gray-700 dark:text-white"
      }`}
    >
      <Icon className="mr-3" size={20} />
      <span className="text-sm font-medium">{title}</span>
    </button>
  );

  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logoutApiCall().unwrap();
      dispatch(userLogout());
      googleLogout();
      successToast("Logout Successful");
      navigate("/user/login");
    } catch (err) {
      console.log(err);
    }
  };



  if (isError) return <div>Error: {error.message}</div>;

  if (isLoading || isUploading) {
    return (
      <div>
        <div className="h-screen w-full absolute top-0 z-50 left-0 backdrop-blur-sm bg-black/30 flex justify-center items-center">
          <RotatingLines
            visible={true}
            height="50"
            width="50"
            color="grey"
            strokeColor="#fff"
            strokeWidth="2"
            animationDuration="8"
            ariaLabel="rotating-lines-loading"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-darkBackground">
        <div className="bg-gradient-to-r bg-indigo-500 shadow-md fixed w-full z-20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-white">
              <Link
                to="/user"
                className="text-white hover:text-white/80 transition-colors flex items-center"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
              <span className="font-medium">Profile</span>
            </div>
          </div>
        </div>
        <div className="max-w-6xl pt-20 mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Menu */}
          <div className="bg-gray dark:bg-black bg-white dark:text-white rounded-xl shadow-lg p-6 h-fit">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={user?.picture?.secure_url || noImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-50"
                />
                <button
                  onClick={handleImageChange}
                  className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 transition-colors"
                >
                  <Camera size={16} />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-500 text-sm dark:text-white">
                {user.email}
              </p>
            </div>

            <div className="space-y-2">
              <MenuSection icon={User} title="My Profile" section="profile" />
              <MenuSection icon={Mail} title="My Email" section="email" />
              <MenuSection
                icon={ShoppingBag}
                title="My Orders"
                section="orders"
              />
              <MenuSection icon={Wallet} title="My Wallet" section="wallet" />

              <MenuSection
                icon={MapPinHouse}
                title="My Address"
                section="address"
              />
              <MenuSection
                icon={Lock}
                title="Change Password"
                section="changePassword"
              />
              <button
                className="flex items-center w-full p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="mr-3" size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 bg-white dark:bg-black dark:text-white rounded-xl shadow-lg p-6">
            {activeSection === "profile" && <MyProfile />}
            {activeSection === "address" && <MyAddress />}
            {activeSection === "email" && <MyEmail />}
            {activeSection === "changePassword" && <ChangePassword />}
            {activeSection === "orders" && <OrderListingPage />}
            {activeSection === "wallet" && <WalletDashboard />}
          </div>
        </div>
        <input
          type="file"
          ref={imageRef}
          accept="image/*"
          onChange={handleProfileImageChange}
          hidden
        />
      </div>
    </>
  );
};

export default UserProfileDashboard;
