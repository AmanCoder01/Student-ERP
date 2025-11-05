import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import studentReducer from "./slices/studentSlice";
import teacherReducer from "./slices/teacherSlice";
import themeReducer  from "./slices/themeSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
        student: studentReducer,
        teacher: teacherReducer,
        theme: themeReducer, 
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
});

export default store;