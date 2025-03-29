import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;  // ✅ Prevent redirect loop

    return user ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
