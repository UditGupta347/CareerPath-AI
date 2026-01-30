import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Bookmark, 
  Clock, 
  Layers, 
  Target,
  Code2,
  GitBranch,
  Cloud,
  BookOpen,
  MessageSquare,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

import AnimatedBackground from '@/components/ui/AnimatedBackground';
import RoadmapView from '@/components/projects/RoadmapView';
import ResourcesView from '@/components/projects/ResourcesView';
import ChatInterface from '@/components/chat/ChatInterface';

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

const complexityColors = {
  Beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  Advanced: 'bg-rose-100 text-rose-700 border-rose-200'
};

export default function ProjectDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState([]);
  
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {}
  };

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.Project.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId
  });

  const { data: savedProject } = useQuery({
    queryKey: ['savedProject', projectId, user?.email],
    queryFn: async () => {
      const saved = await base44.entities.SavedProject.filter({ 
        project_id: projectId, 
        user_email: user?.email 
      });
      return saved[0];
    },
    enabled: !!projectId && !!user?.email
  });

  useEffect(() => {
    if (savedProject?.completed_milestones) {
      setCompletedMilestones(savedProject.completed_milestones);
    }
  }, [savedProject]);

  const saveProjectMutation = useMutation({
    mutationFn: async () => {
      if (savedProject) {
        await base44.entities.SavedProject.delete(savedProject.id);
      } else {
        await base44.entities.SavedProject.create({
          project_id: projectId,
          user_email: user.email,
          status: 'saved'
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['savedProject', projectId]);
      queryClient.invalidateQueries(['savedProjects']);
    }
  });

  const updateMilestoneMutation = useMutation({
    mutationFn: async (milestoneId) => {
      const newCompleted = completedMilestones.includes(milestoneId)
        ? completedMilestones.filter(m => m !== milestoneId)
        : [...completedMilestones, milestoneId];
      
      setCompletedMilestones(newCompleted);

      if (savedProject) {
        await base44.entities.SavedProject.update(savedProject.id, {
          completed_milestones: newCompleted,
          progress: project?.roadmap?.phases 
            ? Math.round((newCompleted.length / project.roadmap.phases.reduce((acc, p) => acc + (p.tasks?.length || 0), 0)) * 100)
            : 0
        });
      }
    }
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Project not found</h2>
          <Button onClick={() => navigate(createPageUrl('Explore'))}>
            Browse Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <AnimatedBackground />
      
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {}
          <Button
            variant="ghost"
            className="mb-4 gap-2 text-slate-600 hover:text-slate-900"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-6 lg:p-8 shadow-xl mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{domainEmojis[project.domain] || '💡'}</span>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={cn("border", complexityColors[project.complexity])}>
                      {project.complexity}
                    </Badge>
                    {project.is_trending && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0">
                        🔥 Trending
                      </Badge>
                    )}
                  </div>
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
                  {project.title}
                </h1>
                <p className="text-slate-600 mb-6 text-lg">
                  {project.description}
                </p>

                {}
                <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{project.estimated_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span>{project.domain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" />
                    <span>{project.target_roles?.join(', ')}</span>
                  </div>
                </div>
              </div>

              {}
              <div className="flex lg:flex-col gap-3">
                <Button
                  variant={savedProject ? "default" : "outline"}
                  className={cn(
                    "gap-2",
                    savedProject && "bg-indigo-600 hover:bg-indigo-700"
                  )}
                  onClick={() => saveProjectMutation.mutate()}
                >
                  <Bookmark className={cn("w-4 h-4", savedProject && "fill-current")} />
                  {savedProject ? 'Saved' : 'Save Project'}
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Share
                    </>
                  )}
                </Button>
              </div>
            </div>

            {}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-medium text-slate-500 mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.map((tech, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                  >
                    <Code2 className="w-3 h-3 mr-1.5" />
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {}
            {project.use_cases?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-medium text-slate-500 mb-3">Real-World Use Cases</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {project.use_cases.map((useCase, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-sm text-slate-700">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {}
          <Tabs defaultValue="roadmap" className="w-full">
            <TabsList className="bg-white/80 backdrop-blur-xl border border-slate-100 p-1.5 rounded-xl mb-6">
              <TabsTrigger value="roadmap" className="rounded-lg gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <GitBranch className="w-4 h-4" />
                Roadmap
              </TabsTrigger>
              <TabsTrigger value="resources" className="rounded-lg gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="structure" className="rounded-lg gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Code2 className="w-4 h-4" />
                Structure
              </TabsTrigger>
              <TabsTrigger value="assistant" className="rounded-lg gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4" />
                AI Assistant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="roadmap" className="mt-0">
              <RoadmapView 
                roadmap={project.roadmap}
                completedMilestones={completedMilestones}
                onMilestoneToggle={(id) => updateMilestoneMutation.mutate(id)}
              />
            </TabsContent>

            <TabsContent value="resources" className="mt-0">
              <ResourcesView 
                resources={project.resources}
                weeklyPlan={project.weekly_plan}
              />
            </TabsContent>

            <TabsContent value="structure" className="mt-0">
              <div className="grid lg:grid-cols-2 gap-6">
                {}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-indigo-600" />
                    Repository Structure
                  </h3>
                  <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-sm overflow-x-auto">
                    <code>{project.github_structure || 'No structure defined'}</code>
                  </pre>
                </div>

                {}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    Architecture
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {project.architecture || 'No architecture defined'}
                  </p>
                </div>

                {}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-indigo-600" />
                    Deployment Guide
                  </h3>
                  <div className="prose prose-sm max-w-none text-slate-600">
                    <pre className="whitespace-pre-wrap bg-white/50 rounded-xl p-4 border border-indigo-100">
                      {project.deployment_guide || 'No deployment guide defined'}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assistant" className="mt-0">
              <div className="h-[600px]">
                <ChatInterface projectContext={project} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}