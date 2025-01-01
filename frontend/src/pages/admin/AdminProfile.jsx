import React from "react";
import { useGetAdminDataQuery } from "../../redux/slices/adminApiSlices";
import { RotatingLines } from "react-loader-spinner";
import { Link } from "react-router";
import { ChevronRight, Home } from "lucide-react";
import NoImage from "../../assets/noImage.png";

const AdminProfile = () => {
  const { data = {}, isLoading, isError, refetch } = useGetAdminDataQuery();

  console.log(data);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
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
    );
  }
  return (
    <div className="p-4">
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <Link to="/admin" className="flex items-center hover:text-blue-600">
          <Home size={16} className="mr-2" />
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700">Admin Profile</span>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage and view admin profile
        </p>
      </div>

      {/* conente section */}
      <div className="">
        {/* Profile Image */}
        <div className="relative mb-4">
          <img
            src={NoImage}
            alt="Admin profile"
            className="w-32 h-32 rounded-full object-fit border-4 border-gray-200"
          />
        </div>

        {/* Admin Info */}
        <div className="">
          <p className="text-gray-600 mt-1">
            <strong>Name:</strong> {data?.name}
          </p>
          <p className="text-gray-600 mt-1">
            <strong>Email:</strong> {data?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
