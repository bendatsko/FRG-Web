import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getCookie, removeCookie, setCookie} from "typescript-cookie";

// Define the user interface
export interface User {
    id: number; // Assuming ID is a number, adjust if it's a string
    email: string;
    username: string;
    role: string;
    bio: string;
    uuid: string;
}


// Define the initial state interface
export interface InitialState {
    token: string;
    user: string; // Store user as a JSON string
}

// Initialize the initial state
const initialState: InitialState = {
    token: "",
    user: "", // Initialize user as an empty string
};

// Create the auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        saveUserInfo: (state, action: PayloadAction<{
            token: string;
            user?: User
        }>) => {
            const {token, user} = action.payload;
            if (user) {
                console.log("Reducer: Dispatching saveUserInfo action with:", action.payload);
                state.token = token;
                state.user = JSON.stringify(user); // Serialize user to JSON string
                setCookie("token", token); // Save token in cookies
                setCookie("user", state.user); // Save user as a JSON string in cookies
                console.log("Reducer: User information saved:", user);
            } else {
                console.log("Reducer: No user data provided.");
            }
        },
        removeUserInfo: (state) => {
            state.token = "";
            state.user = "";
            removeCookie("token"); // Remove token from cookies
            removeCookie("user"); // Remove user from cookies
        },
    },
});


// Export actions
export const {saveUserInfo, removeUserInfo} = authSlice.actions;

// Selectors to get the token and user data
export const token = (state: {
    auth: InitialState
}) => state.auth.token;
export const selectUser = (state: { auth: InitialState }) => {
    try {
        const userJson = getCookie("user") || state.auth.user; // Access user as a JSON string from cookies or state
        return JSON.parse(userJson || "{}"); // Deserialize user from JSON string
    } catch (e) {
        console.error("Failed to parse user data:", e);
        return {}; // Return an empty object if parsing fails
    }
};


// Export the reducer
export default authSlice.reducer;
