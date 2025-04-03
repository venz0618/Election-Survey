import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import DataTable from "react-data-table-component";
const PrecinctNumber = () => {
    const [precincts, setPrecincts] = useState([]);
    const [clusteredPrecincts, setClusteredPrecincts] = useState([]);
    const [precinctNum, setPrecinctNum] = useState("");
    const [clusteredPrecinctId, setClusteredPrecinctId] = useState("");
    const [editingPrecinct, setEditingPrecinct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");  // ✅ Add this line
    //For Table

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(precincts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = precincts.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
      };
    
      const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
      };

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
                await axiosInstance.put(`/precincts/${editingPrecinct.id}`, {
                    precinct_num: precinctNum,
                    clustered_precinct_id: clusteredPrecinctId,
                });
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Percinct Edited successfully!",
                    confirmButtonColor: "#4CAF50", // Green button
                });
            } else {
                await axiosInstance.post("/precincts", {
                    precinct_num: precinctNum,
                    clustered_precinct_id: clusteredPrecinctId,
                });
            }
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Precicnt Added successfully!",
                confirmButtonColor: "#4CAF50", // Green button
            });
            fetchPrecincts();
            closeModal();
        } catch (error) {
            console.error("Error saving precinct:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this precinct number?")) {
            try {
                await axiosInstance.delete(`/precincts/${id}`);
                fetchPrecincts();
            } catch (error) {
                console.error("Error deleting precinct:", error);
            }
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Precinct Deleted successfully!",
                confirmButtonColor: "#4CAF50", // Green button
            });
        }
    };

    const columns = [
        {
            name: "Precinct Number",
            selector: (row) => row.precinct_num,
            sortable: true,
        },

        {
            name: "Clustered Precinct",
            selector: (row) => clusteredPrecincts.find(cp => cp.id === row.clustered_precinct_id)?.clustered_precinct_num || "Unknown",
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
   const filteredPrecint = currentItems.filter((p) =>
    p.precinct_num.toLowerCase().includes(searchQuery.toLowerCase())
);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Precinct Numbers</h1>

            <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add Precinct Number
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
                    data={filteredPrecint} // ✅ Use filtered data
                    pagination
                    highlightOnHover
                    striped
                    dense
                />
   

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
