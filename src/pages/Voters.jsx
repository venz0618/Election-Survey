import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import DataTable from "react-data-table-component";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";



const Voters = () => {
    const [voters, setVoters] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [clusteredPrecincts, setClusteredPrecincts] = useState([]);
    const [precincts, setPrecincts] = useState([]);
    const [loading, setLoading] = useState(false);

    

    const [voterId, setVoterId] = useState(null);
    const [cityId, setCityId] = useState("");
    const [barangayId, setBarangayId] = useState("");
    const [precinctNumId, setPrecinctNumId] = useState("");
    const [clusteredPrecinctId, setClusteredPrecinctId] = useState("");
    const [voterName, setVoterName] = useState("");
    const [voterStatus, setVoterStatus] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false); // State for bulk modal

    const [selectedFile, setSelectedFile] = useState(null);


    // const onDrop = (acceptedFiles) => {
    //     if (acceptedFiles.length === 0) {
    //         alert("No file selected!");
    //         return;
    //     }

    //     if (acceptedFiles.length > 0) {
    //         setSelectedFile(acceptedFiles[0]); // Store the selected file
    //     }
    
    //     const file = acceptedFiles[0];
    
    //     const reader = new FileReader();
    //     reader.readAsArrayBuffer(file);  // Use ArrayBuffer instead of BinaryString
    
    //     reader.onload = (e) => {
    //         const data = new Uint8Array(e.target.result);
    //         const workbook = XLSX.read(data, { type: "array" });
    
    //         // Get the first sheet
    //         const sheetName = workbook.SheetNames[0];
    //         const worksheet = workbook.Sheets[sheetName];
    
    //         // Convert to JSON
    //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
    //         console.log("Parsed Excel Data:", jsonData);
            
    //         setVoters(jsonData);  // Store data in state
    //     };
    
    //     reader.onerror = (error) => {
    //         console.error("Error reading file:", error);
    //     };
    // };
    
    // const { getRootProps, getInputProps } = useDropzone({
    //     onDrop,
    //     accept: ".xlsx, .xls",
    // });
    

    
    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length === 0) {
            alert("No file selected!");
            return;
        }

        const file = acceptedFiles[0];
        setSelectedFile(file); // Store file name in state

        const reader = new FileReader();
        reader.readAsBinaryString(file); // Use BinaryString

        reader.onload = (e) => {
            const workbook = XLSX.read(e.target.result, { type: "binary" });

            // Get first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            console.log("Parsed Excel Data:", jsonData);
            setVoters(jsonData); // Store data
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-excel" // .xls
        ],
    });
    
    

    useEffect(() => {
        fetchVoters();
        fetchCities();
        fetchPrecincts();
        fetchBarangays();
        fetchClusteredPrecincts();
        fetchAllPrecincts();
    }, []);

    

    // const fetchVoters = async () => {
    //     try {
    //         const response = await axiosInstance.get("/voters");
    //         setVoters(response.data);
            
    //     } catch (error) {
    //         console.error("Error fetching voters:", error);
    //     }
    // };

    const fetchVoters = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/voters");
            setVoters(response.data);
        } catch (error) {
            console.error("Error fetching voters:", error);
        } finally {
            setLoading(false);
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

    // const fetchBarangays = async (cityId) => {
    //     if (!cityId) {
    //         setBarangays([]); // Clear barangays if no city selected
    //         return;
    //     }
    
    //     try {
    //         const response = await axiosInstance.get(`/barangays?city_id=${cityId}`);
    //         setBarangays(response.data);
    //     } catch (error) {
    //         console.error("Error fetching barangays:", error);
    //     }
    // };

    const fetchBarangays = async (cityId) => {
        if (!cityId) {
            setBarangays([]);
            setClusteredPrecincts([]);
            setPrecincts([]);  // Clear when no city is selected
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
    
    // const fetchClusteredPrecincts = async (barangayId) => {
    //     if (!barangayId) {
    //         setClusteredPrecincts([]);
    //     }

    //     try{
    //         const response = await axiosInstance.get(`/clustered-precincts/${barangayId}`);
    //         setClusteredPrecincts(response.data);
    //     } catch(error){
    //         console.error("Error fetching clustered precinct:", error);
    //     }
    // };
    
    
    
    // const fetchPrecincts = async (clustered_precinct_id) => {
    //     if (!clustered_precinct_id) {
    //         console.warn("No clustered_precinct_id provided, skipping request.");
    //         return; // Exit function early to avoid 404 error
    //     }
    
    //     try {
    //         console.log("Fetching precincts for clustered_precinct_id:", clustered_precinct_id);
    //         const response = await axiosInstance.get(`/precincts/${clustered_precinct_id}`);
    
    //         if (Array.isArray(response.data)) {
    //             setPrecincts(response.data);
    //         } else {
    //             console.error("Invalid precinct data received:", response.data);
    //             setPrecincts([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching precincts:", error);
    //         setPrecincts([]);
    //     }
    // };

    const fetchClusteredPrecincts = async (barangayId) => {
        if (!barangayId) {
            setClusteredPrecincts([]); // Clear state when no barangayId
            return;
        }
    
        try {
            const response = await axiosInstance.get(`/clustered-precincts/${barangayId}`);
            setClusteredPrecincts(response.data);
        } catch (error) {
            console.error("Error fetching clustered precinct:", error);
            setClusteredPrecincts([]); // Clear on error
        }
    };
    
    const fetchPrecincts = async (clusteredPrecinctId) => {
        if (!clusteredPrecinctId) {
            setPrecincts([]); // Clear precincts if no clustered precinct is selected
            return;
        }
    
        try {
            const response = await axiosInstance.get(`/precincts/${clusteredPrecinctId}`);
            setPrecincts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching precincts:", error);
            setPrecincts([]); // Ensure state is reset on error
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

    const openBulkModal = () => setShowBulkModal(true);
    const closeBulkModal = () => {
        setShowBulkModal(false);
        setVoters([]);
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

    const handleSubmitBulk = async (e) => {
        e.preventDefault();
    
        if (voters.length === 0) {
            alert("Please upload an Excel file first!");
            return;
        }
    
        if (!precinctNumId) {
            alert("Please select a precinct before submitting.");
            return;
        }
    
        try {
            const formattedVoters = voters.map(voter => ({
                voter_name: voter.voter_name || "Unknown",
                precinct_num_id: precinctNumId, 
                voter_status: voterStatus
            }));
    
            const response = await axiosInstance.post("/voters/bulk", { voters: formattedVoters });
    
            if (response.status === 200 || response.status === 201) {
                alert("Voters successfully added!");
                fetchVoters(); // Refresh list
                closeBulkModal();
                setVoters([]);
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error adding voters:", error);
            alert("Failed to submit voters. Please check the console for more details.");
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

    const precinctMap = new Map(precincts.map(p => [p.id, p.precinct_num]));

const columns = [
    {
        name: "Voters Name",
        selector: (row) => row.voter_name,
        sortable: true,
    },
    {
        name: "Precinct Number",
        selector: (row) => precinctMap.get(row.precinct_num_id) || "Unknown",
        sortable: true,
    },
    {
        name: "Status",
        selector: (row) => row.voter_status === 1 ? "Active" : "Inactive",
        sortable: true,
    },
    {
        name: "Actions",
        cell: (row) => (
            <div className="flex gap-2">
                <button
                    onClick={() => openModal(row)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDelete(row.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                >
                    Delete
                </button>
            </div>
        ),
    }
];



   
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Voters Management</h1>

            <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add Voter
            </button>

            <button onClick={openBulkModal} className="px-4 py-2 bg-green-600 text-white rounded-md">Bulk Add Voters</button>


                <DataTable
                    columns={columns}
                    data={voters} // ✅ Use filtered data
                    pagination
                    highlightOnHover
                    striped
                    dense
                />

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
                                    setPrecincts([]); // Clear precincts when changing the city
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



{showBulkModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Bulk Add Voters</h2>

            {/* File Upload (Drag & Drop) */}
            <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-6 text-center cursor-pointer rounded-md">
                <input {...getInputProps()} />
                <p className="text-gray-600">Drag & drop an Excel file here, or click to select a file</p>
            </div>
            {/* Display Selected File */}
            {selectedFile && (
                <p className="mt-2 text-green-600">
                    ✅ File Selected: <strong>{selectedFile.name}</strong>
                </p>
            )}

        
            

            {/* Precinct Selection */}
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
                                    setPrecincts([]); // Clear precincts when changing the city
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

            {/* Display Uploaded Voters */}
            

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
                <button onClick={closeBulkModal} className="px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
                <button onClick={handleSubmitBulk} className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit Bulk Voters</button>
            </div>
        </div>
    </div>
)}

       

        </div>
    );
};

export default Voters;
