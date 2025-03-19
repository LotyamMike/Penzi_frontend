'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LocationAnalytics from './LocationAnalytics';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalUsers: number;
  activeMatches: number;
  messagesToday: number;
  successRate: number;
  dailyChange: {
    users: number;
    matches: number;
    messages: number;
    success: number;
  };
  charts: {
    timeline: {
      labels: string[];
      datasets: {
        users: number[];
        messages: number[];
        matches: number[];
      };
    };
    gender: {
      labels: string[];
      data: number[];
    };
    ageDistribution: {
      labels: string[];
      data: number[];
    };
  };
  rawData: {
    dailyStats: Array<{
      date: string;
      users: number;
      messages: number;
      matches: number;
    }>;
    genderStats: Array<{
      name: string;
      value: number;
    }>;
    ageStats: Array<{
      range: string;
      count: number;
    }>;
  };
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/penzi/dashboard/stats');
        setStats(response.data);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard data...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!stats) return <div className="p-6">No data available</div>;

  return (
    <div className="p-6">
      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`${
              activeTab === 'location'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
          >
            Location Analytics
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'overview' ? (
          <>
            <div className="space-y-6">
              <div className="max-w-7xl mx-auto">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Total Users */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalUsers}</p>
                    <p className="mt-1 text-sm text-green-600">
                      +{stats.dailyChange.users}% from yesterday
                    </p>
                  </div>
                  
                  {/* Active Matches */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-gray-600 text-sm font-medium">Active Matches</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.activeMatches}</p>
                    <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>
                      {stats.dailyChange.matches}% from yesterday
                    </p>
                  </div>
                  
                  {/* Messages Today */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-gray-600 text-sm font-medium">Messages Today</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.messagesToday}</p>
                    <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>
                      {stats.dailyChange.messages}% from yesterday
                    </p>
                  </div>
                  
                  {/* Success Rate */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-gray-600 text-sm font-medium">Success Rate</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.successRate}%</p>
                    <p className="mt-1 text-sm text-green-600">
                      +{stats.dailyChange.success}% from yesterday
                    </p>
                  </div>
                </div>

                {/* Gender Distribution */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-gray-900 text-lg font-medium mb-6 text-left">Gender Distribution</h3>
                  <div className="flex items-center space-x-20 justify-start pl-6">
                    <div className="flex flex-col items-center">
                      <div className="text-base font-medium text-blue-600 mb-2">Male</div>
                      <div className="text-8xl mb-3">👨</div>
                      <div className="flex flex-col items-center">
                        <div className="w-32 bg-gray-100 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.round((stats.charts.gender.data[0] / (stats.charts.gender.data[0] + stats.charts.gender.data[1])) * 100)}%` }}>
                          </div>
                        </div>
                        <span className="text-2xl font-semibold text-blue-600 mt-2">
                          {Math.round((stats.charts.gender.data[0] / (stats.charts.gender.data[0] + stats.charts.gender.data[1])) * 100)}%
                        </span>
                        <span className="text-sm text-gray-500 mt-1">({stats.charts.gender.data[0]})</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div style={{ color: '#ec4899' }} className="text-base font-medium mb-2">Female</div>
                      <div className="text-8xl mb-3">👱‍♀️</div>
                      <div className="flex flex-col items-center">
                        <div className="w-32 bg-gray-100 rounded-full h-2">
                          <div 
                            style={{ 
                              backgroundColor: '#ec4899',
                              width: `${Math.round((stats.charts.gender.data[1] / (stats.charts.gender.data[0] + stats.charts.gender.data[1])) * 100)}%` 
                            }} 
                            className="h-2 rounded-full"
                          >
                          </div>
                        </div>
                        <span style={{ color: '#ec4899' }} className="text-2xl font-semibold mt-2">
                          {Math.round((stats.charts.gender.data[1] / (stats.charts.gender.data[0] + stats.charts.gender.data[1])) * 100)}%
                        </span>
                        <span style={{ color: '#ec4899' }} className="text-sm mt-1">({stats.charts.gender.data[1]})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <LocationAnalytics />
        )}
      </div>
    </div>
  );
} 