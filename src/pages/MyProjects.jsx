import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Bookmark, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Trash2,
  Clock,
  Layers,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

import AnimatedBackground from '@/components/ui/AnimatedBackground';

const domainEmojis = {
  'AI/ML': '🤖',
  'Web Development': '🌐',
  'Mobile Development': '📱',
  'IoT': '🔌',
  'Cybersecurity': '🔒',
  'Blockchain': '⛓️',
  'Cloud Computing': '☁️',
  'AR/VR': '🥽',
  'Data Science': '📊',
  'DevOps': '⚙️'
};

const statusConfig = {
  saved: { label: 'Saved', color: 'bg-slate-100 text-slate-700', icon: Bookmark },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Play },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 }
};

export default function MyProjects() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await api.auth.me();
      setUser(userData);
    } catch (e) {
      navigate(createPageUrl('Home'));
    }
  };

  const { data: savedProjects = [], isLoading: loadingSaved } = useQuery({
    queryKey: ['savedProjects', user?.email],
    queryFn: () => api.entities.SavedProject.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const { data: allProjects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.entities.Project.list()
  });

  const deleteMutation = useMutation({
    mutationFn: async (savedProjectId) => {
      await api.entities.SavedProject.delete(savedProjectId);
    },
    onSuccess: () => queryClient.invalidateQueries(['savedProjects'])
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.entities.SavedProject.update(id, { status });
    },
    onSuccess: () => queryClient.invalidateQueries(['savedProjects'])
  });

  const enrichedProjects = savedProjects.map(sp => {
    const project = allProjects.find(p => p.id === sp.project_id);
    return { ...sp, project };
  }).filter(p => p.project);

  const filteredProjects = activeTab === 'all' 
    ? enrichedProjects 
    : enrichedProjects.filter(p => p.status === activeTab);

  const isLoading = loadingSaved || loadingProjects;

  const stats = {
    all: enrichedProjects.length,
    saved: enrichedProjects.filter(p => p.status === 'saved').length,
    in_progress: enrichedProjects.filter(p => p.status === 'in_progress').length,
    completed: enrichedProjects.filter(p => p.status === 'completed').length
  };

  return (
    <div className="min-h-screen pb-20">
      <AnimatedBackground />
      
      <div className="relative pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Projects</h1>
            <p className="text-slate-600">Track and manage your saved projects</p>
          </motion.div>

          {}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {Object.entries(stats).map(([key, value], idx) => {
              const config = statusConfig[key];
              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-left",
                    activeTab === key 
                      ? "border-indigo-500 bg-indigo-50" 
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-500 capitalize">
                    {key === 'all' ? 'All Projects' : config?.label || key}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects yet</h3>
              <p className="text-slate-500 mb-6">Start by exploring and saving projects</p>
              <Button
                onClick={() => navigate(createPageUrl('Explore'))}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Explore Projects
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((item, idx) => {
                const config = statusConfig[item.status];
                const StatusIcon = config?.icon || Bookmark;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{domainEmojis[item.project.domain] || '💡'}</span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", config?.color)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config?.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.project.complexity}
                          </Badge>
                        </div>

                        <h3 
                          className="font-semibold text-slate-900 mb-1 hover:text-indigo-600 cursor-pointer transition-colors"
                          onClick={() => navigate(createPageUrl('ProjectDetails') + `?id=${item.project.id}`)}
                        >
                          {item.project.title}
                        </h3>
                        
                        <p className="text-sm text-slate-500 line-clamp-1 mb-3">
                          {item.project.description}
                        </p>

                        {}
                        <div className="flex items-center gap-4">
                          <div className="flex-1 max-w-xs">
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                              <span>Progress</span>
                              <span>{item.progress || 0}%</span>
                            </div>
                            <Progress value={item.progress || 0} className="h-2" />
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.project.estimated_time}</span>
                          </div>
                        </div>
                      </div>

                      {}
                      <div className="flex items-center gap-2">
                        {item.status === 'saved' && (
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 gap-1"
                            onClick={() => updateStatusMutation.mutate({ id: item.id, status: 'in_progress' })}
                          >
                            <Play className="w-3.5 h-3.5" />
                            Start
                          </Button>
                        )}
                        {item.status === 'in_progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            onClick={() => updateStatusMutation.mutate({ id: item.id, status: 'completed' })}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => navigate(createPageUrl('ProjectDetails') + `?id=${item.project.id}`)}
                        >
                          View
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => deleteMutation.mutate(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
