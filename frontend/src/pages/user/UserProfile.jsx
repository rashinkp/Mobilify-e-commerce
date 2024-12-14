import React, { useState } from "react";
import {
  User,
  ShoppingBag,
  Wallet,
  ShoppingCart,
  Heart,
  Settings,
  Lock,
  LogOut,
  Camera,
  MapPinHouse,
  Mail,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery, useLogoutMutation } from "../../redux/slices/userApiSlices";
import { userLogout } from "../../redux/slices/authUser";
import { googleLogout } from "@react-oauth/google";
import { successToast } from "../../components/toast";
import { useNavigate } from "react-router";
import MyProfile from "../../components/MyProfile";
import MyAddress from "../../components/user/MyAddress";
import { RotatingLines } from "react-loader-spinner";
import noImage from '../../assets/noImage.png'
// import MyEmail from "../../components/user/MyEmail";

const UserProfileDashboard = () => {
  const { userInfo } = useSelector((state) => state.userAuth);
  const {data, isLoading ,isError, error} = useGetUserQuery(userInfo.id)
  const { user } = data || {}
  


  const [activeSection, setActiveSection] = useState("profile");

  const handleProfileImageChange = () => {
    alert("Image upload functionality to be implemented");
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


   if (isLoading ) {
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
                src={user.picture || noImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-50"
              />
              <button
                onClick={handleProfileImageChange}
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
              section="password"
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
          {/* {activeSection === "email" && <MyEmail />} */}
        </div>
      </div>
    </div>
  );
};

export default UserProfileDashboard;
