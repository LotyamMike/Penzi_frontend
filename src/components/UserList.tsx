'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  age: number;
  gender: string;
  county: string;
  town: string;
  phone_number: string;
  created_at: string;
  last_active_at?: string;
  details: {
    education: string | null;
    profession: string | null;
    marital_status: string | null;
    religion: string | null;
    ethnicity: string | null;
  };
  description: string | null;
}

interface Message {
  id: number;
  message_text: string;
  message_direction: 'Incoming' | 'Outgoing';
  created_at: string;
  user_id: number;
}

interface ApiResponse {
  users: User[];
}

interface MessageResponse {
  messages: Message[];
}

interface Analytics {
  registrationTrends: {
    date: string;
    count: number;
  }[];
  activeUsers: {
    date: string;
    daily: number;
    weekly: number;
  }[];
  messageStats: {
    date: string;
    sent: number;
    received: number;
  }[];
  genderDistribution: {
    gender: string;
    count: number;
  }[];
}

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal = ({ user, isOpen, onClose }: UserDetailsModalProps) => {
  const [fullUserDetails, setFullUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      console.log('Fetching details for user:', user.id);
      
      fetch(`http://localhost:5001/api/penzi/users/${user.id}`)
        .then(res => res.json())
        .then(data => {
          console.log('Received data:', data); // Debug log
          setFullUserDetails(data);
        })
        .catch(err => {
          console.error('Error:', err);
          setError('Failed to load user details');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, user]);

  // Simplified status check
  const isActive = Boolean(fullUserDetails?.last_active_at);
  console.log('Status check:', { 
    last_active_at: fullUserDetails?.last_active_at,
    isActive 
  });

  if (!isOpen || !user) return null;

  // Add null check for fullUserDetails
  if (!fullUserDetails) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto animate-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
          </div>
          {/* Simplified status indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium text-gray-600">
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user details...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        ) : fullUserDetails && (
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <InfoItem label="Name" value={fullUserDetails.name} />
                <InfoItem label="Phone" value={fullUserDetails.phone_number} />
                <InfoItem label="Age" value={`${fullUserDetails.age} years`} />
                <InfoItem label="Gender" value={fullUserDetails.gender} />
                <InfoItem label="Location" value={`${fullUserDetails.town}, ${fullUserDetails.county}`} />
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Additional Details
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <InfoItem label="Education" value={fullUserDetails.details?.education} />
                <InfoItem label="Profession" value={fullUserDetails.details?.profession} />
                <InfoItem label="Marital Status" value={fullUserDetails.details?.marital_status} />
                <InfoItem label="Religion" value={fullUserDetails.details?.religion} />
                <InfoItem label="Ethnicity" value={fullUserDetails.details?.ethnicity} />
              </div>
            </div>

            {/* Description */}
            {fullUserDetails.description && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                  Description
                </h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {fullUserDetails.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for info items
const InfoItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-gray-900">{value || 'Not provided'}</p>
  </div>
);

// Add this to your CSS or tailwind.config.js
const styles = {
  '.animate-modal': {
    animation: 'modal-appear 0.3s ease-out'
  },
  '@keyframes modal-appear': {
    '0%': {
      opacity: '0',
      transform: 'scale(0.95)'
    },
    '100%': {
      opacity: '1',
      transform: 'scale(1)'
    }
  }
};

const UserMessagesModal = ({ user, messages, onClose }: { 
  user: User; 
  messages: Message[];
  onClose: () => void;
}) => (
  <div 
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <div 
      className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{user.name}'s Messages</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">✕</button>
      </div>
      <div className="space-y-4">
        {messages.map((message) => {
          const isFromUser = message.message_direction.toLowerCase() === 'incoming';
          const formattedText = message.message_text.replace(/¶/g, '\n');
          
          return (
            <div 
              key={message.id}
              className={`p-4 rounded-lg ${
                isFromUser
                  ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500'
                  : 'bg-gradient-to-r from-pink-50 to-pink-100 border-l-4 border-pink-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className={`text-xs font-medium ${
                    isFromUser ? 'text-purple-600' : 'text-pink-600'
                  } mb-1 block`}>
                    {isFromUser 
                      ? '👤 From User' 
                      : '💬 From System'}
                  </span>
                  <p className="text-gray-900 whitespace-pre-line break-words">
                    {formattedText}
                  </p>
                </div>
                <span className="text-xs text-gray-500 ml-2 shrink-0">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <p className="text-gray-500 text-center py-4">No messages found</p>
        )}
      </div>
    </div>
  </div>
);

// Remove the heroicons import and use this SVG component
const DownloadIcon = () => (
  <svg 
    className="w-5 h-5 mr-2" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Starting user fetch...');
      const response = await axios.get('http://localhost:5001/api/penzi/users');
      console.log('User response:', response.data);
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error('Fetch error details:', error);
      if (axios.isAxiosError(error)) {
        console.error('Request URL:', error.config?.url);
      }
    } finally {
      setLoading(false);  // This ensures loading is set to false even if there's an error
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUserMessages = async (userId: number) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/penzi/users/${userId}/messages`);
      setUserMessages(response.data.messages);
      setSelectedUserId(userId);
    } catch (err) {
      console.error('Failed to fetch user messages:', err);
      setUserMessages([]);
    }
  };

  const handleUserClick = async (user: User) => {
    try {
      console.log('Viewing messages for user:', {
        id: user.id,
        name: user.name
      });
      
      setSelectedUser(user);
      const response = await axios.get(`http://localhost:5001/api/penzi/users/${user.id}/messages`);
      
      console.log('API Response:', response.data);
      
      if (response.data.messages && response.data.messages.length > 0) {
        console.log(`Found ${response.data.messages.length} messages`);
        setUserMessages(response.data.messages);
        setShowMessages(true);  // Make sure modal shows
      } else {
        console.log('No messages found in response');
        setUserMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
      }
      setUserMessages([]);
    }
  };

  // Search and filter function
  useEffect(() => {
    let result = users;
    
    // Search by name
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by gender
    if (filterGender !== 'all') {
      result = result.filter(user => 
        user.gender.toLowerCase() === filterGender.toLowerCase()
      );
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, filterGender]);

  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/penziusers/export');
      if (!response.ok) throw new Error('Export failed');
      
      // Get filename from Content-Disposition header or use default
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'users.csv';
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      // Add error handling UI if needed
    }
  };

  const viewMessages = async (userId: number) => {
    try {
      console.log('Attempting to fetch messages for user:', userId);
      // Log the exact URL being called
      const url = `http://localhost:5001/api/penzi/users/${userId}/messages`;
      console.log('Requesting URL:', url);
      
      const response = await axios.get(url);
      console.log('Full API Response:', response);
      console.log('Messages data:', response.data);
      
      if (response.data.messages) {
        console.log('Number of messages found:', response.data.messages.length);
        setUserMessages(response.data.messages);
        setSelectedUserId(userId);
        setShowMessages(true);
      } else {
        console.log('No messages array in response');
        setUserMessages([]);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      setUserMessages([]);
    }
  };

  const viewUserDetails = async (user: User) => {
    try {
      console.log('View Details clicked for user:', user);
      
      const url = `http://localhost:5001/api/penzi/users/${user.id}`;
      console.log('Fetching from URL:', url);
      
      const response = await axios.get(url);
      console.log('Response received:', response);
      
      if (response.data) {
        console.log('Setting viewing user with data:', response.data);
        setViewingUser(response.data);
        setShowUserDetails(true);
      } else {
        console.error('No data in response');
      }
    } catch (error) {
      console.error('Error in viewUserDetails:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isIncoming = message.message_direction === 'Incoming';
    return (
      <div key={message.id} className="flex flex-col items-start mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className={`
            w-2 h-2 rounded-full
            ${isIncoming ? 'bg-blue-600' : 'bg-green-600'}
          `} />
          <div className={`
            text-sm font-medium
            ${isIncoming ? 'text-blue-600' : 'text-green-600'}
          `}>
            {isIncoming ? 'User Message' : 'System Response'}
          </div>
        </div>
        <div className={`
          p-4 rounded-lg shadow-sm w-full
          ${isIncoming 
            ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600' 
            : 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-600'}
        `}>
          <div className="text-gray-800">
            {message.message_text}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {new Date(message.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users List</h2>
        
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-colors duration-300 transform hover:scale-105"
        >
          <DownloadIcon />
          Export Users
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Grid */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100/50 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                {user.name[0]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.phone_number}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleUserClick(user)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-colors duration-200"
              >
                View Messages
              </button>
              <button 
                onClick={() => setSelectedUserForDetails(user)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* User Details Modal */}
      <UserDetailsModal 
        user={selectedUserForDetails}
        isOpen={!!selectedUserForDetails}
        onClose={() => setSelectedUserForDetails(null)}
      />

      {/* Messages Modal */}
      {selectedUser && userMessages && (
        <UserMessagesModal
          user={selectedUser}
          messages={userMessages}
          onClose={() => {
            setSelectedUser(null);
            setUserMessages([]);
          }}
        />
      )}

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}