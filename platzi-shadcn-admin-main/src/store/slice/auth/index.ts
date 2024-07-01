import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCookie, removeCookie } from "typescript-cookie";

export interface UserType {
  email: string;
  username: string;
  role: string;
  bio: string;
  uuid: string;
}

export interface InitialStateType {
  token: string;
  user: UserType | null;
  storedUserData: UserType | null;
}

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  if (user && user !== "undefined") {
    try {
      return JSON.parse(user);
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
  }
  return null;
};

const initialState: InitialStateType = {
  token: localStorage.getItem("token") || "",
  user: getUserFromLocalStorage(),
  storedUserData: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveUserInfo: (state: InitialStateType, action: PayloadAction<{ token: string; user: UserType }>) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.storedUserData = user;
      setCookie("token", token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("User info saved in Redux (inside reducer):", state);
      console.log("Stored user data (inside reducer):", user);
    },
    removeUserInfo: (state: InitialStateType) => {
      state.token = "";
      state.user = null;
      state.storedUserData = null;
      removeCookie("token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("User info removed from Redux (inside reducer):", state);
    },
  },
});

export const { saveUserInfo, removeUserInfo } = authSlice.actions;
export const token = (state: { auth: InitialStateType }) => state.auth.token;
export const storedUserData = (state: { auth: InitialStateType }) => state.auth.storedUserData;
export default authSlice.reducer;
