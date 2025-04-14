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
      console.error(`Failed to load models.yaml: ${response.statusText}`);
      return DEFAULT_CONFIG;
    }
    const yamlText = await response.text();
    const config = yaml.load(yamlText) as ModelsConfig;
    
    // 設定の検証
    if (!config.models?.default || !config.models?.available) {
      console.error('Invalid models.yaml format: missing required fields');
      return DEFAULT_CONFIG;
    }
    
    // デフォルトモデルが利用可能なモデルに存在するか確認
    if (!config.models.available[config.models.default]) {
      console.error(`Default model "${config.models.default}" not found in available models`);
      return DEFAULT_CONFIG;
    }
    
    return config;
  } catch (error) {
    console.error('モデル設定の読み込みに失敗しました', error);
    return DEFAULT_CONFIG;
  }
}

// モデル設定を保持するキャッシュ
let configCache: {
  config: ModelsConfig | null;
  timestamp: number;
} = {
  config: null,
  timestamp: 0,
};

// キャッシュの有効期限（5分）
const CACHE_TTL = 5 * 60 * 1000;

// モデル設定を取得する関数
export async function getModelConfig(): Promise<ModelsConfig> {
  const now = Date.now();
  
  // キャッシュが有効な場合はキャッシュを返す
  if (configCache.config && (now - configCache.timestamp) < CACHE_TTL) {
    return configCache.config;
  }
  
  // 新しい設定を読み込む
  const config = await loadModelConfig();
  
  // キャッシュを更新
  configCache = {
    config,
    timestamp: now,
  };
  
  return config;
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
