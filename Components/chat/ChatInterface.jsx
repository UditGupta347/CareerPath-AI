import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Loader2,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';

export default function ChatInterface({ projectContext }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initConversation = async () => {
    try {
      const conv = await base44.agents.createConversation({
        agent_name: 'project_assistant',
        metadata: {
          name: projectContext?.title || 'Project Assistance',
          project_id: projectContext?.id
        }
      });
      setConversation(conv);

      
      const unsubscribe = base44.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages || []);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Failed to init conversation:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !conversation) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      
      let messageContent = userMessage;
      if (projectContext && messages.length === 0) {
        messageContent = `Context: I'm working on a project called "${projectContext.title}" which is a ${projectContext.domain} project at ${projectContext.complexity} level. Tech stack: ${projectContext.tech_stack?.join(', ')}.\n\nMy question: ${userMessage}`;
      }

      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: messageContent
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const suggestedQuestions = [
    "How do I implement authentication?",
    "What's the best database for this project?",
    "How should I structure my code?",
    "What APIs can I use?"
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">AI Assistant</h3>
          <p className="text-xs text-slate-500">Ask anything about your project</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-500">Online</span>
        </div>
      </div>

      {}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">
              How can I help you?
            </h4>
            <p className="text-sm text-slate-500 text-center max-w-xs mb-6">
              Ask me anything about implementation, best practices, or debugging
            </p>
            
            <div className="grid gap-2 w-full max-w-sm">
              {suggestedQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="justify-start text-left h-auto py-2.5 px-4 rounded-xl border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-sm"
                  onClick={() => setInput(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role !== 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === 'user' 
                      ? "bg-slate-900 text-white" 
                      : "bg-slate-100 text-slate-900"
                  )}>
                    {message.role === 'user' ? (
                      <p className="text-sm">{message.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-slate">
                        <ReactMarkdown
                          components={{
                            code: ({ inline, children, ...props }) => {
                              if (inline) {
                                return (
                                  <code className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-xs font-mono">
                                    {children}
                                  </code>
                                );
                              }
                              return (
                                <div className="relative group my-2">
                                  <pre className="bg-slate-800 text-slate-100 rounded-lg p-3 overflow-x-auto text-xs">
                                    <code {...props}>{children}</code>
                                  </pre>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 bg-slate-700 hover:bg-slate-600"
                                    onClick={() => handleCopy(String(children), idx)}
                                  >
                                    {copiedIndex === idx ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-slate-400" />
                                    )}
                                  </Button>
                                </div>
                              );
                            }
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span className="text-sm text-slate-500">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </ScrollArea>

      {}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about implementation, debugging, best practices..."
            className="flex-1 h-11 bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}