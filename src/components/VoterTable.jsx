import { useState, useEffect } from "react";
import {
    fetchVoters, fetchCities, fetchBarangays, fetchPrecincts, saveVoter, deleteVoter
} from "../services/voterService";
import VoterTable from "../components/VoterTable";
import VoterForm from "../components/VoterForm";

const Voters = () => {
    const [voters, setVoters] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [precincts, setPrecincts] = useState([]);
    const [voter, setVoter] = useState({
        voter_name: "",
        city_id: "",
        barangay_id: "",
        precinct_num_id: "",
        voter_status: "1",
    });
    const [showModal, setShowModal] = useState(false);

    // Load voters & cities on mount
    useEffect(() => {
        fetchVoters().then(setVoters);
        fetchCities().then(setCities);
    }, []);

    // Load barangays when city changes
    useEffect(() => {
        if (voter.city_id) {
            fetchBarangays(voter.city_id).then(setBarangays);
        } else {
            setBarangays([]);
        }
    }, [voter.city_id]);

    // Load precincts when barangay changes
    useEffect(() => {
        if (voter.barangay_id) {
            fetchPrecincts(voter.barangay_id).then(setPrecincts);
        } else {
            setPrecincts([]);
        }
    }, [voter.barangay_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVoter(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await saveVoter(voter);
        setShowModal(false);
        fetchVoters().then(setVoters);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this voter?")) {
            await deleteVoter(id);
            fetchVoters().then(setVoters);
        }
    };

    const handleEdit = (voter) => {
        setVoter(voter);
        setShowModal(true);
    };

    return (
        <div className="p-4">
            <button onClick={() => { setShowModal(true); setVoter({ voter_name: "", city_id: "", barangay_id: "", precinct_num_id: "", voter_status: "1" }); }}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add Voter
            </button>

            <VoterTable voters={voters} precincts={precincts} onEdit={handleEdit} onDelete={handleDelete} />

            {showModal && (
                <VoterForm
                    voter={voter}
                    cities={cities}
                    barangays={barangays}
                    precincts={precincts}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default Voters;
