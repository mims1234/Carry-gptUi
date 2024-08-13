const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateResponse(messages, maxTokens, temperature) {
  // Ensure messages is an array
  if (!Array.isArray(messages)) {
    messages = [{ role: "user", content: messages }];
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "mixtral-8x7b-32768",
      max_tokens: maxTokens,
      temperature: temperature,
      stream: false
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error calling Groq API:", error.message);
    throw error;
  }
}

module.exports = { generateResponse };
