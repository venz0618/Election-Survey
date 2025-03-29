import { useState, useEffect } from "react";

import axiosInstance from "../utils/axiosInstance";

const ClusteredPrecinct = () => {
    const [clusteredPrecincts, setClusteredPrecincts] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [clusteredPrecinctNum, setClusteredPrecinctNum] = useState("");
    const [barangayId, setBarangayId] = useState("");
    const [clusteredStatus, setClusteredStatus] = useState(0);
    const [editingClusteredPrecinct, setEditingClusteredPrecinct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchClusteredPrecincts();
        fetchBarangays();
    }, []);

    const fetchClusteredPrecincts = async () => {
        try {
            const response = await axiosInstance.get("/clustered-precincts");
            setClusteredPrecincts(response.data);
        } catch (error) {
            console.error("Error fetching clustered precincts:", error);
        }
    };

    const fetchBarangays = async () => {
        try {
            const response = await axiosInstance.get("/barangays");
            setBarangays(response.data);
        } catch (error) {
            console.error("Error fetching barangays:", error);
        }
    };

    const openModal = (precinct = null) => {
        if (precinct) {
            setEditingClusteredPrecinct(precinct);
            setClusteredPrecinctNum(precinct.clustered_precinct_num);
            setBarangayId(precinct.barangay_id);
            setClusteredStatus(precinct.clustered_status);
        } else {
            setEditingClusteredPrecinct(null);
            setClusteredPrecinctNum("");
            setBarangayId("");
            setClusteredStatus(0);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingClusteredPrecinct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClusteredPrecinct) {
                await axiosInstance.put(`/clustered-precincts/${editingClusteredPrecinct.id}`, {
                    clustered_precinct_num: clusteredPrecinctNum,
                    barangay_id: barangayId,
                    clustered_status: clusteredStatus,
                });
            } else {
                await axiosInstance.post("/clustered-precincts", {
                    clustered_precinct_num: clusteredPrecinctNum,
                    barangay_id: barangayId,
                    clustered_status: clusteredStatus,
                });
            }
            fetchClusteredPrecincts();
            closeModal();
        } catch (error) {
            console.error("Error saving clustered precinct:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this clustered precinct?")) {
            try {
                await axiosInstance.delete(`/clustered-precincts/${id}`);
                fetchClusteredPrecincts();
            } catch (error) {
                console.error("Error deleting clustered precinct:", error);
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Clustered Precincts</h1>

            <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add Clustered Precinct
            </button>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Clustered Precinct Number</th>
                        <th className="border border-gray-300 p-2">Barangay</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clusteredPrecincts.map((precinct) => (
                        <tr key={precinct.id}>
                            <td className="border border-gray-300 p-2">{precinct.id}</td>
                            <td className="border border-gray-300 p-2">{precinct.clustered_precinct_num}</td>
                            <td className="border border-gray-300 p-2">{precinct.barangay_name}
                            {barangays.find(barangay => barangay.id === precinct.barangay_id)?.barangay_name || "Unknown"}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {precinct.clustered_status ? "Active" : "Inactive"}
                            </td>
                            <td className="border border-gray-300 p-2">
                                <button
                                    onClick={() => openModal(precinct)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(precinct.id)}
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
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {editingClusteredPrecinct ? "Edit Clustered Precinct" : "Add Clustered Precinct"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block">Clustered Precinct Number:</label>
                                <input
                                    type="number"
                                    value={clusteredPrecinctNum}
                                    onChange={(e) => setClusteredPrecinctNum(e.target.value)}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block">Barangay:</label>
                                <select
                                    value={barangayId}
                                    onChange={(e) => setBarangayId(e.target.value)}
                                    className="w-full border p-2 rounded"
                                    required
                                >
                                    <option value="">Select Barangay</option>
                                    {barangays.map((barangay) => (
                                        <option key={barangay.id} value={barangay.id}>
                                            {barangay.barangay_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block">Status:</label>
                                <select
                                    value={clusteredStatus}
                                    onChange={(e) => setClusteredStatus(e.target.value)}
                                    className="w-full border p-2 rounded"
                                >
                                    <option value="0">Inactive</option>
                                    <option value="1">Active</option>
                                </select>
                            </div>

                            <div className="flex justify-end">
                                <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                    {editingClusteredPrecinct ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClusteredPrecinct;
