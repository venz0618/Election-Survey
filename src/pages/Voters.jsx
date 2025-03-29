import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const Voters = () => {
    const [voters, setVoters] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [clusteredPrecincts, setClusteredPrecincts] = useState([]);
    const [precincts, setPrecincts] = useState([]);
    
    

    const [voterId, setVoterId] = useState(null);
    const [cityId, setCityId] = useState("");
    const [barangayId, setBarangayId] = useState("");
    const [precinctNumId, setPrecinctNumId] = useState("");
    const [clusteredPrecinctId, setClusteredPrecinctId] = useState("");
    const [voterName, setVoterName] = useState("");
    const [voterStatus, setVoterStatus] = useState(0);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchVoters();
        fetchCities();
        fetchPrecincts();
        fetchBarangays();
        fetchClusteredPrecincts();
        fetchAllPrecincts();
    }, []);

    

    const fetchVoters = async () => {
        try {
            const response = await axiosInstance.get("/voters");
            setVoters(response.data);
            fetchPrecincts(); // Fetch precincts along with voters
        } catch (error) {
            console.error("Error fetching voters:", error);
        }
    };
    
    
    

    const fetchCities = async () => {
        try {
            const response = await axiosInstance.get("/cities");
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const fetchBarangays = async (cityId) => {
        if (!cityId) {
            setBarangays([]); // Clear barangays if no city selected
            return;
        }
    
        try {
            const response = await axiosInstance.get(`/barangays?city_id=${cityId}`);
            setBarangays(response.data);
        } catch (error) {
            console.error("Error fetching barangays:", error);
        }
    };

    // const fetchClusteredPrecincts = async (barangayId) => {
    //     try {
    //         const response = await axiosInstance.get(`/clustered-precincts/${barangayId}`);
    //         console.log("API Response:", response.data); // Debugging line
    
    //         // Check if the response contains an array
    //         if (Array.isArray(response.data)) {
    //             setClusteredPrecincts(response.data);
    //         } else if (response.data.data && Array.isArray(response.data.data)) {
    //             setClusteredPrecincts(response.data.data); // Adjust if API wraps data inside an object
    //         } else {
    //             console.error("Unexpected clustered precincts format:", response.data);
    //             setClusteredPrecincts([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching clustered precincts:", error);
    //         setClusteredPrecincts([]);
    //     }
    // };
    
    const fetchClusteredPrecincts = async (barangayId) => {
        if (!barangayId) {
            setClusteredPrecincts([]);
        }

        try{
            const response = await axiosInstance.get(`/clustered-precincts/${barangayId}`);
            setClusteredPrecincts(response.data);
        } catch(error){
            console.error("Error fetching clustered precinct:", error);
        }
    };
    
    
    

    // const fetchPrecincts = async (clusteredPrecinctId) => {
    //     if (!clusteredPrecinctId) {
    //         setPrecincts([]); // Clear precincts if no clustered precinct is selected
    //         return;
    //     }
    
    //     try {
    //         const response = await axiosInstance.get(`/precincts/${clusteredPrecinctId}`);
    
    //         if (Array.isArray(response.data)) {
    //             setPrecincts(response.data); // ✅ Store retrieved precincts
    //         } else {
    //             console.error("Invalid precinct data received:", response.data);
    //             setPrecincts([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching precincts:", error.response?.data || error.message);
    //         setPrecincts([]);
    //     }
    // };
    const fetchPrecincts = async (clustered_precinct_id) => {
        if (!clustered_precinct_id) {
            console.warn("No clustered_precinct_id provided, skipping request.");
            return; // Exit function early to avoid 404 error
        }
    
        try {
            console.log("Fetching precincts for clustered_precinct_id:", clustered_precinct_id);
            const response = await axiosInstance.get(`/precincts/${clustered_precinct_id}`);
    
            if (Array.isArray(response.data)) {
                setPrecincts(response.data);
            } else {
                console.error("Invalid precinct data received:", response.data);
                setPrecincts([]);
            }
        } catch (error) {
            console.error("Error fetching precincts:", error);
            setPrecincts([]);
        }
    };
    
    

    const fetchAllPrecincts = async () => {
        try {
            const response = await axiosInstance.get(`/precincts`);
            setPrecincts(response.data);  // Store all precincts
        } catch (error) {
            console.error("Error fetching precincts:", error);
            setPrecincts([]);
        }
    };
    

    
    
    
    

    const openModal = (voter = null) => {
        if (voter) {
            setVoterId(voter.id);
            setVoterName(voter.voter_name);
            setPrecinctNumId(voter.precinct_num_id);
            setVoterStatus(voter.voter_status);
        } else {
            setVoterId(null);
            setVoterName("");
            setPrecinctNumId("");
            setVoterStatus(0);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setVoterId(null);
        setVoterName("");
        setCityId("");
        setBarangayId("");
        setPrecinctNumId("");
        setVoterStatus(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (voterId) {
                // Update voter
                await axiosInstance.put(`/voters/${voterId}`, {
                    voter_name: voterName,
                    precinct_num_id: precinctNumId,
                    voter_status: voterStatus,
                });
            } else {
                // Create new voter
                await axiosInstance.post("/voters", {
                    voter_name: voterName,
                    precinct_num_id: precinctNumId,
                    voter_status: voterStatus,
                });
            }
            fetchVoters();
            closeModal();
        } catch (error) {
            console.error("Error saving voter:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this voter?")) {
            try {
                await axiosInstance.delete(`/voters/${id}`);
                fetchVoters();
            } catch (error) {
                console.error("Error deleting voter:", error);
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Voters Management</h1>

            <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add Voter
            </button>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Voter Name</th>
                        <th className="border border-gray-300 p-2">Precinct</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {voters.map((voter) => (
                        <tr key={voter.id}>
                            <td className="border border-gray-300 p-2">{voter.voter_name}</td>
                            <td className="border border-gray-300 p-2">
                                {precincts.find(p => p.id === voter.precinct_num_id)?.precinct_num || "Unknown"}
                            </td>



                            <td className="border border-gray-300 p-2">
                                {voter.voter_status === 1 ? "Active" : "Inactive"}
                            </td>
                            <td className="border border-gray-300 p-2">
                                <button onClick={() => openModal(voter)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(voter.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">{voterId ? "Edit Voter" : "Add New Voter"}</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Voter Name */}
                            <label className="block mb-2">Voter Name:</label>
                            <input
                                type="text"
                                className="border p-2 w-full mb-3"
                                value={voterName}
                                onChange={(e) => setVoterName(e.target.value)}
                                required
                            />

                            {/* City Dropdown */}
                            <label className="block mb-2">City:</label>
                            <select
                                className="border p-2 w-full mb-3"
                                value={cityId}
                                onChange={(e) => {
                                    setCityId(e.target.value);
                                    setBarangayId("");
                                    setClusteredPrecinctId("");
                                    setPrecinctNumId("");
                                    fetchBarangays(e.target.value);
                                }}
                                required
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>{city.city_name}</option>
                                ))}
                            </select>

                            {/* Barangay Dropdown */}
                            <label className="block mb-2">Barangay:</label>
                            <select
                                className="border p-2 w-full mb-3"
                                value={barangayId}
                                onChange={(e) => {
                                    setBarangayId(e.target.value);
                                    setClusteredPrecinctId("");
                                    setPrecinctNumId("");
                                    fetchClusteredPrecincts(e.target.value); // Fetch data instead of setting directly
                                }}                                
                                required
                                disabled={!cityId} // Disable if no city selected
                            >
                                <option value="">Select Barangay</option>
                                {barangays
                                .filter(b => b.city_id === Number(cityId)) // Show only barangays for selected city
                                .map((b) => (
                                    <option key={b.id} value={b.id}>{b.barangay_name}</option>
                                ))}

                            </select>
                            {/* Clustered Precinct Dropdown */}
                                <label className="block mb-2">Clustered Precinct:</label>
                                <select
                                    className="border p-2 w-full mb-3"
                                    value={clusteredPrecinctId}
                                    onChange={(e) => {
                                        setClusteredPrecinctId(e.target.value);
                                        setPrecinctNumId(""); // Reset precinct selection
                                        fetchPrecincts(e.target.value); // Fetch precincts based on clustered precinct
                                    }}
                                    required
                                    disabled={!barangayId} // Disable if no barangay is selected
                                >
                                    <option value="">Select Clustered Precinct</option>
                                    {clusteredPrecincts.map((cp) => (
                                        <option key={cp.id} value={cp.id}>
                                            {cp.clustered_precinct_num}
                                        </option>
                                    ))}
                                </select>



                            {/* Precinct Number Dropdown */}
                            <label className="block mb-2">Precinct Number:</label>
                            <select
                                className="border p-2 w-full mb-3"
                                value={precinctNumId}
                                onChange={(e) => setPrecinctNumId(e.target.value)}
                                required
                                disabled={!clusteredPrecinctId} // Disable if no barangay selected
                            >
                                <option value="">Select Precinct</option>
                                {precincts
                                    .filter(p => p.clustered_precinct_id === Number(clusteredPrecinctId)) // Show only precincts for selected barangay
                                    .map((p) => (
                                        <option key={p.id} value={p.id}>{p.precinct_num}</option>
                                    ))}
                            </select>


                            {/* Voter Status */}
                            <label className="block mb-2">Voter Status:</label>
                            <select
                                className="border p-2 w-full mb-3"
                                value={voterStatus}
                                onChange={(e) => setVoterStatus(Number(e.target.value))}
                                required
                            >
                                <option value="0">Inactive</option>
                                <option value="1">Active</option>
                            </select>

                            {/* Buttons: Cancel & Submit */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {voterId ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>


                    </div>
                </div>
            )}
        </div>
    );
};

export default Voters;
