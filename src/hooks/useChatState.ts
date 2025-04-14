import { useState, useCallback, useEffect } from 'react';
import type { Message, ChatState } from '../types/chat';
import { createApiClient, type ApiClient } from '../api/modelFactory';
import { getDefaultModelId } from '../config/modelConfig';

export const useChatState = (modelId?: string) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const [apiClient, setApiClient] = useState<ApiClient | null>(null);
  const [currentModelId, setCurrentModelId] = useState<string | null>(null);

  // APIクライアントの初期化
  useEffect(() => {
    const initializeApiClient = async () => {
      try {
        const defaultModelId = modelId || await getDefaultModelId();
        const client = await createApiClient(defaultModelId);
        setApiClient(client);
        setCurrentModelId(defaultModelId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '未知のエラーが発生しました';
        setState(prev => ({
          ...prev,
          error: errorMessage,
        }));
      }
    };

    initializeApiClient();
  }, [modelId]);

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

  const sendMessage = useCallback(async (content: string, params?: any) => {
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

    if (!apiClient) {
      setState(prev => ({
        ...prev,
        error: 'APIクライアントが初期化されていません',
      }));
      return;
    }

    try {
      await apiClient.fetchChatStream(
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
        },
        params
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
    currentModelId,
  };
};
