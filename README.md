# Mono Chat

![alt text](<pic.png>)

A minimalist chat interface built with React and TypeScript, supporting multiple AI providers including Cerebras, OpenAI, and Anthropic. This application provides a clean and intuitive chat experience with AI, featuring markdown support and real-time streaming responses.

[日本語のREADME](./README_ja.md)

## Features

- Clean and intuitive chat interface
- Dynamic model switching with a floating stone-like UI
- Real-time streaming responses with typing effect
- Markdown message formatting support
- Code block syntax highlighting with copy functionality
- Responsive design with a modern neumorphic style
- Keyboard shortcuts for efficient interaction

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Markdown

## Prerequisites

Before you begin, ensure you have:
- Node.js (latest LTS version recommended)
- npm (comes with Node.js)
- API keys for the services you want to use (Cerebras, OpenAI, or Anthropic)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/foxn2000/Mono-Chat.git
cd mono-chat
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your API keys to the `.env` file:
```
# Cerebras API settings
VITE_CEREBRAS_BASE_URL=https://api.cerebras.ai/v1

# OpenAI API settings
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API settings
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

5. Configure your models in `models.yaml`:
```yaml
models:
  # Default model to use
  default: cerebras-llama4

  # Available models
  available:
    cerebras-llama4:
      name: llama-4-scout-17b-16e-instruct
      baseUrl: https://api.cerebras.ai/v1/chat/completions
      apiKeyEnvName: VITE_CEREBRAS_API_KEY
      defaultParams:
        temperature: 0.7
        max_tokens: 1000
    # Add more models as needed
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

3. Start chatting with the AI by typing your message and pressing:
   - Ctrl+Enter (Windows/Linux) or
   - Cmd+Enter (macOS)
   to send your message

### Features Guide

- **Message Input**: Type your message in the input field at the bottom
- **Send Message**: Use Ctrl+Enter (or Cmd+Enter on macOS) to send
- **Copy Text**: Click on any message to copy its content
- **Code Blocks**: Code snippets are automatically formatted and can be copied with a click
- **Model Selection**: Hover over the top-left corner to reveal the model selector, which appears like a floating stone. Click to view and select from available models

## Development

### Project Structure

```
mono-chat/
├── src/
│   ├── api/          # API integration and factory
│   ├── components/   # React components
│   ├── config/       # Configuration management
│   ├── hooks/        # Custom React hooks
│   ├── styles/       # CSS styles
│   ├── types/        # TypeScript type definitions
│   └── assets/       # Static assets
├── public/           # Public assets
├── models.yaml       # Model configurations
└── ...config files   # Various configuration files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

The following environment variables are supported:

- `VITE_CEREBRAS_API_KEY`: Your Cerebras API key
- `VITE_CEREBRAS_BASE_URL`: Cerebras API base URL (defaults to https://api.cerebras.ai/v1)
- `VITE_OPENAI_API_KEY`: Your OpenAI API key
- `VITE_ANTHROPIC_API_KEY`: Your Anthropic API key

## Model Configuration

Models are configured in the `models.yaml` file. You can:

- Set a default model
- Configure multiple models from different providers
- Customize model parameters (temperature, max tokens, etc.)
- Add new models easily

The application supports any OpenAI API-compatible service, including:
- Cerebras AI
- OpenAI
- Anthropic
- Other OpenAI API-compatible services

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
