import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance"; // Ensure this is your axios instance

const useFilters = () => {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [clusteredPrecincts, setClusteredPrecincts] = useState([]);
    const [precinctNumbers, setPrecinctNumbers] = useState([]);
    const [positions, setPositions] = useState([]);
    const [candidates, setCandidates] = useState([]);

    const [regionId, setRegionId] = useState("");
    const [provinceId, setProvinceId] = useState("");
    const [cityId, setCityId] = useState("");
    const [barangayId, setBarangayId] = useState("");
    const [clusteredPrecinctId, setClusteredPrecinctId] = useState("");
    const [precinctNumId, setPrecinctNumId] = useState("");
    const [selectedPosition, setSelectedPosition] = useState("");
    // const [votes, setVotes] = useState([]);

    const fetchRegions = async () => {
        const cachedRegions = sessionStorage.getItem("regions");
        if (cachedRegions) {
            setRegions(JSON.parse(cachedRegions));
            return;
        }
        try {
            const response = await axiosInstance.get("/regions");
            setRegions(response.data);
            sessionStorage.setItem("regions", JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    };

    const fetchProvince = async (regionId) => {
        if (!regionId) {
            setProvinces([]);
            return;
        }
        const cachedProvinces = sessionStorage.getItem(`provinces_${regionId}`);
        if (cachedProvinces) {
            setProvinces(JSON.parse(cachedProvinces));
            return;
        }
        try {
            const response = await axiosInstance.get(`/provinces?region_id=${regionId}`);
            setProvinces(response.data);
            sessionStorage.setItem(`provinces_${regionId}`, JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const fetchCities = async (provinceId) => {
        if (!provinceId) {
            setCities([]);
            return;
        }
        const cachedCities = sessionStorage.getItem(`cities_${provinceId}`);
        if (cachedCities) {
            setCities(JSON.parse(cachedCities));
            return;
        }
        try {
            const response = await axiosInstance.get(`/cities?province_id${provinceId}`);
            setCities(response.data);
            sessionStorage.setItem(`cities_${provinceId}`, JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const fetchBarangays = async (cityId) => {
        if (!cityId) {
            setBarangays([]);
            return;
        }
        const cachedBarangays = sessionStorage.getItem(`barangays_${cityId}`);
        if (cachedBarangays) {
            setBarangays(JSON.parse(cachedBarangays));
            return;
        }
        try {
            const response = await axiosInstance.get(`/barangays?city_id${cityId}`);
            setBarangays(response.data);
            sessionStorage.setItem(`barangays_${cityId}`, JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching barangays:", error);
        }
    };

    const fetchClusteredPrecincts = async (barangayId) => {
        if (!barangayId) {
            setClusteredPrecincts([]);
            return;
        }
        try {
            const response = await axiosInstance.get(`/clustered-precincts/${barangayId}`);
            setClusteredPrecincts(response.data);
        } catch (error) {
            console.error("Error fetching clustered precincts:", error);
        }
    };

    const fetchPrecincts = async (clustered_precinct_id) => {
        if (!clustered_precinct_id) {
            setPrecinctNumbers([]);
            return;
        }
        try {
            const response = await axiosInstance.get(`/precincts/${clustered_precinct_id}`);
            console.log("Fetched precincts:", response.data); // Log fetched precincts
            setPrecinctNumbers(response.data);
        } catch (error) {
            console.error("Error fetching precincts:", error);
        }
    };

    const fetchPositions = async () => {
        try {
            const response = await axiosInstance.get("/positions");
            setPositions(response.data);
        } catch (error) {
            console.error("Error fetching positions:", error);
        }
    };

    const fetchCandidates = async (selectedPosition) => {
        if (!selectedPosition) {
            setCandidates([]);
            return;
        }
        try {
            const response = await axiosInstance.get(`/candidates-filter?position_id=${selectedPosition}`);
            setCandidates(response.data);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };

        // Fetch votes based on filters
        // const fetchVotes = async () => {
        //     try {
        //         const response = await axiosInstance.get("/filterVotes", {
        //             params: {
        //                 region_id: regionId,
        //                 province_id: provinceId,
        //                 city_id: cityId,
        //                 barangay_id: barangayId,
        //                 precinct_num_id: precinctNumId,
        //                 clustered_precinct_id: clusteredPrecinctId,
        //                 position_id: selectedPosition
        //             }
        //         });
        //         setVotes(response.data.votes); // Update the votes with the response
        //     } catch (error) {
        //         console.error("Error fetching votes:", error);
        //     }
        // };

        // const fetchVotes = async () => {
        //     console.log("Fetching votes with precinctNumId:", precinctNumId); // Log the value
        //     try {
        //         const response = await axiosInstance.get("/filterVotes", {
        //             params: {
        //                 region_id: regionId,
        //                 province_id: provinceId,
        //                 city_id: cityId,
        //                 barangay_id: barangayId,
        //                 precinct_num_id: precinctNumId,
        //                 clustered_precinct_id: clusteredPrecinctId,
        //                 position_id: selectedPosition
        //             }
        //         });
        //         setVotes(response.data.votes); // Update the votes with the response
        //     } catch (error) {
        //         console.error("Error fetching votes:", error);
        //     }
        // };

    useEffect(() => {
        fetchRegions();
        fetchPositions();
    }, []);
    
    // useEffect(() => {
    //     if (precinctNumId) {
    //         fetchVotes();
    //     }
    // }, [precinctNumId]);
    
    useEffect(() => {
        fetchProvince(regionId);
    }, [regionId]);

    useEffect(() => {
        fetchCities(provinceId);
    }, [provinceId]);

    useEffect(() => {
        fetchBarangays(cityId);
    }, [cityId]);

    useEffect(() => {
        fetchClusteredPrecincts(barangayId);
    }, [barangayId]);

    useEffect(() => {
        fetchPrecincts(clusteredPrecinctId);
    }, [clusteredPrecinctId]);

  

    useEffect(() => {
        fetchCandidates(selectedPosition);
    }, [selectedPosition]);

    // useEffect(() => {
    //     fetchVotes();
    // }, [regionId, provinceId, cityId, barangayId, clusteredPrecinctId, selectedPosition]);


    return {
        regions, provinces, cities, barangays, clusteredPrecincts, precinctNumbers, positions, candidates,
        regionId, setRegionId, provinceId, setProvinceId, cityId, setCityId, barangayId, setBarangayId,
        clusteredPrecinctId, setClusteredPrecinctId, precinctNumId, setPrecinctNumId, selectedPosition, setSelectedPosition,
        fetchProvince, fetchRegions, fetchCities, fetchBarangays, fetchClusteredPrecincts, fetchPrecincts, fetchCandidates
    };
};

export default useFilters;
