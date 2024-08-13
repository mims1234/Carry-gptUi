const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const ollamaService = require('../services/ollama');
const groqService = require('../services/groq');
const openaiService = require('../services/openai');
const openrouterService = require('../services/openrouter');

let chats = [];

router.post('/chat', async (req, res) => {
  const { chatId, message, model, maxTokens, temperature } = req.body;

  if (!chatId) {
    const newChatId = chats.length + 1;
    chats.push({ id: newChatId, messages: [] });
    return res.json({ chatId: newChatId });
  }

  let response;
  try {
    switch (model) {
      case 'ollama':
        response = await ollamaService.generateResponse(message, maxTokens, temperature);
        break;
      case 'groq':
        response = await groqService.generateResponse(message, maxTokens, temperature);
        break;
      case 'openai':
        response = await openaiService.generateResponse(message, maxTokens, temperature);
        break;
      case 'openrouter':
        response = await openrouterService.generateResponse(message, maxTokens, temperature);
        break;
      default:
        throw new Error('Invalid model selected');
    }

    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      chat.messages.push({ role: 'user', content: message });
      chat.messages.push({ role: 'assistant', content: response });
    }

    res.json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'An error occurred while generating the response.' });
  }
});

router.get('/chats', (req, res) => {
  res.json(chats);
});

router.get('/chats/:id', (req, res) => {
  const chat = chats.find(c => c.id === parseInt(req.params.id));
  if (chat) {
    res.json(chat);
  } else {
    res.status(404).json({ error: 'Chat not found' });
  }
});

router.delete('/chats', (req, res) => {
  chats = [];
  res.json({ message: 'All chats deleted successfully.' });
});

router.get('/models', (req, res) => {
  const models = [
    { id: 'ollama', name: 'Ollama' },
    { id: 'groq', name: 'GROQ' },
    { id: 'openai', name: 'OpenAI' },
    { id: 'openrouter', name: 'OpenRouter' }
  ];
  res.json(models);
});

module.exports = router;