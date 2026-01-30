import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import AnimatedBackground from '@/components/ui/AnimatedBackground';

export default function ResumeBuilder() {
  const [user, setUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await api.auth.me();
      setUser(userData);
    } catch (e) { }
  };

  const { data: savedProjects = [] } = useQuery({
    queryKey: ['savedProjects', user?.email],
    queryFn: () => api.entities.SavedProject.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.entities.Project.list()
  });

  const enrichedProjects = savedProjects.map(sp => {
    const project = allProjects.find(p => p.id === sp.project_id);
    return { ...sp, project };
  }).filter(p => p.project);

  const generateResumeMutation = useMutation({
    mutationFn: async (projectId) => {
      setStatusMessage('🔍 Finding project details...');
      console.log('🚀 Starting resume generation for project:', projectId);
      const project = allProjects.find(p => p.id === projectId);

      if (!project) {
        console.error('❌ Project not found:', projectId);
        throw new Error('Project not found');
      }

      setStatusMessage(`📝 Preparing content for "${project.title}"...`);
      console.log('📝 Project details:', { title: project.title, domain: project.domain, complexity: project.complexity });

      setStatusMessage('🤖 Generating professional resume content with Groq AI...');
      console.log('🤖 Calling Groq API...');

      // Use Groq service for resume generation
      const { generateResumeContent } = await import('@/services/resumeBuilderService');
      const result = await generateResumeContent(project);

      setStatusMessage('✅ Content generated successfully!');
      console.log('✅ AI response received:', result);

      return result;
    },
    onSuccess: (data) => {
      console.log('✅ Resume content generated successfully!');
      setGeneratedContent(data);
      setTimeout(() => setStatusMessage(''), 2000);
      toast.success('Resume content generated!');
    },
    onError: (error) => {
      console.error('❌ Resume generation failed:', error);
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      const errorMessage = error.message || 'Unknown error occurred';
      let userMessage = errorMessage;

      if (errorMessage.includes('API key') || errorMessage.includes('not configured')) {
        userMessage = '🔑 Groq API Key Required\n\nPlease add VITE_GROQ_API_KEY to your .env file.\n\nGet your FREE key from: https://console.groq.com';
      } else if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        userMessage = '⚠️ API Quota Exceeded\n\nPlease wait a few moments and try again.';
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('401') || errorMessage.includes('403')) {
        userMessage = '🔐 Invalid API Key\n\nYour Groq API key is invalid. Please check your .env file.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        userMessage = '🌐 Connection Error\n\nUnable to connect to Groq AI. Please check your internet connection.';
      }

      setStatusMessage(`❌ Error: ${userMessage}`);
      toast.error(`Failed to generate resume content: ${userMessage}`);
      setTimeout(() => setStatusMessage(''), 5000);
    }
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen pb-20">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto px-4 pt-28">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Resume Builder</h1>
            </div>
            <p className="text-slate-600">Create professional resume descriptions for your projects</p>
          </motion.div>

          <div className="w-full">
            <div className="grid lg:grid-cols-2 gap-6">
              { }
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-6 shadow-lg">
                  <h3 className="font-semibold text-slate-900 mb-4">Select Your Project</h3>

                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose a project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {enrichedProjects.map((item) => (
                        <SelectItem key={item.project.id} value={item.project.id}>
                          {item.project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    className="w-full mt-4 gap-2 bg-indigo-600 hover:bg-indigo-700"
                    disabled={!selectedProject || generateResumeMutation.isPending}
                    onClick={() => generateResumeMutation.mutate(selectedProject)}
                  >
                    {generateResumeMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Resume Content
                      </>
                    )}
                  </Button>

                  { }
                  {statusMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 rounded-lg bg-indigo-50 border border-indigo-200"
                    >
                      <p className="text-sm text-indigo-900 font-medium">{statusMessage}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              { }
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {generatedContent ? (
                  <>
                    { }
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-slate-900">Resume Bullet Points</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleCopy(generatedContent.bulletPoints.join('\n'))}
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <ul className="space-y-3">
                        {generatedContent.bulletPoints?.map((point, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-slate-700">
                            <span className="text-indigo-600">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    { }
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">Tech Stack</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleCopy(generatedContent.techStack)}
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-slate-700">{generatedContent.techStack}</p>
                    </div>

                    { }
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">Impact Statement</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleCopy(generatedContent.impactStatement)}
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-slate-700">{generatedContent.impactStatement}</p>
                    </div>

                    { }
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-slate-900">GitHub README Template</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleCopy(generatedContent.readmeTemplate)}
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs overflow-x-auto whitespace-pre-wrap">
                        {generatedContent.readmeTemplate}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-12 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Select a project and generate content to see results</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
