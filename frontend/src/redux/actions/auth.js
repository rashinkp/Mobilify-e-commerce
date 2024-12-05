// src/features/data/fetchData.js
import axios from "axios";
import { adminLoginFailure, adminLoginStart, adminLoginSuccess } from "../slices/auth";

export const adminLogin = (url, data, dispatch) => {
  console.log(url, data, dispatch)
  dispatch(adminLoginStart());
  axios
    .post(url,data)
    .then((response) => {
      dispatch(adminLoginSuccess(response.data));
    })
    .catch((error) => {
      dispatch(adminLoginFailure( error?.response?.data?.message || error?.message || "An error occurred"));
    });
};
