export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export interface StreamChunk {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    delta: {
      content?: string
      role?: string
    }
    finish_reason: string | null
  }[]
}
