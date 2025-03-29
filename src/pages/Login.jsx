import { useState, useEffect } from "react";  // ✅ Add useEffect here
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, login } = useAuth(); // Get user and login function
    const navigate = useNavigate();

    // ✅ Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/admin"); // Redirect to dashboard
        }
    }, [user, navigate]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password); 
            navigate("/admin"); // Redirect after login
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 mt-4 rounded transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
