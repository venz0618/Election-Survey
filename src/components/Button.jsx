import { useNavigate } from "react-router-dom";

const Button = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/dashboard");
    };

    return <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={handleLogout}>Logout</button>;
};

export default Button;
