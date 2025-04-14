import React, { createContext, useContext, useState, useEffect } from 'react';
import { createApiClient, type ApiClient } from '../api/modelFactory';
import { getDefaultModelId, getAvailableModelIds } from '../config/modelConfig';

interface ApiContextType {
  apiClient: ApiClient | null;
  isInitializing: boolean;
  error: string | null;
  modelId: string | null;
  availableModels: string[];
  changeModel: (modelId: string) => Promise<void>;
}

const ApiContext = createContext<ApiContextType>({
  apiClient: null,
  isInitializing: true,
  error: null,
  modelId: null,
  availableModels: [],
  changeModel: async () => {},
});

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ApiContextType>({
    apiClient: null,
    isInitializing: true,
    error: null,
    modelId: null,
    availableModels: [],
    changeModel: async () => {},
  });

  const changeModel = async (newModelId: string) => {
    setState(prev => ({
      ...prev,
      isInitializing: true,
      error: null
    }));
    
    try {
      const client = await createApiClient(newModelId);
      setState(prev => ({
        ...prev,
        apiClient: client,
        isInitializing: false,
        error: null,
        modelId: newModelId,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知のエラーが発生しました';
      setState(prev => ({
        ...prev,
        error: `モデルの変更に失敗しました: ${errorMessage}`,
        isInitializing: false
      }));
    }
  };

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000;

    const initializeApiClient = async () => {
      try {
        const defaultModelId = await getDefaultModelId();
        const availableModels = await getAvailableModelIds();
        const client = await createApiClient(defaultModelId);
        
        if (mounted) {
          setState(prev => ({
            ...prev,
            apiClient: client,
            isInitializing: false,
            error: null,
            modelId: defaultModelId,
            availableModels,
            changeModel,
          }));
        }
      } catch (error) {
        console.error('APIクライアントの初期化に失敗しました:', error);
        
        if (mounted && retryCount < maxRetries) {
          retryCount++;
          setTimeout(initializeApiClient, retryDelay);
        } else if (mounted) {
          const errorMessage = error instanceof Error ? error.message : '未知のエラーが発生しました';
          setState(prev => ({
            ...prev,
            apiClient: null,
            isInitializing: false,
            error: `APIクライアントの初期化に失敗しました: ${errorMessage}`,
            modelId: null,
          }));
        }
      }
    };

    initializeApiClient();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ApiContext.Provider value={state}>
      {children}
    </ApiContext.Provider>
  );
};
