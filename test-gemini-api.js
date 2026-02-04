/**
 * Comprehensive Gemini API test with detailed error logging
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Load API key from environment variable
const apiKey = process.env.VITE_GEMINI_API_KEY;

async function testGemini() {
  try {
    console.log(' Testing Gemini API with detailed logging...\n');
    console.log(' API Key (first 20 chars):', apiKey.substring(0, 20) + '...');
    console.log(' API Key length:', apiKey.length);
    console.log(' Using model: gemini-1.5-flash\n');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('⏳ Sending request to Gemini...');
    
    const result = await model.generateContent('Say "Hello! API is working!"');
    const response = await result.response;
    const text = response.text();
    
    console.log('\n SUCCESS!');
    console.log(' Response:', text);
    console.log('\n Gemini API is working correctly! ');
    
  } catch (error) {
    console.error('\n ERROR OCCURRED:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Message:', error.message);
    console.error('Status:', error.status);
    console.error('Status Text:', error.statusText);
    console.error('Error Details:', error.errorDetails);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (error.status === 404) {
      console.log('❓ 404 Error Possible Causes:');
      console.log('1. API key is invalid or not activated');
      console.log('2. API key has restrictions (e.g., IP restrictions, referrer restrictions)');
      console.log('3. Generative AI API is not enabled in Google Cloud Console');
      console.log('4. API endpoint issue\n');
      
      console.log('🔧 Steps to fix:');
      console.log('1. Go to: https://makersuite.google.com/app/apikey');
      console.log('2. Make sure the key is created and shows as "Active"');
      console.log('3. Check if there are any restrictions on the key');
      console.log('4. Try generating a completely new key');
      console.log('5. Enable the Generative Language API at:');
      console.log('   https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    }
    
    process.exit(1);
  }
}

testGemini();
