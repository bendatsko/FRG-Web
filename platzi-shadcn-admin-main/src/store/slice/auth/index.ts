import { createSlice } from "@reduxjs/toolkit";
import { setCookie, removeCookie } from "typescript-cookie";

export interface UserType {
  email: string;
  username: string;
  role: string;
}

export interface InitialStateType {
  token: string;
  user: UserType | null;
}

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      return null;
    }
  }
  return null;
};

const initialState: InitialStateType = {
  token: localStorage.getItem('token') || "",
  user: getUserFromLocalStorage(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveUserInfo: (state: InitialStateType, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      setCookie("token", token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log("User info saved in Redux:", state);
    },
    removeUserInfo: (state: InitialStateType) => {
      state.token = "";
      state.user = null;
      removeCookie("token");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log("User info removed from Redux:", state);
    },
  },
});

export const token = (state: InitialStateType) => state.token;
export const { saveUserInfo, removeUserInfo } = authSlice.actions;
export default authSlice.reducer;
