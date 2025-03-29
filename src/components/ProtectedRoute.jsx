// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//     const { user } = useAuth();

//     if (!user) {
//         return <Navigate to="/login" />;
//     }

//     return children;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = () => {
//     const { user, loading } = useAuth(); // ✅ Get user & loading state

//     if (loading) return <div>Loading...</div>; // ✅ Prevent rendering until auth is checked

//     return user ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;
