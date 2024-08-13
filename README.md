# ChatGPT Clone

This project is a ChatGPT-like UI using SQLite, Node.js, Express, Dotenv, and EJS. It supports multiple AI models including Ollama, GROQ, OpenAI, and OpenRouter.

## Features

- Chat interface with AI models
- Support for multiple AI providers
- Adjustable max tokens and temperature
- Message history stored in SQLite database
- Option to clear chat history

## Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory and add your API keys:

```
DB_PATH=./database.sqlite
OLLAMA_API_URL=http://localhost:11434/api
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Run `npm start` to start the server
5. Open `http://localhost:3000` in your browser

## Usage

- Select an AI model from the dropdown
- Adjust max tokens and temperature as needed
- Type your message and press Enter or click Send
- Click "Clear History" to delete all messages

## License

MIT