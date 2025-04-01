import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2"; // Import SweetAlert2


const Survey = () => {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [clusteredPrecincts, setClusteredPrecincts] = useState([]);
    const [precinctNumbers, setPrecinctNumbers] = useState([]);
    const [voters, setVoters] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");  // ✅ Add this line

    // select candidate and position
    const [positions, setPositions] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState("");

    const [regionId, setRegionId] = useState("");
    const [provinceId, setProvinceId] = useState("");
    const [cityId, setCityId] = useState("");
    const [barangayId, setBarangayId] = useState("");
    const [precinctNumId, setPrecinctNumId] = useState("");
    const [clusteredPrecinctId, setClusteredPrecinctId] = useState("");
    // const [voterName, setVoterName] = useState("");
    // const [voterStatus, setVoterStatus] = useState(0);

    const [positionId, setPositionId] = useState("");
    const [candidateId, setCandidateId] = useState("");
    const [selectedVoters, setSelectedVoters] = useState([]); // Track checked voters
    const [selectedVotes, setSelectedVotes] = useState([]);
    const [votedVoters, setVotedVoters] = useState([]);


    const candidateColorMap = {
        1: "#3498db", // Candidate 1 - Blue
        2: "#2ecc71", // Candidate 2 - Green
        3: "#e74c3c", // Candidate 3 - Red
        4: "#f1c40f", // Candidate 4 - Yellow
        5: "#9b59b6", // Candidate 5 - Purple
    };
    


 
    // useEffect(() => {
    //     fetchPositions(); // Load positions for candidate selection
    // }, []);

    useEffect(() => {
        // Fetch all positions
        axiosInstance.get("/positions").then((response) => {
            setPositions(response.data);
        });
    }, []);

    useEffect(() => {
        // Fetch candidates based on selected position
        if (selectedPosition) {
            axiosInstance
                .get(`/candidates-filter?position_id=${selectedPosition}`)
                .then((response) => {
                    setCandidates(response.data);
                });
        }
    }, [selectedPosition]); // Runs when selectedPosition changes

    useEffect(() => {
        axiosInstance.get("/voted-voters").then((response) => {
            setVotedVoters(response.data.votedVoters); // Assuming API returns a list of voted voter IDs
        });
    }, []);
    

    useEffect(() => {
        fetchRegions();
    }, []); // ✅ Only fetch once
    
    useEffect(() => {
        if (regionId) fetchProvince(regionId);
    }, [regionId]);
    
    useEffect(() => {
        if (provinceId) fetchCities(provinceId);
    }, [provinceId]);
    
    useEffect(() => {
        if (cityId) fetchBarangays(cityId);
    }, [cityId]);
    
    useEffect(() => {
        if (barangayId) fetchClusteredPrecincts(barangayId);
    }, [barangayId]);
    
    useEffect(() => {
        if (clusteredPrecinctId) fetchPrecincts(clusteredPrecinctId);
    }, [clusteredPrecinctId]);
    

    
    

    const fetchRegions = async () => {
        const cachedRegions = sessionStorage.getItem("regions");
    
        if (cachedRegions) {
            setRegions(JSON.parse(cachedRegions));
            return;
        }
    
        try {
            const response = await axiosInstance.get("/regions");
            setRegions(response.data);
            sessionStorage.setItem("regions", JSON.stringify(response.data)); // Save to cache
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    };
    
    

    const fetchProvince = async (regionId) => {
        if(!regionId) {
            setProvinces([]);
            return;
        }
        try {
            const response = await axiosInstance.get(`/provinces?region_id=${regionId}`);
            setProvinces(response.data);
        } catch (error){
            console.error("Error fetching provinces:", error);
        }
    };

    const fetchCities = async (provinceId) => {
        if(!provinceId){
            setCities([]);
            return;
        }
        try {
            const response = await axiosInstance.get(`cities?province_id=${provinceId}`);
            setCities(response.data);
        }catch (error){
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
    const fetchClusteredPrecincts = async (barangayId) => {
        if (!barangayId) {
            setClusteredPrecincts([]);
        }

        try{
            const response = await axiosInstance.get(`/clustered-precincts?barangay_id=${barangayId}`);
            setClusteredPrecincts(response.data);
        } catch(error){
            console.error("Error fetching clustered precinct:", error);
        }
    };

    const fetchPrecincts = async (clustered_precinct_id) => {
        if (!clustered_precinct_id) {
            console.warn("No clustered_precinct_id provided, skipping request.");
            return; // Exit function early to avoid 404 error
        }
    
        try {
            console.log("Fetching precincts for clustered_precinct_id:", clustered_precinct_id);
            const response = await axiosInstance.get(`/precincts?clustered_precinct_id=${clustered_precinct_id}`);
    
            if (Array.isArray(response.data)) {
                setPrecinctNumbers(response.data);
            } else {
                console.error("Invalid precinct data received:", response.data);
                setPrecinctNumbers([]);
            }
        } catch (error) {
            console.error("Error fetching precincts:", error);
            setPrecinctNumbers([]);
        }
    };

    // const fetchPositions = async () => {
    //     try {
    //         const response = await axiosInstance.get("/positions");
    //         setPositions(response.data);
    //     } catch (error) {
    //         console.error("Error fetching positions:", error);
    //     }
    // };

    // const fetchCandidates = async (positionId) => {
    //     try {
    //         const response = await axiosInstance.get(`/candidates?position_id=${positionId}`);
    //         setCandidates(response.data);
    //     } catch (error) {
    //         console.error("Error fetching candidates:", error);
    //     }
    // };
    
    
    const fetchVoters = async () => {
        const filters = {
            region_id: regionId || null,
            province_id: provinceId || null,
            city_id: cityId || null,
            barangay_id: barangayId || null,
            clustered_precinct_id: clusteredPrecinctId || null,
            precinct_num: precinctNumId || null, // Ensure 'precinct_num' matches Laravel API
        };
    
        console.log("Sending request with filters:", filters); // Debugging
    
        try {
            const response = await axiosInstance.get("/voters/filter", { params: filters });
            console.log("Response Data:", response.data); // Debugging
            setVoters(response.data);
        } catch (error) {
            console.error("Error fetching voters:", error.response?.data || error.message);
        }
    };


    //
    // const handleCandidateSelection = (voterId, candidateId) => {
    //     setSelectedVotes((prev) => {
    //         const updatedVotes = { ...prev };
    //         if (!updatedVotes[voterId]) {
    //             updatedVotes[voterId] = [];
    //         }

    //         if (updatedVotes[voterId].includes(candidateId)) {
    //             updatedVotes[voterId] = updatedVotes[voterId].filter((id) => id !== candidateId);
    //         } else {
    //             updatedVotes[voterId].push(candidateId);
    //         }

    //         return updatedVotes;
    //     });
    // };

    const handleCandidateSelection = (voterId, candidateId) => {
        setSelectedVotes((prev) => ({
            ...prev,
            [voterId]: prev[voterId] === candidateId ? null : candidateId, // Toggle selection
        }));
    };
    

    // const handleSubmitVotes = async () => {
    //     try {
    //         const payload = Object.keys(selectedVotes).map((voterId) => ({
    //             voter_id: voterId,
    //             candidate_id: selectedVotes[voterId][0], // Since only one candidate per voter
    //             num_votes: 1, // Each voter can vote once
    //         }));
    
    //         const response = await axiosInstance.post("/submit-votes", { votes: payload });
    
    //         if (response.status === 200) {
    //             alert("Votes submitted successfully!");
    //             setSelectedVotes({}); // Reset selections after submission
    //         }
    //     } catch (error) {
    //         console.error("Error submitting votes:", error);
    //         alert("Failed to submit votes. Please try again.");
    //     }
    // };
    

 
    const handleSubmitVotes = async () => {
        console.log("Submitting votes:", selectedVotes);
    
        if (Object.keys(selectedVotes).length === 0) {
            Swal.fire({
                icon: "warning",
                title: "No Votes Selected",
                text: "Please select a candidate before submitting.",
            });
            return;
        }
    
        const formattedVotes = Object.entries(selectedVotes).map(([voterId, candidateIds]) => ({
            voter_id: voterId,
            candidate_ids: Array.isArray(candidateIds) ? candidateIds : [candidateIds], // Ensure array
        }));
    
        console.log("Formatted Votes:", formattedVotes);
    
        try {
            const response = await axiosInstance.post("/submit-votes", { votes: formattedVotes });
    
            if (response.status === 200) {
                // alert("Votes submitted successfully!");
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Votes submitted successfully!",
                    confirmButtonColor: "#4CAF50", // Green button
                });
                setSelectedVotes({}); // Clear selected votes
            } else {
                Swal.fire({
                    icon: "error",
                    title: "An error occurred.",
                    text: "An error occurred while submitting votes. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error submitting votes:", error);
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: "An error occurred while submitting votes. Please try again.",
            });
        }
    };
    
    
    
    

  

    
     // ✅ Define columns for DataTable
    const columns = [
        {
            name: "Precinct Number",
            selector: (row) => precinctNumbers.find(p => p.id === row.precinct_num_id)?.precinct_num || "Unknown",
            sortable: true,
        },
        // {
        //     name: "Voter Name",
        //     selector: (row) => row.voter_name,
        //     cell: (row) => (
        //         <div
        //             className={`p-2 rounded ${
        //                 votedVoters.includes(row.id) ? "bg-green-200 text-green-800" : ""
        //             }`}
        //         >
        //             {row.voter_name}
        //         </div>
        //     ),
        // },
        
        {
            name: "Voter Name",
            selector: (row) => row.voter_name,
            cell: (row) => {
                // Find the candidate ID the voter selected
                const selectedCandidateId = selectedVotes[row.id];
        
                // Get the color for the selected candidate
                const voterColor = candidateColorMap[selectedCandidateId] || (votedVoters.includes(row.id) ? "#95a5a6" : "transparent");
        
                return (
                    <div
                        className={`p-2 rounded`}
                        style={{
                            backgroundColor: voterColor, // Assign the candidate's color
                            color: voterColor !== "transparent" ? "white" : "black", // Ensure text contrast
                            fontWeight: "bold",
                        }}
                    >
                        {row.voter_name}
                    </div>
                );
            },
        },
        
        {
            name: "Barangay",
            selector: (row) =>
                barangays.find(
                    b => b.id === 
                        clusteredPrecincts.find(
                            c => c.id === 
                                precinctNumbers.find(p => p.id === row.precinct_num_id)?.clustered_precinct_id
                        )?.barangay_id
                )?.barangay_name || "Unknown",
            sortable: true,
        },

        {
            name: "Candidates",
            cell: (row) => (
                <div className="flex flex-wrap gap-2">
                    {candidates.length > 0 ? (
                        candidates.map((candidate) => {
                            const isSelected = selectedVotes[row.id] === candidate.id;
                            const candidateColor = candidateColorMap[candidate.id] || "#bdc3c7"; // Default gray
                            
                            return (
                                <label key={candidate.id} className="flex items-center gap-1 p-2 rounded"
                                style={{
                                    backgroundColor: candidateColor,
                                    color: "white",
                                    opacity: isSelected ? 1 : 0.5, // Highlight selected, dim others
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleCandidateSelection(row.id, candidate.id)}
                                        disabled={selectedVotes[row.id] && !isSelected || votedVoters.includes(row.id)} // Disable other checkboxes if one is selected
                                    />
                                    {candidate.candidate_name}
                                </label>
                            );
                        })
                    ) : (
                        <span className="text-gray-500">No candidates available</span>
                    )}
                </div>
            ),
        },
        
        
    
    ];
     // ✅ Filter voters based on search input
     const filteredVoters = voters.filter((voter) =>
        voter.voter_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Survey Page</h2>

            {/* Filter Form */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter Voters</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                    <select
                    className="border p-2 w-full mb-3"
                    value={regionId}
                    onChange={(e) => {
                        setRegionId(e.target.value);
                        setProvinceId("");
                        setCityId("");
                        setBarangayId("");
                        setClusteredPrecinctId("");
                        setPrecinctNumId("");
                        fetchProvince(e.target.value);
                    }}
                    required
                    >
                    <option value="">Select Province</option>
                    {regions.map((region)=>(
                        <option key={region.id} value={region.id}>{region.region_name}</option>
                    ))}
                    </select>
                    {/*Province*/}
                    <select
                    className="border p-2 w-full mb-3"
                    value={provinceId}
                    onChange={(e) => {
                        setProvinceId(e.target.value);
                        setCityId("");
                        setBarangayId("");
                        setClusteredPrecinctId("");
                        setPrecinctNumId("");
                        fetchCities(e.target.value);
                    }}
                    required
                    >
                    <option value="">Select Region</option>
                    {provinces.map((p)=>(
                        <option key={p.id} value={p.id}>{p.province_name}</option>
                    ))}
                    </select>

                    {/* City Dropdown */}
                    
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
                        
                            <select
                                className="border p-2 w-full mb-3"
                                value={precinctNumId}
                                onChange={(e) => setPrecinctNumId(e.target.value)}
                                required
                                disabled={!clusteredPrecinctId} // Disable if no barangay selected
                            >
                                <option value="">Select Precinct</option>
                                {precinctNumbers
                                    .filter(p => p.clustered_precinct_id === Number(clusteredPrecinctId)) // Show only precincts for selected barangay
                                    .map((p) => (
                                        <option key={p.id} value={p.id}>{p.precinct_num}</option>
                                    ))}
                            </select>
                            {/* Candidates */}
                            <select
                                className="border p-2 w-full mb-3"
                                value={selectedPosition}
                                onChange={(e) => {
                                    setSelectedPosition(e.target.value);
                                    // fetchCandidates(e.target.value); // Fetch candidates when position changes
                                }}
                            >
                                <option value="">Select Position</option>
                                {positions.map((pos) => (
                                    <option key={pos.id} value={pos.id}>{pos.position_type}</option>
                                ))}
                            </select>
                             {/* Position Dropdown */}
                   

                        

                </div>

                <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition"
                    onClick={fetchVoters}
                >
                    Filter
                </button>
            </div>

            {/* Table Section */}
             {/* ✅ DataTable with Search Bar */}
             <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-black-700 mb-4">Filtered Voters</h3>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    onClick={handleSubmitVotes}
                >
                    Submit Votes
                </button>


                {/* ✅ Search Bar */}
                <input
                    type="text"
                    placeholder="Search voter name..."
                    className="border px-3 py-2 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <DataTable
                    columns={columns}
                    data={filteredVoters} // ✅ Use filtered data
                    pagination
                    highlightOnHover
                    striped
                    dense
                />
            </div>
        </div>
    );
};

export default Survey;
