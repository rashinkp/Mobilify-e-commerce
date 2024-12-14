import React, { useRef, useState } from "react";
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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUserQuery,
  useLogoutMutation,
  useUploadUserProfileMutation,
} from "../../redux/slices/userApiSlices";
import { userLogout } from "../../redux/slices/authUser";
import { googleLogout } from "@react-oauth/google";
import { successToast } from "../../components/toast";
import { useNavigate } from "react-router";
import MyProfile from "../../components/MyProfile";
import MyAddress from "../../components/user/MyAddress";
import { RotatingLines } from "react-loader-spinner";
import noImage from "../../assets/noImage.png";
import MyEmail from "../../components/user/MyEmail";

import { uploadImageToCloudinary } from "../../uploads/cloudinaryConfig";
import ChangePassword from "../../components/ChangePassword";

const UserProfileDashboard = () => {
  const { data, isLoading, isError, error,refetch } = useGetUserQuery();
  const { user } = data || {};
  const imageRef = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadImgUrl] = useUploadUserProfileMutation()

  const [activeSection, setActiveSection] = useState("profile");

  const handleImageChange = (e) => {
    imageRef.current.click();
  };


  //handling image uploading and sending url
  const handleProfileImageChange = async(e) => {
    setIsUploading(true)
    const file = e.target.files[0];
   try {
     if (file) {
       const data = await uploadImageToCloudinary(file);
       await uploadImgUrl(data);
       setIsUploading(false);
       successToast('Image updated successfully');
       refetch()
     }
   } catch (error) {
     console.error("Update error:", error);
    setIsUploading(false);
   }

    
  };

  const MenuSection = ({ icon: Icon, title, section }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`flex items-center w-full p-3 rounded-lg transition-colors ${
        activeSection === section
          ? "bg-blue-100 text-blue-600"
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
    <div className="min-h-screen bg-gray-100 dark:bg-darkBackground  p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
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

            <MenuSection icon={Heart} title="Wishlist" section="wishlist" />
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
  );
};

export default UserProfileDashboard;
