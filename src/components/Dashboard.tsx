'use client';
import { useState, useEffect } from 'react';
import UserList from './UserList';
import MessageList from './MessageList';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Simple SVG Icons components
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
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
    gender: {
      labels: string[];
      data: number[];
    };
    ageDistribution: any;  // Add proper type if needed
    timeline: any;         // Add proper type if needed
  };
}

interface GenderItem {
  gender: string;
  count: number;
}

interface LocationStats {
  countyDistribution: Array<{ county: string; count: number }>;
  topCounties: Array<{ county: string; userCount: number; messageCount: number }>;
  popularTowns: Array<{ town: string; county: string; count: number }>;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/penzi/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await response.json();
        console.log('Fetched stats:', data);
        setStats(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <p className="ml-3 text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const genderDistribution: GenderItem[] = stats.charts.gender.labels.map((label: string, index: number) => ({
    gender: label,
    count: stats.charts.gender.data[index]
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm">
        <TabButton
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
          icon={<HomeIcon />}
        >
          Dashboard
        </TabButton>
        <TabButton
          active={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
          icon={<UsersIcon />}
        >
          Users
        </TabButton>
        <TabButton
          active={activeTab === 'messages'}
          onClick={() => setActiveTab('messages')}
          icon={<ChatIcon />}
        >
          Messages
        </TabButton>
        <TabButton
          active={activeTab === 'locations'}
          onClick={() => setActiveTab('locations')}
          icon={<MapIcon />}
        >
          Locations
        </TabButton>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <DashboardContent />}
      {activeTab === 'users' && <UserList />}
      {activeTab === 'messages' && <MessageList />}
      {activeTab === 'locations' && <LocationAnalytics />}
    </div>
  );
}

// Styled Tab Button Component
interface TabButtonProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
}

const TabButton = ({ active, children, onClick, icon }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`
      flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-sm
      transition-all duration-200 ease-in-out
      ${active 
        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
        : 'text-gray-600 hover:bg-gray-50'
      }
    `}
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{children}</span>
  </button>
);

// Icons (reuse from your Navigation component)
const HomeIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

// Simple Map Icon component
const MapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

// Content Components
const DashboardContent = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/penzi/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await response.json();
        console.log('Fetched stats:', data);
        setStats(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return null;

  const genderDistribution: GenderItem[] = stats.charts.gender.labels.map((label: string, index: number) => ({
    gender: label,
    count: stats.charts.gender.data[index]
  }));

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <p className="ml-3 text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            change={stats.dailyChange.users}
            icon={<UserIcon />}
            color="blue"
          />
          <StatCard
            title="Active Matches"
            value={stats.activeMatches}
            change={stats.dailyChange.matches}
            icon={<HeartIcon />}
            color="pink"
          />
          <StatCard
            title="Messages Today"
            value={stats.messagesToday}
            change={stats.dailyChange.messages}
            icon={<MessageIcon />}
            color="purple"
          />
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            change={stats.dailyChange.success}
            icon={<StarIcon />}
            color="yellow"
          />
        </div>

        {/* Gender Distribution */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Gender Distribution</h3>
            <div className="grid grid-cols-2 gap-4">
              {genderDistribution.map((item) => (
                <div 
                  key={item.gender}
                  className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.gender === 'Male' ? '👨' : '👩'}</span>
                    <span className="text-sm text-gray-500">
                      {((item.count / genderDistribution.reduce((acc, curr) => acc + curr.count, 0)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {item.count}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {item.gender}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  change: number;
  icon: React.ReactNode;
  color: 'blue' | 'pink' | 'purple' | 'yellow';
}

const StatCard = ({ title, value, change, icon, color }: StatCardProps) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      icon: 'text-blue-500',
      gradient: 'from-blue-50 to-white'
    },
    pink: {
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      border: 'border-pink-100',
      icon: 'text-pink-500',
      gradient: 'from-pink-50 to-white'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      icon: 'text-purple-500',
      gradient: 'from-purple-50 to-white'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      border: 'border-yellow-100',
      icon: 'text-yellow-500',
      gradient: 'from-yellow-50 to-white'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`rounded-2xl shadow-lg border ${classes.border} overflow-hidden transition-transform duration-300 hover:scale-105`}>
      <div className={`p-6 bg-gradient-to-br ${classes.gradient}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 text-sm font-semibold">{title}</h3>
          <div className={`${classes.icon} bg-white p-2 rounded-lg shadow-sm`}>
            {icon}
          </div>
        </div>
        <div className="flex items-baseline">
          <p className={`text-3xl font-bold ${classes.text}`}>{value}</p>
          <p className={`ml-2 flex items-baseline text-sm font-semibold ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="mr-1">{change > 0 ? '↑' : '↓'}</span>
            {Math.abs(change)}%
          </p>
        </div>
      </div>
    </div>
  );
};

const LocationAnalytics = () => {
  const [stats, setStats] = useState<LocationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/penzi/location-analytics');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Failed to load location statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Location Analytics</h2>
      </div>
      
      {/* Popular Towns */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Popular Towns</h3>
        </div>
        <div className="grid gap-4">
          {stats.popularTowns.map((item, index) => (
            <div 
              key={`${item.town}-${item.county}`}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-purple-600 font-bold shadow-sm">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium text-gray-800">{item.town}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.county})</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="text-sm font-semibold text-purple-600">{item.count}</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-white/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(item.count / Math.max(...stats.popularTowns.map(t => t.count))) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Counties */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Most Active Counties</h3>
        </div>
        <div className="grid gap-4">
          {stats.topCounties.map((item, index) => (
            <div 
              key={item.county}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-blue-600 font-bold shadow-sm">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-800">{item.county}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="text-sm text-blue-600">{item.userCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    <span className="text-sm text-indigo-600">{item.messageCount}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 w-full bg-white/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(item.userCount / Math.max(...stats.topCounties.map(c => c.userCount))) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 