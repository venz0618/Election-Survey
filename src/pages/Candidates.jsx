import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2"; // Import SweetAlert2

const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [candidateName, setCandidateName] = useState("");
    const [positionId, setPositionId] = useState("");
    const [provinceId, setProvinceId] = useState("");
    const [candidateStatus, setCandidateStatus] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");  // ✅ Add this line



    useEffect(() => {
        fetchCandidates();
        fetchPositions();
        fetchProvinces();
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await axiosInstance.get("/candidates");
            setCandidates(response.data);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };

    const fetchPositions = async () => {
        try {
            const response = await axiosInstance.get("/positions");
            setPositions(response.data);
        } catch (error) {
            console.error("Error fetching positions:", error);
        }
    };

    const fetchProvinces = async () => {
        try {
            const response = await axiosInstance.get("/provinces");
            setProvinces(response.data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const openModal = (candidate = null) => {
        if (candidate) {
            setEditingCandidate(candidate);
            setCandidateName(candidate.candidate_name);
            setPositionId(candidate.position_id);
            setProvinceId(candidate.province_id);
            setCandidateStatus(candidate.candidate_status);
        } else {
            setEditingCandidate(null);
            setCandidateName("");
            setPositionId("");
            setProvinceId("");
            setCandidateStatus(1);
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleSave = async () => {
        if (!candidateName || !positionId || !provinceId) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            if (editingCandidate) {
                await axiosInstance.put(`/candidates/${editingCandidate.id}`, {
                    candidate_name: candidateName,
                    position_id: positionId,
                    province_id: provinceId,
                    candidate_status: candidateStatus,
                },
            );
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Candidate Edited successfully!",
                confirmButtonColor: "#4CAF50", // Green button
            });
            } else {
                await axiosInstance.post("/candidates", {
                    candidate_name: candidateName,
                    position_id: positionId,
                    province_id: provinceId,
                    candidate_status: candidateStatus,
                },
            
            );
            }
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Candidate added successfully!",
                    confirmButtonColor: "#4CAF50", // Green button
                });
            fetchCandidates();
            closeModal();
        } catch (error) {
            console.error("Error saving candidate:", error);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you ure you want to delete this?")){
                        try {
                            await axiosInstance.delete(`/candidates/${id}`);
                            fetchCandidates();
                        } catch (error) {
                            console.error("Error deleting candidate:", error);
                        }
                        Swal.fire({
                            icon: "success",
                            title: "Success!",
                            text: "Candidate deleted successfully!",
                            confirmButtonColor: "#4CAF50", // Green button
                        });
                    }
                    
       
    };


    const columns = [
      {  
        name: "Name",
        selector: (row) => row.candidate_name,
        sortable: true,

      },

      {
        name: "Position",
        selector: (row) => row.position?.position_type || "Unknown",
        sortable: true,
      },

      {
        name: "Province",
        selector: (row) => row.province?.province_name || "Unknown",
        sortable: true,
      },

      {
        name: "Status",
        selector: (row) => row.candidate_status === 1 ? "Active" : "Inactive",
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
       // ✅ Filter voters based on search input
       const filteredCandidate = candidates.filter((candidate) =>
        candidate.candidate_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Candidates</h2>
            <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add Candidate
            </button>

                <input
                    type="text"
                    placeholder="Search voter name..."
                    className="border px-3 py-2 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                    <DataTable
                    columns={columns}
                    data={filteredCandidate} // ✅ Use filtered data
                    pagination
                    highlightOnHover
                    striped
                    dense
                />

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">{editingCandidate ? "Edit Candidate" : "Add Candidate"}</h2>
                        
                        <label className="block mb-2">Name</label>
                        <input 
                            type="text" 
                            className="border border-gray-300 p-2 w-full mb-2"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                        />

                        <label className="block mb-2">Position</label>
                        <select 
                            className="border border-gray-300 p-2 w-full mb-2"
                            value={positionId}
                            onChange={(e) => setPositionId(e.target.value)}
                        >
                            <option value="">Select Position</option>
                            {positions.map((position) => (
                                <option key={position.id} value={position.id}>
                                    {position.position_type}
                                </option>
                            ))}
                        </select>

                        <label className="block mb-2">Province</label>
                        <select 
                            className="border border-gray-300 p-2 w-full mb-2"
                            value={provinceId}
                            onChange={(e) => setProvinceId(e.target.value)}
                        >
                            <option value="">Select Province</option>
                            {provinces.map((province) => (
                                <option key={province.id} value={province.id}>
                                    {province.province_name}
                                </option>
                            ))}
                        </select>

                        <label className="block mb-2">Status</label>
                        <select 
                            className="border border-gray-300 p-2 w-full mb-2"
                            value={candidateStatus}
                            onChange={(e) => setCandidateStatus(e.target.value)}
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>

                        <div className="flex justify-end mt-4">
                            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                                Save
                            </button>
                            <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Candidates;
