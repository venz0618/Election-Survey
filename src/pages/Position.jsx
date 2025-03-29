import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const Position = () => {
    const [positions, setPositions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);
    const [positionType, setPositionType] = useState("");
    const [positionStatus, setPositionStatus] = useState(1);

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
                });
            } else {
                // Create new position
                await axiosInstance.post("/positions", {
                    position_type: positionType,
                    position_status: positionStatus,
                });
            }

            fetchPositions();
            closeModal();
        } catch (error) {
            console.error("Error saving position:", error);
        }
    };

    // Delete position
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/positions/${id}`);
            fetchPositions();
        } catch (error) {
            console.error("Error deleting position:", error);
        }
    };

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
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Position Type</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {positions.map((position) => (
                        <tr key={position.id}>
                            <td className="border border-gray-300 p-2">{position.id}</td>
                            <td className="border border-gray-300 p-2">{position.position_type}</td>
                            <td className="border border-gray-300 p-2">
                                {position.position_status === 1 ? "Active" : "Inactive"}
                            </td>
                            <td className="border border-gray-300 p-2">
                                <button
                                    onClick={() => openModal(position)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(position.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
