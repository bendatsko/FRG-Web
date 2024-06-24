// src/store/slice/auth/index.ts
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

const initialState: InitialStateType = {
  token: localStorage.getItem('token') || "",
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
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
