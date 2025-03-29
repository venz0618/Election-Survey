import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaUserTie, FaMapMarkedAlt, FaCity, FaBuilding, FaVoteYea, FaListOl, FaBox, FaHome } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useState } from "react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-blue-600 text-white h-screen transition-all ${isCollapsed ? "w-16" : "w-64"} duration-300`}>
      {/* Sidebar Header */}
      <div className="flex justify-between items-center p-4">
        {!isCollapsed && <h2 className="text-lg font-bold">ADMIN</h2>}
        <button className="text-white" onClick={() => setIsCollapsed(!isCollapsed)}>
          <IoIosArrowBack className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Sidebar Links */}
      <ul className="space-y-2">
        <SidebarItem to="/" label="Dashboard" icon={<FaTachometerAlt />} collapsed={isCollapsed} />
        <SidebarItem to="/candidates" label="Candidates" icon={<FaUsers />} collapsed={isCollapsed} />
        <SidebarItem to="/position" label="Position" icon={<FaUserTie />} collapsed={isCollapsed} />
        <SidebarItem to="/regions" label="Region" icon={<FaMapMarkedAlt />} collapsed={isCollapsed} />
        <SidebarItem to="/provinces" label="Province/District" icon={<FaCity />} collapsed={isCollapsed} />
        <SidebarItem to="/city" label="City/Municipality" icon={<FaBuilding />} collapsed={isCollapsed} />
        <SidebarItem to="/barangay" label="Barangay" icon={<FaListOl />} collapsed={isCollapsed} />
        <SidebarItem to="/clustered-precinct" label="Clustered Precinct" icon={<FaBox />} collapsed={isCollapsed} />
        <SidebarItem to="/votes" label="Votes" icon={<FaVoteYea />} collapsed={isCollapsed} />
        <SidebarItem to="/precinct" label="Precinct Number" icon={<FaListOl />} collapsed={isCollapsed} />
        <SidebarItem to="/voters" label="Voters" icon={<FaUsers />} collapsed={isCollapsed} />
        <SidebarItem to="/user" label="UserDashboard" icon={<FaHome />} collapsed={isCollapsed} />
      </ul>
    </div>
  );
};

const SidebarItem = ({ to, label, icon, collapsed }) => (
  <li>
    <Link to={to} className="flex items-center space-x-2 p-3 hover:bg-blue-500 transition">
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  </li>
);

export default Sidebar;
