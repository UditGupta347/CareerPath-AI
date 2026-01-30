/**
 * Quick test script to verify Groq API key is working
 */

import Groq from 'groq-sdk';

// Load API key from environment variable
const apiKey = process.env.VITE_GROQ_API_KEY;

async function testGroq() {
  try {
    console.log('🧪 Testing Groq API...\n');
    console.log('📍 API Key (first 20 chars):', apiKey.substring(0, 20) + '...');
    console.log('📍 Using model: llama-3.3-70b-versatile\n');
    
    const groq = new Groq({ apiKey });
    
    console.log('⏳ Sending request to Groq...');
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Say "Hello! Groq API is working perfectly!"'
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 100
    });
    
    const response = chatCompletion.choices[0]?.message?.content;
    
    console.log('\n✅ SUCCESS!');
    console.log('📝 Response:', response);
    console.log('\n✅✅✅ Groq API is working correctly! ✅✅✅');
    console.log('\n🎉 Your Resume Builder and AI Assistant are now ready to use!');
    
  } catch (error) {
    console.error('\n❌ ERROR:');
    console.error('Message:', error.message);
    console.error('\nFull error:', error);
  }
}

testGroq();
