import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
