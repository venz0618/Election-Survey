import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import DataTable from "react-data-table-component";

const Province = () => {
    const [provinces, setProvinces] = useState([]);
    const [regions, setRegions] = useState([]); // Fetch available regions
    const [provinceName, setProvinceName] = useState("");
    const [regionId, setRegionId] = useState(""); // Store selected region
    const [provinceStatus, setProvinceStatus] = useState(0);
    const [editingProvince, setEditingProvince] = useState(null);
    const [showModal, setShowModal] = useState(false); 
    const [searchQuery, setSearchQuery] = useState("");  // ✅ Add this line
    useEffect(() => {
        fetchProvinces();
        fetchRegions();
    }, []);

    // Fetch all provinces
    const fetchProvinces = async () => {
        try {
            const response = await axiosInstance.get("/provinces");
            setProvinces(response.data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    // Fetch all regions (for selecting associated region)
    const fetchRegions = async () => {
        try {
            const response = await axiosInstance.get("/regions");
            setRegions(response.data);
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    };

    // Open modal for add or edit
    const openModal = (province = null) => {
        if (province) {
            setEditingProvince(province);
            setProvinceName(province.province_name);
            setRegionId(province.region_id);
            setProvinceStatus(province.province_status);
        } else {
            setEditingProvince(null);
            setProvinceName("");
            setRegionId("");
            setProvinceStatus(0);
        }
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingProvince(null);
    };

    // Create or update a province
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProvince) {
                // Update province
                await axiosInstance.put(`/provinces/${editingProvince.id}`, {
                    province_name: provinceName,
                    region_id: regionId,
                    province_status: provinceStatus,
                });
            } else {
                // Create new province
                await axiosInstance.post("/provinces", {
                    province_name: provinceName,
                    region_id: regionId,
                    province_status: provinceStatus,
                });
            }
            fetchProvinces();
            closeModal(); 
        } catch (error) {
            console.error("Error saving province:", error);
        }
    };

    // Delete province
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this province?")) {
            try {
                await axiosInstance.delete(`/provinces/${id}`);
                fetchProvinces();
            } catch (error) {
                console.error("Error deleting province:", error);
            }
        }
    };

    const columns = [
        {
            name: "Province",
            selector: (row) => row.region_name,
            sortable: true,
        },

        {
            name: "Region",
            selector: (row) => regions.find(region => region.id === row.region_id)?.region_name || "Unknown",
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
            <h1 className="text-2xl font-bold mb-4">Provinces</h1>

            {/* Add Province Button */}
            <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add Province
            </button>

            {/* Provinces Table */}
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
                            {editingProvince ? "Edit Province" : "Add Province"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1">Province Name</label>
                                <input
                                    type="text"
                                    value={provinceName}
                                    onChange={(e) => setProvinceName(e.target.value)}
                                    className="border p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Region</label>
                                <select
                                    value={regionId}
                                    onChange={(e) => setRegionId(e.target.value)}
                                    className="border p-2 w-full"
                                    required
                                >
                                    <option value="">Select Region</option>
                                    {regions.map((region) => (
                                        <option key={region.id} value={region.id}>
                                            {region.region_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Status</label>
                                <select
                                    value={provinceStatus}
                                    onChange={(e) => setProvinceStatus(e.target.value)}
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
                                    {editingProvince ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Province;
