import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
    const [stats, setStats] = useState({
        totalVoters: 0,
        surveyCompletion: 0,
        positions: 0,
        regions: 0,
    });

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/dashboard-stats")
            .then(response => setStats(response.data))
            .catch(error => console.error("Error fetching dashboard stats:", error));
    }, []);

    return (
        <div className="container text-black p-4 bg-gray-600 rounded">
            <h1 className="text-3xl font-bold">Election Survey System</h1>
            <p className="text-gray-300">
                Track voter preferences and electoral trends across different regions.
            </p>

            <div className="flex space-x-4 mt-4">
                <Link to="/survey" className="bg-purple-600 px-4 py-2 text-white rounded">
                    📝 Take Survey
                </Link>
                <Link to="/results" className="bg-gray-400 px-4 py-2 text-white rounded">
                    📊 View Results
                </Link>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-purple-500 p-4 rounded text-center">
                    <h3 className="text-xl">{stats.totalVoters}</h3>
                    <p>Total Voters</p>
                </div>
                <div className="bg-green-500 p-4 rounded text-center">
                    <h3 className="text-xl">{stats.surveyCompletion}%</h3>
                    <p>Survey Completion</p>
                </div>
                <div className="bg-blue-500 p-4 rounded text-center">
                    <h3 className="text-xl">{stats.positions}</h3>
                    <p>Positions</p>
                </div>
                <div className="bg-yellow-500 p-4 rounded text-center">
                    <h3 className="text-xl">{stats.regions}</h3>
                    <p>Regions</p>
                </div>
            </div>
        </div>
        
        
        
    );
};

export default UserDashboard;


  
