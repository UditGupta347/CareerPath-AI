// Simplified AI Assistant handler using Gemini directly
export async function handleAIAssistantMessage(input, messages) {
    try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
        }

        console.log('🤖 AI Assistant: Using Gemini API directly...');
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Build conversation context
        const conversationContext = messages
            .slice(-6)
            .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n\n');

        const fullPrompt = `You are a helpful, knowledgeable, and versatile AI assistant. You can discuss any topic and answer any question to the best of your ability. Be conversational, engaging, and use emojis when appropriate to make the conversation more lively.

${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}User: ${input.trim()}

Please respond as the Assistant:`;

        // Call Gemini API
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const aiResponse = response.text();

        if (!aiResponse) {
            throw new Error('No response from Gemini');
        }

        return aiResponse;
    } catch (error) {
        console.error('❌ AI Assistant error:', error);
        throw error;
    }
}
