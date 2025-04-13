import React from 'react';
import { MessageList } from './MessageList';
import { InputForm } from './InputForm';
import { useChatState } from '../hooks/useChatState';

export const ChatContainer: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useChatState();

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">Cerebras Chat</h1>
      </header>
      
      <main className="flex-1 flex flex-col">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <MessageList
          messages={messages}
          isLoading={isLoading}
        />
        
        <InputForm
          onSubmit={sendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};
