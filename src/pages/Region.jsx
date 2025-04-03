import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import DataTable from "react-data-table-component";
const Region = () => {
    const [regions, setRegions] = useState([]);
    const [regionName, setRegionName] = useState("");
    const [regionStatus, setRegionStatus] = useState(0);
    const [editingRegion, setEditingRegion] = useState(null);
    const [showModal, setShowModal] = useState(false); // Control modal visibility
    const [searchQuery, setSearchQuery] = useState("");  // ✅ Add this line
    useEffect(() => {
        fetchRegions();
    }, []);

    // Fetch all regions
    const fetchRegions = async () => {
        try {
            const response = await axiosInstance.get("/regions");
            setRegions(response.data);
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    };

    // Open modal for add or edit
    const openModal = (region = null) => {
        if (region) {
            setEditingRegion(region);
            setRegionName(region.region_name);
            setRegionStatus(region.region_status);
        } else {
            setEditingRegion(null);
            setRegionName("");
            setRegionStatus(0);
        }
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingRegion(null);
    };

    // Create or update a region
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRegion) {
                // Update region
                await axiosInstance.put(`/regions/${editingRegion.id}`, {
                    region_name: regionName,
                    region_status: regionStatus,
                });
            } else {
                // Create new region
                await axiosInstance.post("/regions", {
                    region_name: regionName,
                    region_status: regionStatus,
                });
            }
            fetchRegions();
            closeModal(); // Close modal after saving
        } catch (error) {
            console.error("Error saving region:", error);
        }
    };

    // Delete region
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this region?")) {
            try {
                await axiosInstance.delete(`/regions/${id}`);
                fetchRegions();
            } catch (error) {
                console.error("Error deleting region:", error);
            }
        }
    };

    const columns = [
        {
            name: "Region",
            selector: (row) => row.region_name,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.region_status === 1 ? "Active" : "Inactive",
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
   const filteredRegion = regions.filter((p) =>
    p.region_name.toLowerCase().includes(searchQuery.toLowerCase())
);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Regions</h1>

            {/* Add Region Button */}
            <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add Region
            </button>

            {/* Regions Table */}
            {/* <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {regions.map((region) => (
                        <tr key={region.id}>
                            <td className="border border-gray-300 p-2">{region.id}</td>
                            <td className="border border-gray-300 p-2">{region.region_name}</td>
                            <td className="border border-gray-300 p-2">
                                {region.region_status ? "Active" : "Inactive"}
                            </td>
                            <td className="border border-gray-300 p-2">
                                <button
                                    onClick={() => openModal(region)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(region.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}


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
                    data={filteredRegion} // ✅ Use filtered data
                    pagination
                    highlightOnHover
                    striped
                    dense
                />

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">
                            {editingRegion ? "Edit Region" : "Add Region"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1">Region Name</label>
                                <input
                                    type="text"
                                    value={regionName}
                                    onChange={(e) => setRegionName(e.target.value)}
                                    className="border p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Status</label>
                                <select
                                    value={regionStatus}
                                    onChange={(e) => setRegionStatus(e.target.value)}
                                    className="border p-2 w-full"
                                >
                                    <option value={0}>Inactive</option>
                                    <option value={1}>Active</option>
                                </select>
                            </div>
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
                                    {editingRegion ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Region;
