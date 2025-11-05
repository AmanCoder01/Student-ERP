import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SecureRoute = ({ children, allowedRoles }) => {
    const { user } = useSelector(state => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default SecureRoute;
