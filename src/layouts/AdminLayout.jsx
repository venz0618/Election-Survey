import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AdminLayout = () => {
    return (
      <div className="flex h-screen">
      <Sidebar /> {/* Sidebar should stay fixed */}
      <div className="flex flex-col flex-grow">
          <Topbar />
          <main className="flex-grow p-6 bg-gray-100">
              <Outlet /> {/* This renders Dashboard and other pages */}
          </main>
      </div>
  </div>
  
    );
};

export default AdminLayout;
