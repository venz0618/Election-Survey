import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
    baseURL: "https://a800-143-44-192-49.ngrok-free.app/api",    //http://127.0.0.1:8000
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 Unauthorized errors (Token Expired)
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token"); // Clear token
            window.location.href = "/login"; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
