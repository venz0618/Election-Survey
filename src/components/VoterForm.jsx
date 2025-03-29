const VoterForm = ({ voter, cities, barangays, precincts, onChange, onSubmit, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">{voter.id ? "Edit Voter" : "Add New Voter"}</h2>
                <form onSubmit={onSubmit}>
                    <label className="block mb-2">Voter Name:</label>
                    <input type="text" className="border p-2 w-full mb-3" value={voter.voter_name} onChange={onChange} name="voter_name" required />

                    <label className="block mb-2">City:</label>
                    <select className="border p-2 w-full mb-3" value={voter.city_id} onChange={onChange} name="city_id">
                        <option value="">Select City</option>
                        {cities.map(city => <option key={city.id} value={city.id}>{city.city_name}</option>)}
                    </select>

                    <label className="block mb-2">Barangay:</label>
                    <select className="border p-2 w-full mb-3" value={voter.barangay_id} onChange={onChange} name="barangay_id">
                        <option value="">Select Barangay</option>
                        {barangays.map(b => <option key={b.id} value={b.id}>{b.barangay_name}</option>)}
                    </select>

                    <label className="block mb-2">Precinct Number:</label>
                    <select className="border p-2 w-full mb-3" value={voter.precinct_num_id} onChange={onChange} name="precinct_num_id">
                        <option value="">Select Precinct</option>
                        {precincts.map(p => <option key={p.id} value={p.id}>{p.precinct_num}</option>)}
                    </select>

                    <label className="block mb-2">Voter Status:</label>
                    <select className="border p-2 w-full mb-3" value={voter.voter_status} onChange={onChange} name="voter_status">
                        <option value="0">Inactive</option>
                        <option value="1">Active</option>
                    </select>

                    <div className="flex justify-end">
                        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{voter.id ? "Update" : "Add"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VoterForm;
