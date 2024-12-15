import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { errorToast, successToast } from "./toast";
import Form from "./Form";
import {  useForgotPasswordMutation } from "../redux/slices/userApiSlices.js";
import { passwordSchemaWithoutCurr, passwordValidation } from "../validationSchemas";

const EnterNewPassword = () => {
  const [changePassword] = useForgotPasswordMutation(); 
  const navigate = useNavigate();

  const handlePasswordSubmit = async ( {newPassword:password} ) => {
    try {
      await changePassword( {password} ).unwrap();
      successToast("Password changed successfully");
      navigate("/user/login");
    } catch (error) {
      console.error("Error changing password:", error);
      errorToast(error?.message || error?.data?.message || "Error occurred");
    }
  };

  const passwordFields = [
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      placeholder: "Enter your new password",
      required: true,
    },
    {
      name: "confirmNewPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your new password",
      required: true,
    },
  ];

  return (
    <>
      <div className="h-[70vh] flex items-center">
        <Form
          title="Enter New Password"
          fields={passwordFields}
          onSubmit={handlePasswordSubmit}
          buttonText="Submit"
          validationRules={passwordSchemaWithoutCurr}
        />
      </div>
    </>
  );
};

export default EnterNewPassword;
