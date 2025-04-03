// import { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(true); // ✅ Add loading state

//     useEffect(() => {
//         // Check if a user is already logged in (on page refresh)
//         const storedUser = localStorage.getItem("user");
//         const storedToken = localStorage.getItem("token");

//         if (storedUser && storedToken) {
//             setUser(JSON.parse(storedUser));
//         }
//         setLoading(false); // ✅ Set loading to false after checking auth

//     }, []);

//     const login = async (email, password) => {
//         try {
//             const response = await fetch("http://127.0.0.1:8000/api/login", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, password }),
//             });

//             if (!response.ok) {
//                 throw new Error("Login failed");
//             }

//             const data = await response.json();

//             // Store user data & token
//             localStorage.setItem("token", data.token);
//             localStorage.setItem("user", JSON.stringify(data.user));

//             setUser(data.user);
            
//             // Redirect to dashboard
//             navigate("/");
//         } catch (error) {
//             console.error("Login error:", error);
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setUser(null);
//         navigate("/login");
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout, loading }}>
//             {!loading && children} {/* ✅ Prevent rendering until loading is done */}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);



import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); 
    }, []);                     //http://127.0.0.1:8000

    const login = async (email, password) => {
        try {
            const response = await fetch("https://6ca5-143-44-192-49.ngrok-free.app/api/login", {    
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid email or password");
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);

            navigate("/");  // ✅ Directly send user to admin dashboard
        } catch (error) {
            console.error("Login error:", error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/user");  // ✅ Navigate immediately after logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading ? children : <div>Loading...</div>} 
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
