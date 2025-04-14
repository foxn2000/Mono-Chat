import type { Message } from '../types/chat';
import { getModelSettings } from '../config/modelConfig';
import type { ModelConfig } from '../config/modelConfig';

// APIクライアントのインターフェース
export interface ApiClient {
  fetchChatStream(
    messages: Message[],
    onChunk: (content: string) => void,
    onError: (error: string) => void,
    params?: any
  ): Promise<void>;
}

// 基本的なAPIクライアントの実装
abstract class BaseApiClient implements ApiClient {
  constructor(
    protected settings: ModelConfig,
    protected apiKey: string
  ) {}

  abstract fetchChatStream(
    messages: Message[],
    onChunk: (content: string) => void,
    onError: (error: string) => void,
    params?: any
  ): Promise<void>;

  protected async handleStreamResponse(
    response: Response,
    onChunk: (content: string) => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            const content = this.extractContent(parsed);
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('Failed to parse chunk', e);
          }
        }
      }
    }
  }

  protected abstract extractContent(parsed: any): string;
}

// Cerebras APIクライアント
class CerebrasApiClient extends BaseApiClient {
  async fetchChatStream(
    messages: Message[],
    onChunk: (content: string) => void,
    onError: (error: string) => void,
    params?: any
  ): Promise<void> {
    try {
      const response = await fetch(this.settings.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.settings.name,
          messages: messages,
          stream: true,
          ...this.settings.defaultParams,
          ...params,
        }),
      });

      await this.handleStreamResponse(response, onChunk, onError);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知のエラーが発生しました';
      onError(errorMessage);
    }
  }

  protected extractContent(parsed: any): string {
    return parsed.choices[0]?.delta?.content || '';
  }
}

// OpenAI APIクライアント
class OpenAIApiClient extends BaseApiClient {
  async fetchChatStream(
    messages: Message[],
    onChunk: (content: string) => void,
    onError: (error: string) => void,
    params?: any
  ): Promise<void> {
    try {
      const response = await fetch(this.settings.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.settings.name,
          messages: messages,
          stream: true,
          ...this.settings.defaultParams,
          ...params,
        }),
      });

      await this.handleStreamResponse(response, onChunk, onError);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知のエラーが発生しました';
      onError(errorMessage);
    }
  }

  protected extractContent(parsed: any): string {
    return parsed.choices[0]?.delta?.content || '';
  }
}

// Anthropic APIクライアント
class AnthropicApiClient extends BaseApiClient {
  async fetchChatStream(
    messages: Message[],
    onChunk: (content: string) => void,
    onError: (error: string) => void,
    params?: any
  ): Promise<void> {
    try {
      // Anthropic APIはメッセージ形式が異なるため、変換が必要
      const lastMessage = messages[messages.length - 1];
      const response = await fetch(this.settings.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.settings.name,
          messages: [{
            role: lastMessage.role === 'user' ? 'user' : 'assistant',
            content: lastMessage.content,
          }],
          stream: true,
          ...this.settings.defaultParams,
          ...params,
        }),
      });

      await this.handleStreamResponse(response, onChunk, onError);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知のエラーが発生しました';
      onError(errorMessage);
    }
  }

  protected extractContent(parsed: any): string {
    return parsed.delta?.text || '';
  }
}

// APIクライアントを生成するファクトリー関数
export async function createApiClient(modelId?: string): Promise<ApiClient> {
  const settings = await getModelSettings(modelId);
  
  // APIキーを環境変数から取得
  const apiKey = import.meta.env[settings.apiKeyEnvName];
  if (!apiKey) {
    throw new Error(`API key ${settings.apiKeyEnvName} is not set in environment variables`);
  }
  
  // URLからプロバイダーを判断
  if (settings.baseUrl.includes('cerebras.ai')) {
    return new CerebrasApiClient(settings, apiKey);
  } else if (settings.baseUrl.includes('openai.com')) {
    return new OpenAIApiClient(settings, apiKey);
  } else if (settings.baseUrl.includes('anthropic.com')) {
    return new AnthropicApiClient(settings, apiKey);
  }
  
  // デフォルトはOpenAI互換として扱う
  return new OpenAIApiClient(settings, apiKey);
}
