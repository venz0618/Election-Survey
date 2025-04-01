import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axiosInstance from "../utils/axiosInstance";
const Barangay = () => {
    const [barangays, setBarangays] = useState([]);
    const [cities, setCities] = useState([]); // Fetch cities for dropdown
    const [barangayName, setBarangayName] = useState("");
    const [cityId, setCityId] = useState(""); // City ID for relation
    const [barangayStatus, setBarangayStatus] = useState(0);
    const [editingBarangay, setEditingBarangay] = useState(null);
    const [showModal, setShowModal] = useState(false);
     const [searchQuery, setSearchQuery] = useState("");  // ✅ Add this line

    useEffect(() => {
        fetchBarangays();
        fetchCities(); // Fetch cities
    }, []);

    // Fetch all barangays
    const fetchBarangays = async () => {
        try {
            const response = await axiosInstance.get("/barangays");
            setBarangays(response.data);
        } catch (error) {
            console.error("Error fetching barangays:", error);
        }
    };

    // Fetch cities for dropdown
    const fetchCities = async () => {
        try {
            const response = await axiosInstance.get("/cities");
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    // Open modal for add or edit
    const openModal = (barangay = null) => {
        if (barangay) {
            setEditingBarangay(barangay);
            setBarangayName(barangay.barangay_name);
            setCityId(barangay.city_id);
            setBarangayStatus(barangay.barangay_status);
        } else {
            setEditingBarangay(null);
            setBarangayName("");
            setCityId("");
            setBarangayStatus(0);
        }
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingBarangay(null);
    };

    // Create or update a barangay
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBarangay) {
                await axiosInstance.put(`/barangays/${editingBarangay.id}`, {
                    barangay_name: barangayName,
                    city_id: cityId,
                    barangay_status: barangayStatus,
                });
            } else {
                await axiosInstance.post("/barangays", {
                    barangay_name: barangayName,
                    city_id: cityId,
                    barangay_status: barangayStatus,
                });
            }
            fetchBarangays();
            closeModal();
        } catch (error) {
            console.error("Error saving barangay:", error);
        }
    };

    // Delete barangay
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this barangay?")) {
            try {
                await axiosInstance.delete(`/barangays/${id}`);
                fetchBarangays();
            } catch (error) {
                console.error("Error deleting barangay:", error);
            }
        }
    };

    const columns = [
        {
            name: "Barangay Name",
            selector: (row) => row.barangay_name,
            sortable: true,
        },

        {
            name: "City Name",
            selector: (row) => cities.find(city => city.id === row.city_id)?.city_name || "Unknown",
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.barangay_status === 1 ? "Active" : "Inactive",
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
     const filteredBarangay = barangays.filter((barangay) =>
        barangay.barangay_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Barangays</h1>

            {/* Add Barangay Button */}
            <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add Barangay
            </button>

            {/* Barangays Table */}
         
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
                    data={filteredBarangay} // ✅ Use filtered data
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
                            {editingBarangay ? "Edit Barangay" : "Add Barangay"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1">Barangay Name</label>
                                <input
                                    type="text"
                                    value={barangayName}
                                    onChange={(e) => setBarangayName(e.target.value)}
                                    className="border p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">City</label>
                                <select
                                    value={cityId}
                                    onChange={(e) => setCityId(e.target.value)}
                                    className="border p-2 w-full"
                                    required
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.city_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Status</label>
                                <select
                                    value={barangayStatus}
                                    onChange={(e) => setBarangayStatus(e.target.value)}
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
                                    {editingBarangay ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Barangay;
