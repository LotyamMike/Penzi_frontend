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
  created_at: string;
  details?: {
    education: string | null;
    profession: string | null;
    marital_status: string | null;
    religion: string | null;
    ethnicity: string | null;
  } | null;
  description?: string | null;
}

interface Message {
  id: number;
  direction: 'Incoming' | 'Outgoing';
  text: string;
  created_at: string;
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

const UserDetailsModal = ({ user, onClose }: { user: User; onClose: () => void }) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <div 
      className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{user.name}'s Profile</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-2"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="text-gray-900">{user.age} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="text-gray-900">{user.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-gray-900">{user.town}, {user.county}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined On</p>
              <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        {user.details && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Additional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Education</p>
                <p className="text-gray-900">{user.details.education || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Profession</p>
                <p className="text-gray-900">{user.details.profession || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Marital Status</p>
                <p className="text-gray-900">{user.details.marital_status || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Religion</p>
                <p className="text-gray-900">{user.details.religion || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ethnicity</p>
                <p className="text-gray-900">{user.details.ethnicity || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Self Description */}
        {user.description && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Self Description</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{user.description}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const UserMessagesModal = ({ user, messages, onClose }: { 
  user: User; 
  messages: Message[];
  onClose: () => void;
}) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <div 
      className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{user.name}'s Messages</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-2"
        >
          ✕
        </button>
      </div>
      <div className="space-y-4">
        {messages.map((message) => {
          const isIncoming = message.direction === 'Incoming';
          
          return (
            <div 
              key={message.id}
              className={`p-4 rounded-lg ${
                isIncoming
                  ? 'bg-blue-50 mr-4 border-l-4 border-blue-500'
                  : 'bg-green-50 ml-4 border-l-4 border-green-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-xs font-medium ${
                    isIncoming ? 'text-blue-600' : 'text-green-600'
                  } mb-1 block`}>
                    {isIncoming ? '👤 Message from User' : '💬 Message from System'}
                  </span>
                  <p className="text-gray-900">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isIncoming ? '→ User to System' : '← System to User'}
              </p>
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

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get<{ users: User[] }>('http://localhost:5001/api/users');
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUserMessages = async (userId: number) => {
    try {
      const { data } = await axios.get<{ messages: Message[] }>(
        `http://localhost:5001/api/users/${userId}/messages`
      );
      setUserMessages(data.messages);
    } catch (err) {
      console.error('Failed to fetch user messages:', err);
      setUserMessages([]);
    }
  };

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);
    await fetchUserMessages(user.id);
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

  const handleExportCSV = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users/export', {
        responseType: 'blob'  // Important for file download
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export users:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6 p-4">
      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Export to CSV
          </button>
        </div>
      </div>

      {/* User List Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">
                    {user.age} years • {user.gender}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {user.town}, {user.county}
                  </div>
                  {user.details && (
                    <div className="text-sm text-gray-500">
                      {user.details.education} • {user.details.profession}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button 
                    onClick={() => setViewingUser(user)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleUserClick(user)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Messages
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {viewingUser && (
        <UserDetailsModal 
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}

      {/* Messages Modal */}
      {selectedUser && (
        <UserMessagesModal 
          user={selectedUser}
          messages={userMessages}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}