import React, { useEffect } from "react";
import { Route, Routes } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { setCartCount } from "./redux/slices/cartCount";
import { useGetCartCountQuery } from "./redux/slices/cartApiSlice";

const App = () => {
  const theme = useSelector((state) => state.theme.theme);

  const { data = {}, isLoading, isError, refetch,error } = useGetCartCountQuery()
  

  const dispatch = useDispatch();
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  });


  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isError) {
      console.error(error);
      return;
    }

    if (data && data.totalQuantity !== undefined) {
      dispatch(setCartCount(data.totalQuantity));
    }
  }, [data, isLoading, isError, dispatch]);


  return (
    <Routes>
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default App;
