import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../types/chat';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-4 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <ReactMarkdown components={{
          p: ({children}) => <p className="prose prose-sm max-w-none m-0">{children}</p>
        }}>
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
