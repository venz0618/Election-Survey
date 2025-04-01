// import { Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import AdminLayout from "./layouts/AdminLayout";
// import Dashboard from "./pages/Dashboard";
// import Region from "./pages/Region";
// import Province from "./pages/Province";
// import City from "./pages/City";
// import Barangay from "./pages/Barangay";
// import ClusteredPrecinct from "./pages/ClusteredPrecinct";
// import PrecinctNumber from "./pages/PrecinctNumber";
// import Voters from "./pages/Voters";
// import Position from "./pages/Position";
// import Candidates from "./pages/Candidates";
// import Login from "./pages/Login";
// import ProtectedRoute from "./components/ProtectedRoute";
// import UserLayout from "./layouts/UserLayout";
// import UserDashboard from "./user/pages/UserDashboard";

// const AppRoutes = () => {
//     return (
//         <>
//         <Routes>
//         <Route 
//                 path="/"
//                 element={
//                     <UserLayout/>
//                 }
//                 >
//                     <Route path="/dashboard" element={<UserDashboard />} />
                   
                    
//                 </Route>
//         </Routes>
//         <AuthProvider> {/* ✅ Wrap everything inside AuthProvider */}
//             <Routes>
//                 <Route path="/login" element={<Login />} />
               
//                 <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
//                      <Route index element={<Dashboard />} />
//                      <Route path="regions" element={<Region />} />
//                      <Route path="provinces" element={<Province />} />
//                      <Route path="city" element={<City />} />
//                      <Route path="barangay" element={<Barangay />} />
//                      <Route path="clustered-precinct" element={<ClusteredPrecinct />} />
//                      <Route path="precinct" element={<PrecinctNumber />} />
//                      <Route path="voters" element={<Voters />} />
//                      <Route path="position" element={<Position />} />
//                      <Route path="candidates" element={<Candidates />} />
//                  </Route>
//             </Routes>
//         </AuthProvider>
//         </>
//     );
// };



// export default AppRoutes;

// import { Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";

// // Admin Pages (Protected)
// import AdminLayout from "./layouts/AdminLayout";
// import Dashboard from "./pages/Dashboard";
// import Region from "./pages/Region";
// import Province from "./pages/Province";
// import City from "./pages/City";
// import Barangay from "./pages/Barangay";
// import ClusteredPrecinct from "./pages/ClusteredPrecinct";
// import PrecinctNumber from "./pages/PrecinctNumber";
// import Voters from "./pages/Voters";
// import Position from "./pages/Position";
// import Candidates from "./pages/Candidates";
// import Login from "./pages/Login";

// // Public Pages (No Authentication)
// import UserDashboard from "./user/pages/UserDashboard";
// import UserLayout from "./layouts/UserLayout";
// // import Survey from "./user/pages/Survey";
// // import Results from "./user/pages/Results";

// const AppRoutes = () => {
//     return (
//         <>
//             {/* Public Routes (No AuthProvider) */}
//             <Routes>
                
//                 <Route 
//                 path="/"
//                 element={
//                     <UserLayout/>
//                 }
//                 >
//                     <Route path="/" element={<UserDashboard />} />
//                     <Route path="/login" element={<Login />} />
                    
//                 </Route>
//             </Routes>

//             {/* Protected Routes (Wrapped in AuthProvider) */}
//             <AuthProvider>
//                 <Routes>
                
//                     <Route
//                         path="/admin"
//                         element={
//                             <ProtectedRoute>
//                                 <AdminLayout />
//                             </ProtectedRoute>
//                         }
//                     >
//                         <Route path="/admin" index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//                         <Route path="regions" element={<ProtectedRoute><Region /></ProtectedRoute>} />
//                         <Route path="provinces" element={<ProtectedRoute><Province /></ProtectedRoute>} />
//                         <Route path="city" element={<ProtectedRoute><City /></ProtectedRoute>} />
//                         <Route path="barangay" element={<ProtectedRoute><Barangay /></ProtectedRoute>} />
//                         <Route path="clustered-precinct" element={<ProtectedRoute><ClusteredPrecinct /></ProtectedRoute>} />
//                         <Route path="precinct" element={<ProtectedRoute><PrecinctNumber /></ProtectedRoute>} />
//                         <Route path="voters" element={<ProtectedRoute><Voters /></ProtectedRoute>} />
//                         <Route path="position" element={<ProtectedRoute><Position /></ProtectedRoute>} />
//                         <Route path="candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
//                     </Route>
//                 </Routes>
//             </AuthProvider>
//         </>
//     );
// };

// export default AppRoutes;

import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Region from "./pages/Region";
import Province from "./pages/Province";
import City from "./pages/City";
import Barangay from "./pages/Barangay";
import ClusteredPrecinct from "./pages/ClusteredPrecinct";
import PrecinctNumber from "./pages/PrecinctNumber";
import Voters from "./pages/Voters";
import Position from "./pages/Position";
import Candidates from "./pages/Candidates";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import UserLayout from "./layouts/UserLayout";
import UserDashboard from "./user/pages/UserDashboard";
import PublicRoute from "./components/PublicRoute";
import Survey from "./user/pages/Survey";



const AppRoutes = () => {
    return (
        <AuthProvider>
            <Routes>
                {/* ✅ Public User Routes (No Login Required) */}
                <Route path="/user" element={<UserLayout />}>
                    <Route index element={<UserDashboard />} />
                    
                </Route>

                {/* ✅ Public Route (Login Page Redirects Logged-In Users) */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

                {/* ✅ Protected Admin Routes */}
                <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="regions" element={<Region />} />
                    <Route path="provinces" element={<Province />} />
                    <Route path="city" element={<City />} />
                    <Route path="barangay" element={<Barangay />} />
                    <Route path="clustered-precinct" element={<ClusteredPrecinct />} />
                    <Route path="precinct" element={<PrecinctNumber />} />
                    <Route path="voters" element={<Voters />} />
                    <Route path="position" element={<Position />} />
                    <Route path="candidates" element={<Candidates />} />
                </Route>

                {/* ✅ Catch-All Route (Redirect Unknown Routes to Home) */}
                <Route path="*" element={<Navigate to="/user" replace />} />
                <Route path="/survey" element={<Survey />} />
            </Routes>
        </AuthProvider>
    );
};

export default AppRoutes;

