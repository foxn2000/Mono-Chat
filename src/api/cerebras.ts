import axios from 'axios';
import type { Message } from '../types/chat';

const BASE_URL = import.meta.env.VITE_CEREBRAS_BASE_URL || 'https://api.cerebras.ai/v1';
const API_KEY = import.meta.env.VITE_CEREBRAS_API_KEY;

if (!API_KEY) {
  throw new Error('Cerebras API key is not set in environment variables');
}

export const fetchChatStream = async (
  messages: Message[],
  onChunk: (content: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-4-scout-17b-16e-instruct',
        messages: messages,
        stream: true,
      }),
    });

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
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('Failed to parse chunk', e);
          }
        }
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知のエラーが発生しました';
    onError(errorMessage);
  }
};
