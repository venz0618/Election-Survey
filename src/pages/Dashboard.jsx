import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = () => {
   const [stats, setStats] = useState({ total_voters: 0, total_candidates: 0, total_precincts: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get("/dashboard-stats", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-500 text-white p-4 rounded">
                    <h2 className="text-lg font-semibold">Total Voters</h2>
                    <p className="text-2xl">{stats.total_voters}</p>
                </div>
                <div className="bg-green-500 text-white p-4 rounded">
                    <h2 className="text-lg font-semibold">Total Candidates</h2>
                    <p className="text-2xl">{stats.total_candidates}</p>
                </div>
                <div className="bg-yellow-500 text-white p-4 rounded">
                    <h2 className="text-lg font-semibold">Total Precincts</h2>
                    <p className="text-2xl">{stats.total_precincts}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
