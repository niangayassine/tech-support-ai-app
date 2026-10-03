const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

// Fallback mock response for testing without OpenAI API
const mockResponse = (message) => {
  const responses = [
    'Thank you for your message. I\'m here to help troubleshoot your technical issue.',
    'I understand your problem. Let me provide you with some guidance on how to resolve this.',
    'Great question! Here are some steps you can follow to fix this issue...',
    'I\'ve analyzed your issue. Try the following solutions...'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateResponse = async (userMessage) => {
  try {
    if (!OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY not configured, using mock response');
      return {
        response: mockResponse(userMessage),
        model: 'mock',
        tokens: 0,
        confidence: 0.5,
        error: false
      };
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a helpful technical support AI assistant. You help users solve their technology problems. 
            Provide clear, actionable solutions. Be empathetic and professional.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content;
    const tokensUsed = response.data.usage.total_tokens;

    return {
      response: aiMessage,
      model: MODEL,
      tokens: tokensUsed,
      confidence: 0.9,
      error: false
    };
  } catch (err) {
    console.error('AI Service error:', err.response?.data || err.message);
    return {
      response: 'Sorry, I encountered an error processing your request. Please try again.',
      model: MODEL,
      tokens: 0,
      confidence: 0,
      error: true,
      errorMessage: err.message
    };
  }
};

module.exports = {
  generateResponse
};
