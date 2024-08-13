const axios = require('axios');

async function generateResponse(message, maxTokens, temperature) {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: message }],
    max_tokens: maxTokens,
    temperature: temperature,
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data.choices[0].message.content;
}

module.exports = { generateResponse };