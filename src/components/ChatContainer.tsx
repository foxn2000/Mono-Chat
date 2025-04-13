import React from 'react';
import { MessageList } from './MessageList';
import { InputForm } from './InputForm';
import { useChatState } from '../hooks/useChatState';

export const ChatContainer: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useChatState();

  return (
    <>
      <div id="chat-area">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <MessageList
          messages={messages}
          isLoading={isLoading}
        />
      </div>
      
      <div id="line-display-zone">
        <div id="divider-line"></div>
      </div>
      
      <div id="input-outer-container">
        <InputForm
          onSubmit={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
