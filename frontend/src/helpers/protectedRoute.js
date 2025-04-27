import { Link, Navigate, useLocation } from "react-router-dom";
const ProtectedRoute = ({ children }) => {

    const location = useLocation();
    if (!localStorage.getItem("online_voting_access_token")) {
        const currentLocation = location;

        if (currentLocation.pathname != "/login") {
            return <Navigate to={`/login?redirect=${currentLocation.pathname.substring(1)}`} />;
        }

        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;
