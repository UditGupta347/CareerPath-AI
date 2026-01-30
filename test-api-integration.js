


console.log('=== Test 1: API Integration Check ===');
import { api } from './src/services/api.js';
console.log('api.integrations exists?', !!api?.integrations);
console.log('api.integrations.Core exists?', !!api?.integrations?.Core);
console.log('InvokeLLM exists?', typeof api?.integrations?.Core?.InvokeLLM);
console.log('UploadFile exists?', typeof api?.integrations?.Core?.UploadFile);


console.log('\n=== Test 2: Environment Variables ===');
console.log('VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY ? 'SET' : 'NOT SET');
console.log('VITE_OPENROUTER_API_KEY:', import.meta.env.VITE_OPENROUTER_API_KEY ? 'SET' : 'NOT SET');


console.log('\n=== Test 3: Testing InvokeLLM ===');
try {
  const result = await api.integrations.Core.InvokeLLM({
    prompt: 'Say "Hello, API is working!" and nothing else.',
    response_json_schema: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  });
  console.log('✅ InvokeLLM SUCCESS:', result);
} catch (error) {
  console.error('❌ InvokeLLM FAILED:', error.message);
}


console.log('\n=== Test 4: Testing UploadFile ===');
try {
  
  const testContent = 'Test resume content';
  const testBlob = new Blob([testContent], { type: 'text/plain' });
  const testFile = new File([testBlob], 'test-resume.txt', { type: 'text/plain' });
  
  const uploadResult = await api.integrations.Core.UploadFile({ file: testFile });
  console.log('✅ UploadFile SUCCESS:', { 
    fileName: uploadResult.fileName,
    fileType: uploadResult.fileType,
    contentLength: uploadResult.file_url?.length 
  });
} catch (error) {
  console.error('❌ UploadFile FAILED:', error.message);
}

console.log('\n=== Tests Complete ===');
