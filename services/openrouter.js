const axios = require('axios');

async function generateResponse(message, maxTokens, temperature) {
  const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    messages: [{ role: 'user', content: message }],
    max_tokens: maxTokens,
    temperature: temperature,
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data.choices[0].message.content;
}

module.exports = { generateResponse };