import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2"; // Import SweetAlert2
const Position = () => {
    const [positions, setPositions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);
    const [positionType, setPositionType] = useState("");
    const [positionLevel, setPositionLevel] = useState("");
    const [positionMax, setPositionMax] = useState(1);
    const [positionStatus, setPositionStatus] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");  // ✅ Add this line
    useEffect(() => {
        fetchPositions();
    }, []);

    // Fetch positions from API
    const fetchPositions = async () => {
        try {
            const response = await axiosInstance.get("/positions");
            setPositions(response.data);
        } catch (error) {
            console.error("Error fetching positions:", error);
        }
    };

    // Open modal (Add / Edit)
    const openModal = (position = null) => {
        if (position) {
            setEditingPosition(position);
            setPositionType(position.position_type);
            setPositionStatus(position.position_status);
        } else {
            setEditingPosition(null);
            setPositionType("");
            setPositionStatus(1);
        }
        setModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalOpen(false);
    };

    // Handle form submission (Add / Update)
    const handleSave = async () => {
        try {
            if (editingPosition) {
                // Update existing position
                await axiosInstance.put(`/positions/${editingPosition.id}`, {
                    position_type: positionType,
                    position_status: positionStatus,
                    level: positionLevel,
                    max_votes: positionMax,
                });
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Position Edited successfully!",
                    confirmButtonColor: "#4CAF50", // Green button
                });
            } else {
                // Create new position
                await axiosInstance.post("/positions", {
                    position_type: positionType,
                    position_status: positionStatus,
                    level: positionLevel,
                    max_votes: positionMax,
                });
            }
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Position Added successfully!",
                confirmButtonColor: "#4CAF50", // Green button
            });

            fetchPositions();
            closeModal();
        } catch (error) {
            console.error("Error saving position:", error);
        }
    };

    // Delete position
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this position?")) {
            try {
                await axiosInstance.delete(`/positions/${id}`);
                fetchPositions();
            } catch (error) {
                console.error("Error deleting position:", error);
            }
             Swal.fire({
                            icon: "success",
                            title: "Success!",
                            text: "Position Deleted successfully!",
                            confirmButtonColor: "#4CAF50", // Green button
                        });
        }
    };


    const columns = [
        {
            name: "Position Type",
            selector: (row) => row.position_type,
            sortable: true,
        },
        {
            name: "Position Level",
            selector: (row) => row.level,
            sortable: true,
        },
        {
            name: "Max Vote",
            selector: (row) => row.max_votes,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.position_status === 1 ? "Active" : "Inactive",
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
   // ✅ Filter voters based on search input
   const filteredPosition = positions.filter((p) =>
    p.position_type.toLowerCase().includes(searchQuery.toLowerCase())
);



    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Positions</h2>
            <button
                onClick={() => openModal()}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                + Add Position
            </button>

            {/* Table */}

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
                    data={filteredPosition} // ✅ Use filtered data
                    pagination
                    highlightOnHover
                    striped
                    dense
                />

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h3 className="text-xl font-bold mb-4">
                            {editingPosition ? "Edit Position" : "Add Position"}
                        </h3>
                        <input
                            type="text"
                            value={positionType}
                            onChange={(e) => setPositionType(e.target.value)}
                            placeholder="Enter position type"
                            className="border p-2 w-full mb-2"
                        />
                         <select
                            value={positionLevel}
                            onChange={(e) => setPositionLevel((e.target.value))}
                            className="border p-2 w-full mb-4"

                        >
                            <option value="">Select Position Level</option> 
                            <option value="national">National</option>
                            <option value="province">Provincial</option>
                            <option value="city">City</option>
                            <option value="barangay">Barangay</option>
                        </select>
                        <input
                            type="number"
                            value={positionMax}
                            onChange={(e) => setPositionMax(e.target.value)}
                            placeholder="Enter Max Votes"
                            className="border p-2 w-full mb-2"
                        />
                        <select
                            value={positionStatus}
                            onChange={(e) => setPositionStatus(parseInt(e.target.value))}
                            className="border p-2 w-full mb-4"
                        >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                        </select>
                        <div className="flex justify-end">
                            <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Position;
