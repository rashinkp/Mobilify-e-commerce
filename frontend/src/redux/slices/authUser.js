import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')) : null
}


const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState, 
  reducers: {
    userLogin: (state, action) => {
      state.userInfo = action.payload;
      try {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    userLogout: (state) => {
      state.userInfo = null;
      try {
        localStorage.removeItem('userInfo');
      } catch (error) {
        console.log('error found while clearing local storage in user logout', error)
      }
    }
  }
})



export const { userLogin, userLogout } = userAuthSlice.actions;


export default userAuthSlice.reducer;