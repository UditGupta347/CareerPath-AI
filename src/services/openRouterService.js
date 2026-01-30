/**
 * Groq API Service for AI Assistant
 * Uses Llama 3.3 70B (very fast, generous free tier)
 */

import Groq from 'groq-sdk';

/**
 * Send a chat message to Groq API
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - The AI's response
 */
export async function sendChatMessage(userMessage, conversationHistory = []) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      '❌ Groq API key not configured.\n\n' +
      '📝 Get a FREE API key from: https://console.groq.com\n' +
      '🔧 Add it to your .env file as: VITE_GROQ_API_KEY=your_key_here'
    );
  }

  // Build messages array with conversation context (last 6 messages)
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful, knowledgeable, and versatile AI assistant. You can discuss any topic and answer any question to the best of your ability. Be conversational, engaging, and use emojis when appropriate to make the conversation more lively.'
    }
  ];

  // Add conversation history
  const recentHistory = conversationHistory.slice(-6);
  recentHistory.forEach(msg => {
    if (msg.role === 'user' || msg.role === 'assistant') {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }
  });

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage
  });

  const maxRetries = 2;
  let lastError = null;

  // Retry logic with exponential backoff
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Attempt ${attempt}/${maxRetries}: Calling Groq API...`);

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const chatCompletion = await groq.chat.completions.create({
        messages: messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1000
      });

      const aiResponse = chatCompletion.choices[0]?.message?.content;

      if (!aiResponse || aiResponse.trim() === '') {
        throw new Error('Empty response from Groq API');
      }

      console.log('✅ Groq API: Response received successfully');
      return aiResponse;

    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      lastError = error;

      // Don't retry on authentication errors
      if (error.message?.includes('API key') || 
          error.message?.includes('Invalid') ||
          error.message?.includes('401')) {
        throw new Error('Invalid Groq API key. Please check your .env file.');
      }

      // Retry on network errors or server errors
      if (attempt < maxRetries) {
        const waitTime = attempt * 1500; // 1.5s, 3s
        console.log(`⏳ Waiting ${waitTime / 1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // All retries failed
  throw lastError || new Error('Failed to get response from Groq API after all retries');
}

/**
 * Test the Groq API connection
 * @returns {Promise<boolean>} - True if connection is successful
 */
export async function testConnection() {
  try {
    await sendChatMessage('Hi', []);
    return true;
  } catch (error) {
    console.error('Groq connection test failed:', error);
    return false;
  }
}
