import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  Trash2,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import AnimatedBackground from '@/components/ui/AnimatedBackground';
import ChatInterface from '@/components/chat/ChatInterface';

export default function Assistant() {
  const [user, setUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {}
  };

  const { data: conversations = [], refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      try {
        const convs = await base44.agents.listConversations({
          agent_name: 'project_assistant'
        });
        return convs || [];
      } catch (e) {
        return [];
      }
    },
    enabled: !!user
  });

  return (
    <div className="min-h-screen pb-20">
      <AnimatedBackground />
      
      <div className="relative pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Assistant</h1>
            <p className="text-slate-600">Get help with implementation, debugging, and best practices</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "lg:col-span-1",
                !showHistory && "hidden lg:block"
              )}
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 overflow-hidden shadow-lg">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">History</h3>
                    <Badge variant="outline" className="text-xs">
                      {conversations.length} chats
                    </Badge>
                  </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="p-6 text-center">
                      <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No conversations yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className={cn(
                            "w-full p-4 text-left hover:bg-slate-50 transition-colors",
                            selectedConversation?.id === conv.id && "bg-indigo-50"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-slate-900 truncate">
                              {conv.metadata?.name || 'Untitled Chat'}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>
                              {conv.created_date && format(new Date(conv.created_date), 'MMM d, h:mm a')}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-100">
                  <Button
                    className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <Plus className="w-4 h-4" />
                    New Chat
                  </Button>
                </div>
              </div>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 h-[700px]"
            >
              <ChatInterface 
                key={selectedConversation?.id || 'new'}
                projectContext={null}
              />
            </motion.div>
          </div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid sm:grid-cols-3 gap-4"
          >
            {[
              {
                title: "Implementation Help",
                examples: ["How do I implement JWT auth?", "Best way to handle API errors?"]
              },
              {
                title: "Architecture Advice",
                examples: ["Which database for my project?", "Microservices vs Monolith?"]
              },
              {
                title: "Code Optimization",
                examples: ["Optimize this function", "Best practices for React hooks"]
              }
            ].map((category, idx) => (
              <div 
                key={idx}
                className="bg-white/80 backdrop-blur-xl rounded-xl border border-slate-100 p-4"
              >
                <h4 className="font-medium text-slate-900 mb-2">{category.title}</h4>
                <div className="space-y-1">
                  {category.examples.map((example, i) => (
                    <p key={i} className="text-xs text-slate-500">• {example}</p>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}