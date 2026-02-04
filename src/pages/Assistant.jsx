import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2, Trash2, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';

export default function Assistant() {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    useEffect(() => {
        const savedMessages = localStorage.getItem('ai_assistant_messages');
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {

            setMessages([
                {
                    id: '1',
                    role: 'assistant',
                    content: `Hi ${user?.full_name || 'there'}! 👋\n\nI'm your AI Assistant powered by Groq (Llama 3.3 70B). I can help you with anything:\n\n💬 General conversations and questions\n✨ Career advice and guidance\n💡 Creative writing and brainstorming\n📚 Learning and education\n💻 Programming and technical help\n🌍 General knowledge and facts\n🎯 Problem-solving and analysis\n🎨 And much more!\n\nAsk me anything - I'm here to help!`,
                    timestamp: new Date().toISOString()
                }
            ]);
        }
    }, [user]);


    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('ai_assistant_messages', JSON.stringify(messages));
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            console.log('🤖 AI Assistant: Using Groq API...');

            // Import the Groq service
            const { sendChatMessage } = await import('@/services/openRouterService');

            // Call Groq with conversation context
            const aiResponse = await sendChatMessage(input.trim(), messages);

            if (!aiResponse) {
                throw new Error('No response from Groq API');
            }

            console.log('✅ AI Assistant: Response received successfully');

            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error('Error getting AI response:', error);

            let errorMsg = 'I apologize, but I\'m having trouble connecting to the AI service.';

            if (error.message?.includes('API key') || error.message?.includes('not configured')) {
                errorMsg = '🔑 **API Key Not Configured**\n\nThe Groq API key is missing or invalid. Please add a valid VITE_GROQ_API_KEY to your .env file.\n\nGet your FREE API key from: https://console.groq.com';
            } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
                errorMsg = '⚠️ **API Quota Exceeded**\n\nYou\'ve reached the Groq API usage limit. Please try again later.';
            } else if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
                errorMsg = '🌐 **Connection Error**\n\nCouldn\'t connect to Groq AI. Please check your internet connection and try again.';
            } else if (error.message?.includes('401') || error.message?.includes('403') || error.message?.includes('Invalid')) {
                errorMsg = '🔐 **Authentication Error**\n\nInvalid API key. Please check your VITE_GROQ_API_KEY in the .env file.';
            } else {
                errorMsg = `❌ **Error Occurred**\n\n${error.message}\n\nPlease try again or check your API configuration.`;
            }

            const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: errorMsg,
                timestamp: new Date().toISOString(),
                isError: true
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        if (confirm('Are you sure you want to clear the chat history?')) {
            setMessages([
                {
                    id: '1',
                    role: 'assistant',
                    content: `Chat cleared! Feel free to ask me anything - I'm here to help with whatever you need!`,
                    timestamp: new Date().toISOString()
                }
            ]);
            localStorage.removeItem('ai_assistant_messages');
        }
    };

    const suggestedPrompts = [
        "Explain quantum computing in simple terms",
        "Help me write a creative story about space exploration",
        "What are the best practices for learning a new programming language?",
        "Tell me an interesting fact about history",
        "How can I improve my problem-solving skills?",
        "Explain machine learning to a beginner",
        "Give me tips for staying productive",
        "What's the latest in AI technology?"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
            { }
            <div className="fixed inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(99, 102, 241, 0.15) 1px, transparent 0)',
                    backgroundSize: '48px 48px'
                }} />
            </div>

            <div className="relative pt-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                { }
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Sparkles className="w-8 h-8 text-indigo-600" />
                                AI Assistant
                            </h1>
                            <p className="text-slate-600">Powered by Groq (Llama 3.3 70B) - Your versatile AI companion!</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearChat}
                            className="gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear Chat
                        </Button>
                    </div>
                </motion.div>

                { }
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
                        { }
                        <div className="h-[600px] overflow-y-auto p-6 space-y-4">
                            <AnimatePresence>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-5 h-5 text-white" />
                                            </div>
                                        )}

                                        <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                                            <div className={`rounded-2xl px-4 py-3 ${message.role === 'user'
                                                ? 'bg-indigo-600 text-white'
                                                : message.isError
                                                    ? 'bg-red-50 text-red-900 border border-red-200'
                                                    : 'bg-slate-100 text-slate-900'
                                                }`}>
                                                <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                                    {message.content}
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 px-2">
                                                {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </div>
                                        </div>

                                        {message.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-shrink-0">
                                                {user?.avatar ? (
                                                    <img src={user.avatar} alt={user.full_name} className="w-8 h-8 rounded-full" />
                                                ) : (
                                                    <User className="w-5 h-5 text-white" />
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            { }
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-slate-100 rounded-2xl px-4 py-3">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        { }
                        {messages.length <= 1 && (
                            <div className="px-6 pb-4">
                                <p className="text-xs text-slate-500 mb-2 font-medium">Suggested questions:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {suggestedPrompts.slice(0, 4).map((prompt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setInput(prompt)}
                                            className="text-left p-2 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        { }
                        <div className="border-t border-slate-200 p-4 bg-white">
                            <div className="flex gap-2">
                                <Textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything - career advice, general questions, explanations, creative writing..."
                                    className="resize-none min-h-[60px] max-h-[200px]"
                                    rows={2}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isLoading}
                                    size="lg"
                                    className="bg-indigo-600 hover:bg-indigo-700 px-6"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Press <kbd className="px-1 py-0.5 bg-slate-200 rounded text-xs">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-200 rounded text-xs">Shift+Enter</kbd> for new line
                            </p>
                        </div>
                    </Card>
                </motion.div>

                { }
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 grid sm:grid-cols-3 gap-4"
                >
                    {[
                        {
                            icon: MessageSquare,
                            title: "General Chat",
                            desc: "Ask anything - from career to general knowledge"
                        },
                        {
                            icon: Sparkles,
                            title: "Creative Help",
                            desc: "Brainstorming, writing, and problem-solving"
                        },
                        {
                            icon: Plus,
                            title: "Learning Support",
                            desc: "Explanations, tutorials, and skill development"
                        }
                    ].map((tip, idx) => (
                        <div
                            key={idx}
                            className="bg-white/80 backdrop-blur-xl rounded-xl border border-slate-100 p-4 flex items-start gap-3"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                                <tip.icon className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900 text-sm mb-1">{tip.title}</h4>
                                <p className="text-xs text-slate-600">{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
