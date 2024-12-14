import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Lock, EyeOff, Eye } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordSchema } from "../validationSchemas";
import { errorToast, successToast } from "./toast";
import { useChangePasswordMutation } from "../redux/slices/userApiSlices";
import { RotatingLines } from "react-loader-spinner";

const ChangePassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [changePassword] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(passwordSchema),
    mode: "onChange",
  });

  const togglePasswordVisibility = (field) => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await changePassword(data).unwrap();
      reset();
      successToast("Password changed successfully.");
    } catch (error) {
      console.error("Error changing password:", error);
      errorToast(error?.message || error?.data?.error || "Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold dark:text-white text-gray-800">
              Change Password
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block mb-2 dark:text-white">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible.currentPassword ? "text" : "password"}
                  {...register("currentPassword")}
                  className="w-full p-2 pr-10 border dark:bg-gray-700 dark:border-gray-600 rounded-md"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {isPasswordVisible.currentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block mb-2 dark:text-white">New Password</label>
              <div className="relative">
                <input
                  type={isPasswordVisible.newPassword ? "text" : "password"}
                  {...register("newPassword")}
                  className="w-full p-2 pr-10 border dark:bg-gray-700 dark:border-gray-600 rounded-md"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {isPasswordVisible.newPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters with uppercase,
                lowercase, number, and special character
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block mb-2 dark:text-white">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={
                    isPasswordVisible.confirmNewPassword ? "text" : "password"
                  }
                  {...register("confirmNewPassword")}
                  className="w-full p-2 pr-10 border dark:bg-gray-700 dark:border-gray-600 rounded-md"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmNewPassword")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {isPasswordVisible.confirmNewPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={!isValid}
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
