import axiosInstance from "./axiosInstancle"
import {registerStart , registerFailure , registerSuccess} from '../redux/slices/UserAuthSlice.js'


export const registerUser = (data) => async (dispatch) => {
  dispatch(registerStart())
  try {
    const response = await axiosInstance.post('/user/register', data);
    dispatch(registerSuccess(response.data))
    return response.data;
  } catch (error) {
    dispatch(
      registerFailure(
        error?.response?.data?.message ||
          error?.message ||
          "Registration Failed"
      )
    );   
  }
}