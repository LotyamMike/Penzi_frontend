'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface LocationData {
  topCounties: {
    county: string;
    userCount: number;
    messageCount: number;
  }[];
  countyDistribution: {
    county: string;
    count: number;
  }[];
  popularTowns: {
    town: string;
    county: string;
    count: number;
  }[];
}

export default function LocationAnalytics() {
  const [data, setData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/location-analytics');
        console.log('Location data:', response.data); // Debug log
        setData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching location data:', error);
        setError('Failed to load location data');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  if (loading) return <div>Loading location data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>No location data available</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Active Counties */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Active Counties</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">County</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.topCounties.map((county, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{county.county}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{county.userCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{county.messageCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* County Distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Distribution by County</h3>
        <div className="space-y-4">
          {data.countyDistribution.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-sm text-gray-600 w-24">{item.county}</span>
              <div className="flex-1 mx-4">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{
                      width: `${(item.count / Math.max(...data.countyDistribution.map(i => i.count))) * 100}%`
                    }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Towns */}
      <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Towns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.popularTowns.map((town, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900">{town.town}</h4>
              <p className="text-sm text-gray-500">{town.county} County</p>
              <p className="text-sm text-gray-600 mt-1">{town.count} users</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
