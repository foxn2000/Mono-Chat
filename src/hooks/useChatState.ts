import { useState, useCallback } from 'react';
import type { Message, ChatState } from '../types/chat';
import { fetchChatStream } from '../api/cerebras';

export const useChatState = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const addMessage = useCallback((message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }, []);

  const updateLastAssistantMessage = useCallback((content: string) => {
    setState(prev => {
      const messages = [...prev.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage && lastMessage.role === 'assistant') {
        messages[messages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content,
        };
      } else {
        messages.push({
          role: 'assistant',
          content,
        });
      }

      return {
        ...prev,
        messages,
      };
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      role: 'user',
      content,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      await fetchChatStream(
        [...state.messages, userMessage],
        (chunk) => {
          updateLastAssistantMessage(chunk);
        },
        (error) => {
          setState(prev => ({
            ...prev,
            error,
            isLoading: false,
          }));
        }
      );
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [state.messages, updateLastAssistantMessage]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
  };
};
