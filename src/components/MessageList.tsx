'use client';
import React, { useEffect, useState } from 'react';

interface Message {
  id: number;
  message_text: string;
  message_direction: 'Incoming' | 'Outgoing';
  created_at: string;
  user_id: number;
}

function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/penzi/messages');
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div className="p-4 text-gray-600">Loading messages...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-4 p-4 max-w-2xl mx-auto">
      {messages.map((message) => {
        const isIncoming = message.message_direction === 'Incoming';
        return (
          <div 
            key={message.id} 
            className="flex flex-col items-start"
          >
            <div className={`
              text-sm font-medium mb-1
              ${isIncoming ? 'text-blue-600' : 'text-green-600'}
            `}>
              {isIncoming ? 'Received' : 'Sent'}
            </div>
            <div className={`
              p-3 rounded-lg shadow max-w-[80%] break-words
              ${isIncoming 
                ? 'bg-blue-100 text-blue-900 rounded-tl-none' 
                : 'bg-green-100 text-green-900 rounded-tl-none'}
            `}>
              {message.message_text}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.created_at).toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
