import { loginFailure, loginStart, loginSuccess } from "../redux/slices/authSlice";
import axiosInstance from "./axiosInstancle";

export const loginAdmin = (data) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axiosInstance.post('admin/login', data);
    dispatch(loginSuccess(response.data));
  } catch (error) {
    dispatch(
      loginFailure(
        error?.response?.data?.message || error.message || "An error occurred"
      )
    );
  }
}