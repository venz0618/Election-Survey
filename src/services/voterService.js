import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const fetchVoters = async () => {
    try {
        const response = await axios.get(`${API_URL}/voters`);
        return response.data;
    } catch (error) {
        console.error("Error fetching voters:", error);
        return [];
    }
};

export const fetchCities = async () => {
    try {
        const response = await axios.get(`${API_URL}/cities`);
        return response.data;
    } catch (error) {
        console.error("Error fetching cities:", error);
        return [];
    }
};

export const fetchBarangays = async (cityId) => {
    try {
        const response = await axios.get(`${API_URL}/barangays?city_id=${cityId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching barangays:", error);
        return [];
    }
};

export const fetchPrecincts = async (barangayId) => {
    try {
        const url = barangayId ? `${API_URL}/precincts?barangay_id=${barangayId}` : `${API_URL}/precincts`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching precincts:", error);
        return [];
    }
};

export const saveVoter = async (voter) => {
    try {
        if (voter.id) {
            return await axios.put(`${API_URL}/voters/${voter.id}`, voter);
        }
        return await axios.post(`${API_URL}/voters`, voter);
    } catch (error) {
        console.error("Error saving voter:", error);
    }
};

export const deleteVoter = async (id) => {
    try {
        return await axios.delete(`${API_URL}/voters/${id}`);
    } catch (error) {
        console.error("Error deleting voter:", error);
    }
};
