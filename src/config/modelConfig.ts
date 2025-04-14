import yaml from 'js-yaml';

// モデル設定の型定義
export interface ModelConfig {
  name: string;
  baseUrl: string;
  apiKeyEnvName: string;
  defaultParams: {
    temperature: number;
    max_tokens: number;
    [key: string]: any;
  };
}

// 全体の設定の型定義
export interface ModelsConfig {
  models: {
    default: string;
    available: {
      [key: string]: ModelConfig;
    };
  };
}

// デフォルトの設定
const DEFAULT_CONFIG: ModelsConfig = {
  models: {
    default: 'cerebras-llama4',
    available: {
      'cerebras-llama4': {
        name: 'llama-4-scout-17b-16e-instruct',
        baseUrl: 'https://api.cerebras.ai/v1/chat/completions',
        apiKeyEnvName: 'VITE_CEREBRAS_API_KEY',
        defaultParams: {
          temperature: 0.7,
          max_tokens: 1000,
        },
      },
    },
  },
};

// YAMLファイルを読み込む関数
export async function loadModelConfig(): Promise<ModelsConfig> {
  try {
    const response = await fetch('/models.yaml');
    if (!response.ok) {
      throw new Error(`Failed to load models.yaml: ${response.statusText}`);
    }
    const yamlText = await response.text();
    return yaml.load(yamlText) as ModelsConfig;
  } catch (error) {
    console.error('モデル設定の読み込みに失敗しました', error);
    return DEFAULT_CONFIG;
  }
}

// 現在のモデル設定を保持する
let currentConfig: ModelsConfig | null = null;

// モデル設定を取得する関数
export async function getModelConfig(): Promise<ModelsConfig> {
  if (!currentConfig) {
    currentConfig = await loadModelConfig();
  }
  return currentConfig;
}

// 特定のモデルの設定を取得する関数
export async function getModelSettings(modelId?: string): Promise<ModelConfig> {
  const config = await getModelConfig();
  const id = modelId || config.models.default;
  const modelConfig = config.models.available[id];
  
  if (!modelConfig) {
    throw new Error(`Model configuration not found for: ${id}`);
  }
  
  return modelConfig;
}

// 利用可能なモデルのIDリストを取得する関数
export async function getAvailableModelIds(): Promise<string[]> {
  const config = await getModelConfig();
  return Object.keys(config.models.available);
}

// デフォルトのモデルIDを取得する関数
export async function getDefaultModelId(): Promise<string> {
  const config = await getModelConfig();
  return config.models.default;
}
