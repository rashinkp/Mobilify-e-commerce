import React, { useEffect } from "react";
import { Route, Router, Routes } from "react-router";
import Navbar from "./components/Navbar.jsx";
import { useSelector } from "react-redux";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const App = () => {
  const theme = useSelector((state) => state.theme.theme);
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  });
  return (
      <Routes>
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
  );
};

export default App;
