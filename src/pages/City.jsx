import { useState, useEffect } from "react";

import axiosInstance from "../utils/axiosInstance";
const City = () => {
    const [cities, setCities] = useState([]);
    const [provinces, setProvinces] = useState([]); // Fetch provinces for dropdown
    const [cityName, setCityName] = useState("");
    const [provinceId, setProvinceId] = useState(""); // Province ID for relation
    const [cityStatus, setCityStatus] = useState(0);
    const [editingCity, setEditingCity] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCities();
        fetchProvinces(); // Fetch provinces
    }, []);

    // Fetch all cities
    const fetchCities = async () => {
        try {
            const response = await axiosInstance.get("/cities");
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    // Fetch provinces for dropdown
    const fetchProvinces = async () => {
        try {
            const response = await axiosInstance.get("/provinces");
            setProvinces(response.data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    // Open modal for add or edit
    const openModal = (city = null) => {
        if (city) {
            setEditingCity(city);
            setCityName(city.city_name);
            setProvinceId(city.province_id);
            setCityStatus(city.city_status);
        } else {
            setEditingCity(null);
            setCityName("");
            setProvinceId("");
            setCityStatus(0);
        }
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingCity(null);
    };

    // Create or update a city
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCity) {
                await axiosInstance.put(`/cities/${editingCity.id}`, {
                    city_name: cityName,
                    province_id: provinceId,
                    city_status: cityStatus,
                });
            } else {
                await axiosInstance.post("/cities", {
                    city_name: cityName,
                    province_id: provinceId,
                    city_status: cityStatus,
                });
            }
            fetchCities();
            closeModal();
        } catch (error) {
            console.error("Error saving city:", error);
        }
    };

    // Delete city
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this city?")) {
            try {
                await axiosInstance.delete(`/cities/${id}`);
                fetchCities();
            } catch (error) {
                console.error("Error deleting city:", error);
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">City/Municipality</h1>

            {/* Add City Button */}
            <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add City
            </button>

            {/* Cities Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">City Name</th>
                        <th className="border border-gray-300 p-2">Province</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cities.map((city) => (
                        <tr key={city.id}>
                            <td className="border border-gray-300 p-2">{city.id}</td>
                            <td className="border border-gray-300 p-2">{city.city_name}</td>
                            <td className="border border-gray-300 p-2">
                            {provinces.find(province => province.id === city.province_id)?.province_name || "Unknown"}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {city.city_status ? "Active" : "Inactive"}
                            </td>
                            <td className="border border-gray-300 p-2">
                                <button
                                    onClick={() => openModal(city)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(city.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">
                            {editingCity ? "Edit City" : "Add City"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1">City Name</label>
                                <input
                                    type="text"
                                    value={cityName}
                                    onChange={(e) => setCityName(e.target.value)}
                                    className="border p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Province</label>
                                <select
                                    value={provinceId}
                                    onChange={(e) => setProvinceId(e.target.value)}
                                    className="border p-2 w-full"
                                    required
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.id}>
                                            {province.province_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Status</label>
                                <select
                                    value={cityStatus}
                                    onChange={(e) => setCityStatus(parseInt(e.target.value))}
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
                                    {editingCity ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default City;
