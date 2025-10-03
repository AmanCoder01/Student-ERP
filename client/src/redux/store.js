import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import studentReducer from "./slices/studentSlice";
import teacherReducer from "./slices/teacherSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
        student: studentReducer,
        teacher: teacherReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
});

export default store;