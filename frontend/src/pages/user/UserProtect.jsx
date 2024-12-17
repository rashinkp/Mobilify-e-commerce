import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectUser = () => {
  const { userInfo } = useSelector((state) => state.userAuth);

  return userInfo ? <Outlet /> : <Navigate to="/user/login" replace />;
};

export default ProtectUser;
