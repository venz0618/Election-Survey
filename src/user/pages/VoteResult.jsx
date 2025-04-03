import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axiosInstance from "../../utils/axiosInstance";
import DataTable from "react-data-table-component";
import useFilters from "../../utils/useFilters";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VoteResult = () => {
  // Use the useFilters hook for managing filter state and fetching filter data
  const {
    regions, provinces, cities, barangays, clusteredPrecincts, precinctNumbers, positions, candidates,
    regionId, setRegionId, provinceId, setProvinceId, cityId, setCityId, barangayId, setBarangayId,
    clusteredPrecinctId, setClusteredPrecinctId, precinctNumId, setPrecinctNumId, selectedPosition, setSelectedPosition,
    fetchProvince, fetchRegions, fetchCities, fetchBarangays, fetchClusteredPrecincts, fetchPrecincts, fetchCandidates
  } = useFilters();

  const [stats, setStats] = useState({ total_voters: 0 });
  const [results, setResults] = useState([]);
  const [candidateTotals, setCandidateTotals] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");  // ✅ Add this line
  


  const candidateColorMap = {
    1: "#3498db", // Candidate 1 - Blue
    2: "#2ecc71", // Candidate 2 - Green
    4: "#e74c3c", // Candidate 3 - Red
    3: "#f1c40f", // Candidate 4 - Yellow
    5: "#9b59b6", // Candidate 5 - Purple
};

// Function to fetch votes based on the precinct number
const fetchVotes = async () => {
  setIsLoading(true);
  try {
    const params = {
      precinct_num_id: precinctNumId, // Pass the precinct number filter
    };

    const response = await axiosInstance.get('/filter-votes', { params });
    setVotes(response.data.votes); // Assuming response data contains the 'votes' array
  } catch (error) {
    console.error('Error fetching voters:', error);
  } finally {
    setIsLoading(false);
  }
};

// Filter the votes based on the precinct number selected
// const filterVotesByPrecinct = () => {
//   const result = votes.filter(vote => vote.precinct_num === precinctNumId);
//   setFilteredVotes(result); // Set the filtered votes
// };

// Fetch votes whenever the precinct number changes
useEffect(() => {
  if (precinctNumId) {
    fetchVotes(); // Fetch data if precinct number exists
  }
}, [precinctNumId]); // Dependency array: Re-run when precinctNumId changes

// Filter votes after they are fetched
// useEffect(() => {
//   if (votes.length > 0) {
//     filterVotesByPrecinct(); // Filter votes after data is fetched
//   }
// }, [votes, precinctNumId]); // Re-run when votes or precinctNumId change





  // Fetch stats on initial load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/dashboard-stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const fetchFilteredResults = async () => {
    setIsLoading(true);
    try {
      const params = {
        region_id: regionId,
        province_id: provinceId,
        city_id: cityId,
        barangay_id: barangayId,
        clustered_precinct_id: clusteredPrecinctId,
        precinct_num_id: precinctNumId,
        position_id: selectedPosition,
      };

      // Remove any filters with empty values to avoid sending them in the request
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const res = await axiosInstance.get('/filterVotes', { params });
      setResults(res.data.votes);

      // Flatten the results into an array for candidateTotals
      const candidateData = [];
      Object.keys(res.data.votes).forEach(position => {
        res.data.votes[position].forEach(candidate => {
          candidateData.push(candidate);
        });
      });
    

   // Function to fetch all votes

   
console.log(candidateData);  // Log to verify the output


      setCandidateTotals(candidateData);

      const labels = candidateData.map(c => c.candidate_name);
      const data = candidateData.map(c => c.total_votes);

      setChartData({
        labels,
        datasets: [{
          label: "Total Votes",
          data,
          backgroundColor: labels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`)
        }],
      });
    } catch (error) {
      console.error('Error fetching filtered results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredResults(); // Call the function to fetch results whenever the filters change
  }, [regionId, provinceId, cityId, barangayId, clusteredPrecinctId, precinctNumId, selectedPosition]); // Include all the filters in the dependency array

  

  // Calculate total votes
  const totalVotes = candidateTotals.reduce((sum, candidate) => sum + candidate.total_votes, 0);
  {isLoading && <div className="text-center">Loading results...</div>}

  const columns = [
    {
        name: "Voters Name",
        selector: (row) => row.voter_name,
        sortable: true,
    },

    {
        name: "Candidates Name",
        selector: (row) => row.candidate_name,
        sortable: true,
    },
    {
      name: "Precinct Number",
      selector: (row) => row.precinct_num,
      sortable: true,
  },
   
];

 // ✅ Filter voters based on search input
 const filteredBarangay = votes.filter((vote) =>
    vote.candidate_name.toLowerCase().includes(searchQuery.toLowerCase())
);
  

  return (
    
    <div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-gray-800 mb-6">Vote Results Dashboard</h1>

  {/* Filter Controls */}
  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-xl font-semibold mb-4">Filters</h2>
    {/* Here, wrapping the filter controls in a grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      

      {/* Region Filter */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Region</label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
        >
          <option value="">All Regions</option>
          {regions.map(region => (
            <option key={region.id} value={region.id}>{region.region_name}</option>
          ))}
        </select>
      </div>

      {/* Province Filter */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Province</label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          value={provinceId}
          onChange={(e) => setProvinceId(e.target.value)}
          disabled={!regionId}
        >
          <option value="">All Provinces</option>
          {provinces.map(province => (
            <option key={province.id} value={province.id}>{province.province_name}</option>
          ))}
        </select>
      </div>

      {/* City/Municipality Filter */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">City/Municipality</label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          disabled={!provinceId}
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>{city.city_name}</option>
          ))}
        </select>
      </div>

      {/* Barangay Filter */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Barangay</label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          value={barangayId}
          onChange={(e) => setBarangayId(e.target.value)}
          disabled={!cityId}
        >
          <option value="">All Barangays</option>
          {barangays.map(barangay => (
            <option key={barangay.id} value={barangay.id}>{barangay.barangay_name}</option>
          ))}
        </select>
      </div>

      {/* Clustered Precinct Filter */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Clustered Precinct</label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          value={clusteredPrecinctId}
          onChange={(e) => setClusteredPrecinctId(e.target.value)}
          disabled={!barangayId}
        >
          <option value="">All Precincts</option>
          {clusteredPrecincts.map(precinct => (
            <option key={precinct.id} value={precinct.id}>{precinct.clustered_precinct_num}</option>
          ))}
        </select>
      </div>

      {/* Precinct Number Filter */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Precinct Number</label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          value={precinctNumId}
          onChange={(e) => setPrecinctNumId(e.target.value)}
          disabled={!clusteredPrecinctId}
        >
          <option value="">All Numbers</option>
          {precinctNumbers.map(number => (
            <option key={number.id} value={number.id}>{number.precinct_num}</option>
          ))}
        </select>
      </div>

         {/* Position Filter */}
         <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Position</label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
        >
          <option value="">All Positions</option>
          {positions.map((position) => (
            <option key={position.id} value={position.id}>
              {position.position_type}
            </option>
          ))}
        </select>
      </div>
    </div> {/* End of Grid */}
  </div>

  {/* Candidate Totals Display */}
  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
  <h2 className="text-xl font-semibold mb-4">Candidate Vote Totals</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {candidateTotals.map((candidate, index) => {
    const percentage = totalVotes > 0 ? ((candidate.total_votes / stats.total_voters) * 100).toFixed(2) : 0;

    // Get color for candidate from the color map based on candidate's id
    const candidateColor = candidateColorMap[candidate.id] || '#bdc3c7';  // Default to gray if no match

    return (
      <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
        {/* Candidate Name */}
        <h3 className="text-lg font-semibold">{candidate.candidate_name}</h3>
        <h4>{candidate.position || "Unknown Position"}</h4>





        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
              {percentage}%
            </span>
          </div>
          <div className="flex mb-2 items-center justify-between">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full"
                style={{ width: `${percentage}%`, backgroundColor: candidateColor }} // Set the color dynamically
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>

  
</div>



  {/* Results Chart */}
  {/* <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-xl font-semibold mb-4">Vote Distribution</h2>
    {chartData && (
      <div className="h-96">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Vote Totals by Candidate',
              },
            },
          }}
        />
      </div>
    )}
  </div> */}

<div className="bg-white p-6 rounded-lg shadow-md mb-8">
  <h2 className="text-xl font-semibold mb-4">Vote Distribution </h2>
  {chartData && (
    <div className="h-96">
      <Bar
        data={{
          ...chartData,
          datasets: chartData.datasets.map((dataset) => ({
            ...dataset,
            backgroundColor: dataset.data.map((vote, idx) => {
              const candidate = candidateTotals[idx];
              const candidateColor = candidateColorMap[candidate.id] || '#bdc3c7';  // Default gray if no match
              return candidateColor;
            }),
          })),
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Vote Totals by Candidate',
            },
          },
        }}
      />
    </div>
  )}
</div>


  {/* Results Table */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Detailed Results</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
           
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Names</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Votes</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage {stats.total_voters}</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {candidateTotals.map((candidate, index) => (
            <tr key={index} className="hover:bg-gray-50">

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.candidate_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.total_votes}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {totalVotes > 0 ? ((candidate.total_votes / stats.total_voters) * 100).toFixed(2) : 0}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>


  {/* Display Votes in a Table */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Detailed Results</h2>
    <div className="overflow-x-auto">
     
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
    </div>
  </div>
</div>

  );
};

export default VoteResult;
