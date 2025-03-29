import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const PrecinctNumber = () => {
    const [precincts, setPrecincts] = useState([]);
    const [clusteredPrecincts, setClusteredPrecincts] = useState([]);
    const [precinctNum, setPrecinctNum] = useState("");
    const [clusteredPrecinctId, setClusteredPrecinctId] = useState("");
    const [editingPrecinct, setEditingPrecinct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPrecincts();
        fetchClusteredPrecincts();
    }, []);

    const fetchPrecincts = async () => {
        try {
            const response = await axiosInstance.get("/precincts");
            setPrecincts(response.data);
        } catch (error) {
            console.error("Error fetching precinct numbers:", error);
        }
    };

    const fetchClusteredPrecincts = async () => {
        try {
            const response = await axiosInstance.get("/clustered-precincts");
            setClusteredPrecincts(response.data);
        } catch (error) {
            console.error("Error fetching clustered precincts:", error);
        }
    };

    const openModal = (precinct = null) => {
        if (precinct) {
            setEditingPrecinct(precinct);
            setPrecinctNum(precinct.precinct_num);
            setClusteredPrecinctId(precinct.clustered_precinct_id);
        } else {
            setEditingPrecinct(null);
            setPrecinctNum("");
            setClusteredPrecinctId("");
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPrecinct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPrecinct) {
                await axiosInstance.put(`/precinct-numbers/${editingPrecinct.id}`, {
                    precinct_num: precinctNum,
                    clustered_precinct_id: clusteredPrecinctId,
                });
            } else {
                await axiosInstance.post("/precinct-numbers", {
                    precinct_num: precinctNum,
                    clustered_precinct_id: clusteredPrecinctId,
                });
            }
            fetchPrecincts();
            closeModal();
        } catch (error) {
            console.error("Error saving precinct:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this precinct number?")) {
            try {
                await axiosInstance.delete(`/precinct-numbers/${id}`);
                fetchPrecincts();
            } catch (error) {
                console.error("Error deleting precinct:", error);
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Precinct Numbers</h1>

            <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add Precinct Number
            </button>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Precinct Number</th>
                        <th className="border border-gray-300 p-2">Clustered Precinct</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {precincts.map((precinct) => (
                        <tr key={precinct.id}>
                            <td className="border border-gray-300 p-2">{precinct.id}</td>
                            <td className="border border-gray-300 p-2">{precinct.precinct_num}</td>
                            <td className="border border-gray-300 p-2">
                            {clusteredPrecincts.find(cp => cp.id === precinct.clustered_precinct_id)?.clustered_precinct_num || "Unknown"}
                            </td>
                            <td className="border border-gray-300 p-2">
                                <button onClick={() => openModal(precinct)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(precinct.id)} className="bg-red-500 text-white px-2 py-1 rounded">
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
                        <h2 className="text-xl font-bold mb-4">{editingPrecinct ? "Edit" : "Add"} Precinct</h2>
                        <form onSubmit={handleSubmit}>
                            <label className="block mb-2">Precinct Number:</label>
                            <input
                                type="text"
                                value={precinctNum}
                                onChange={(e) => setPrecinctNum(e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded mb-4"
                                required
                            />

                            <label className="block mb-2">Clustered Precinct:</label>
                            <select
                                value={clusteredPrecinctId}
                                onChange={(e) => setClusteredPrecinctId(e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded mb-4"
                                required
                            >
                                <option value="">Select Clustered Precinct</option>
                                {clusteredPrecincts.map((cp) => (
                                    <option key={cp.id} value={cp.id}>
                                        {cp.clustered_precinct_num}
                                    </option>
                                ))}
                            </select>

                            <div className="flex justify-end">
                                <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrecinctNumber;
