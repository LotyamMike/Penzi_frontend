'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  user_name: string;
  direction: string;
  text: string;
  created_at: string;
}

interface ApiResponse {
  messages: Message[];
}

const API_URL = 'http://localhost:5001/api/penzi/messages';  // Ensure this exact URL is used

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/penzi/messages', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors'  // Explicitly set CORS mode
        });
        const data = await response.json();
        console.log('Fetch response:', data);
        setMessages(data.messages);
        setError(null);
      } catch (error: any) {
        console.error('Error:', error);
        setError(`Failed to load messages: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Message History
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {messages.map((message) => (
            <li key={message.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {message.user_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      message.direction === 'incoming'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {message.direction}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{message.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
