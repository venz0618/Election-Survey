import React, { useState, useEffect } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { Bar } from 'react-chartjs-2';
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

  
  // State for filters
  const [filters, setFilters] = useState({
    region: '',
    province: '',
    city: '',
    barangay: '',
    clusteredPrecinct: '',
    precinctNumber: ''
  });

  const [stats, setStats] = useState({ total_voters: 0 });
  const [options, setOptions] = useState({
    regions: [],
    provinces: [],
    cities: [],
    barangays: [],
    clusteredPrecincts: [],
    precinctNumbers: []
  });

  const [results, setResults] = useState([]);
  const [candidateTotals, setCandidateTotals] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch region options on mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionsRes = await axiosInstance.get('/region');
        setOptions(prev => ({ ...prev, regions: regionsRes.data }));
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    fetchRegions();
  }, []);

  // Handle filter changes and reset downstream filters
  const handleFilterChange = async (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };

    // Reset downstream filters
    const resetFilters = {
      region: ['province', 'city', 'barangay', 'clusteredPrecinct', 'precinctNumber'],
      province: ['city', 'barangay', 'clusteredPrecinct', 'precinctNumber'],
      city: ['barangay', 'clusteredPrecinct', 'precinctNumber'],
      barangay: ['clusteredPrecinct', 'precinctNumber'],
      clusteredPrecinct: ['precinctNumber']
    };

    if (resetFilters[filterType]) {
      resetFilters[filterType].forEach(f => newFilters[f] = '');
    }

    setFilters(newFilters);

    // Fetch options for the next level filter
    const endpoints = {
      region: '/provinces',
      province: '/cities',
      city: '/barangays',
      barangay: '/clustered-precincts',
      clusteredPrecinct: '/precinct-numbers'
    };

    if (endpoints[filterType] && value) {
      try {
        const res = await axiosInstance.get(`${endpoints[filterType]}?parent=${value}`);
        setOptions(prev => ({
          ...prev,
          [`${filterType}s`]: res.data
        }));
      } catch (error) {
        console.error(`Error fetching ${filterType} options:`, error);
      }
    }

    // Fetch results after updating the filter
    fetchFilteredResults(newFilters); // Call fetchFilteredResults to update the results
  };

  // Fetch filtered results based on selected filters
  const fetchFilteredResults = async (currentFilters) => {
    setIsLoading(true);  // Start loading
    try {
      // Build query params from non-empty filters
      const params = {};
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      // Only fetch results if there are selected filters
      if (Object.keys(params).length > 0) {
        const res = await axiosInstance.get('/results', { params });
        setResults(res.data);

        const candidateData = res.data.total_votes_per_candidate || [];
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
      } else {
        // If no filter is selected, reset the results
        setResults([]);
      }
    } catch (error) {
      console.error('Error fetching filtered results:', error);
    } finally {
      console.log("Setting isLoading to false");
      setIsLoading(false);  // Stop loading
    }
  };

  // Calculate total votes
  const totalVotes = candidateTotals.reduce((sum, candidate) => sum + candidate.total_votes, 0);


  

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Vote Results Dashboard</h1>
      
      {/* Filter Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Region</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="">All Regions</option>
              {options.regions.map(region => (
                <option key={region.id} value={region.id}>{region.region_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Province</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              value={filters.province}
              onChange={(e) => handleFilterChange('province', e.target.value)}
              disabled={!filters.region}
            >
              <option value="">All Provinces</option>
              {options.provinces.map(province => (
                <option key={province.id} value={province.id}>{province.province_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">City/Municipality</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              disabled={!filters.province}
            >
              <option value="">All Cities</option>
              {options.cities.map(city => (
                <option key={city.id} value={city.id}>{city.city_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Barangay</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              value={filters.barangay}
              onChange={(e) => handleFilterChange('barangay', e.target.value)}
              disabled={!filters.city}
            >
              <option value="">All Barangays</option>
              {options.barangays.map(barangay => (
                <option key={barangay.id} value={barangay.id}>{barangay.barangay_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Clustered Precinct</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              value={filters.clusteredPrecinct}
              onChange={(e) => handleFilterChange('clusteredPrecinct', e.target.value)}
              disabled={!filters.barangay}
            >
              <option value="">All Precincts</option>
              {options.clusteredPrecincts.map(precinct => (
                <option key={precinct.id} value={precinct.id}>{precinct.clustered_precinct_num}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Precinct Number</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              value={filters.precinctNumber}
              onChange={(e) => handleFilterChange('precinctNumber', e.target.value)}
              disabled={!filters.clusteredPrecinct}
            >
              <option value="">All Numbers</option>
              {options.precinctNumbers.map(number => (
                <option key={number.id} value={number.id}>{number.precinct_num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

     {/* Candidate Totals Display */}
     <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Candidate Vote Totals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {candidateTotals.map((candidate, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{candidate.candidate_name}</h3>
              <p className="text-gray-600">{candidate.total_votes} votes</p>
              <p className="text-sm text-gray-500">
                {totalVotes > 0 ? ((candidate.total_votes / totalVotes) * 100).toFixed(2) : 0}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Results Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
      </div>

      {/* Results Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Detailed Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precinct</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Names</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Votes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage {stats.total_voters}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidateTotals.map((candidate, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.precinctNumber}</td>
                 
                  {Object.keys(candidate || {}).map(key => (
                      <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate[key] || 0}
                      </td>
                    ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {totalVotes > 0 ? ((candidate.total_votes / stats.total_voters) * 100).toFixed(2) : 0}%
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VoteResult;

