import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        login: (state, action) => {
            state.user = action.payload; 
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("token");
        },
    },
});

export const { login, logout ,setUser} = authSlice.actions;
export default authSlice.reducer;
