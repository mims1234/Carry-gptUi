const axios = require('axios');

async function generateResponse(message, maxTokens, temperature) {
  const response = await axios.post(process.env.OLLAMA_API_URL + '/generate', {
    model: 'llama3.1:8b-instruct-q2_K',
    prompt: message,
    max_tokens: maxTokens,
    temperature: temperature,
    stream: false  // Add this line to disable streaming
  });

  return response.data.response;
}

module.exports = { generateResponse };