

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./Loader";

const SecureRoute = ({ children, allowedRoles }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useSelector(state => state.auth);
    const token = localStorage.getItem("token");

    useEffect(() => {
        // If we have either user data or no token, we can stop loading
        if (user || !token) {
            setIsLoading(false);
        }
    }, [user, token]);

    if (isLoading) {
        return <div className='h-screen flex items-center justify-center'>
            <Loader />
        </div> // Or your loading component
    }

    if (!user && token) {
        return null; // Wait for user data to load
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default SecureRoute;
