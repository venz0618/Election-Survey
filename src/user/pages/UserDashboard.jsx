import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const UserDashboard = () => {
    const [stats, setStats] = useState({
        total_voters: 0,
        total_candidates: 0,
        total_precincts: 0,
        total_barangay: 0,
        total_voted: 0
    });

    useEffect(() => {
        axiosInstance.get("/dashboard-stats")
            .then(response => setStats(response.data))
            .catch(error => console.error("Error fetching dashboard stats:", error));
    }, []);

    return (
        <div className="container text-white p-4 bg-gray-600 rounded">
            <h1 className="text-3xl font-bold">Election Survey System</h1>
            <p className="text-gray-300">
                Track voter preferences and electoral trends across different regions.
            </p>

            <div className="flex space-x-4 mt-4">
                <Link to="/user/survey" className="bg-purple-600 px-4 py-2 text-white rounded">
                    📝 Take Survey
                </Link>
                <Link to="/user/result" className="bg-gray-400 px-4 py-2 text-white rounded">
                    📊 View Results
                </Link>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-purple-500 p-4 rounded text-center">
                    <h3 className="text-xl">{stats.total_voters}</h3>
                    <p>Total Voters</p>
                </div>
                <div className="bg-green-500 p-4 rounded text-center">
                    <h3 className="text-xl">{stats.total_voters > 0 && stats.total_voted > 0 ? 
  ((stats.total_voted / stats.total_voters) * 100).toFixed(2) 
  : 0}%
</h3>
                    <p>Survey Completion</p>
                </div>
                <div className="bg-blue-500 p-4 rounded text-center">
                    <h3 className="text-xl">{stats.total_precincts}</h3>
                    <p>Precincts Number</p>
                </div>
                <div className="bg-yellow-500 p-4 rounded text-center">
                    <h3 className="text-xl">{stats.total_candidates}</h3>
                    <p>Regions</p>
                </div>
            </div>
        </div>
        
        
        
    );
};

export default UserDashboard;


  
