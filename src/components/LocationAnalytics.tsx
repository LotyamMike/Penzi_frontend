'use client';
import { useState, useEffect } from 'react';

interface LocationStats {
  countyDistribution: {
    county: string;
    count: number;
  }[];
  topCounties: {
    county: string;
    userCount: number;
    messageCount: number;
  }[];
  popularTowns: {
    town: string;
    county: string;
    count: number;
  }[];
}

export default function LocationAnalytics() {
  const [stats, setStats] = useState<LocationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/penzi/location-analytics');
        if (!response.ok) throw new Error('Failed to fetch location statistics');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load location statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading location statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-600 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  // Calculate total users for percentages
  const totalUsers = stats.countyDistribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Analytics</h2>
        <p className="text-gray-600">User distribution across counties and towns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Counties */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Counties</h3>
          <div className="space-y-4">
            {stats.topCounties.map((county, index) => (
              <div key={county.county} className="flex items-center">
                <span className="w-8 text-lg font-bold text-blue-600">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700">{county.county}</span>
                    <div className="text-right">
                      <span className="text-blue-600 font-semibold">{county.userCount}</span>
                      <span className="text-gray-400 text-sm ml-2">({county.messageCount} messages)</span>
                    </div>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(county.userCount / totalUsers) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Towns */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Popular Towns</h3>
          <div className="space-y-4">
            {stats.popularTowns.map((town, index) => (
              <div key={`${town.town}-${town.county}`} className="flex items-center">
                <span className="w-8 text-lg font-bold text-purple-600">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <div>
                      <span className="font-medium text-gray-700">{town.town}</span>
                      <span className="text-gray-400 text-sm ml-2">({town.county})</span>
                    </div>
                    <span className="text-purple-600 font-semibold">{town.count}</span>
                  </div>
                  <div className="w-full bg-purple-100 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(town.count / totalUsers) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
