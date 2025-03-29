import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext"; // Ensure correct import
import './index.css';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <BrowserRouter> {/* ✅ Router should be ONLY here */}
      <AuthProvider>
          <AppRoutes />
      </AuthProvider>
  </BrowserRouter>
</React.StrictMode>
);
