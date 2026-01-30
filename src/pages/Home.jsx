import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Search, ArrowRight, Rocket, Brain, BookOpen, MessageSquare } from 'lucide-react';

import AnimatedBackground from '@/components/ui/AnimatedBackground';
import StatsCard from '@/components/dashboard/StatsCard';
import TrendingProjects from '@/components/dashboard/TrendingProjects';
import ProjectCard from '@/components/projects/ProjectCard';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await api.auth.me();
      setUser(userData);

      
      const profiles = await api.entities.UserProfile.filter({ user_email: userData.email });
      if (profiles.length === 0) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.entities.Project.list('-created_date', 50),
    onSuccess: (data) => {
      console.log('🏠 Home page loaded with', data.length, 'projects');
    }
  });

  const { data: savedProjects = [] } = useQuery({
    queryKey: ['savedProjects', user?.email],
    queryFn: () => api.entities.SavedProject.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const profiles = await api.entities.UserProfile.filter({ user_email: user?.email });
      return profiles[0];
    },
    enabled: !!user?.email
  });

  const saveProjectMutation = useMutation({
    mutationFn: async (project) => {
      const existing = savedProjects.find(sp => sp.project_id === project.id);
      if (existing) {
        await api.entities.SavedProject.delete(existing.id);
      } else {
        await api.entities.SavedProject.create({
          project_id: project.id,
          user_email: user.email,
          status: 'saved'
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['savedProjects'])
  });

  const handleOnboardingComplete = async (profile) => {
    await api.entities.UserProfile.create({
      ...profile,
      user_email: user.email
    });
    setShowOnboarding(false);
    queryClient.invalidateQueries(['userProfile']);
  };

  const trendingProjects = projects.filter(p => p.is_trending);

  
  let recommendedProjects = userProfile?.domains?.length > 0
    ? projects.filter(p => userProfile.domains.includes(p.domain))
    : projects;

  
  if (recommendedProjects.length < 4) {
    console.log(`⚠️ Only ${recommendedProjects.length} domain-matched projects, showing all projects instead`);
    recommendedProjects = projects;
  }

  const filteredProjects = searchQuery
    ? projects.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech_stack?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : recommendedProjects;

  
  console.log(`🏠 Home: Displaying ${Math.min(filteredProjects.length, 4)} projects (${filteredProjects.length} available after filtering)`);

  return (
    <div className="min-h-screen pb-20">
      <AnimatedBackground />

      <OnboardingModal
        open={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      {}
      <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-0 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI-Powered Project Discovery
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
              Build Projects That
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Land Jobs</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              AI-curated project ideas with complete roadmaps, resources, and guidance
              tailored for your dream role.
            </p>

            {}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search projects, technologies, or domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 text-lg bg-white/80 backdrop-blur-xl border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { icon: Rocket, label: 'Explore Projects', href: createPageUrl('Explore') },
              { icon: Brain, label: 'AI Generator', href: createPageUrl('Generator') },
              { icon: BookOpen, label: 'My Projects', href: createPageUrl('MyProjects') },
              { icon: MessageSquare, label: 'AI Assistant', href: createPageUrl('Assistant') }
            ].map((item, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="h-auto py-4 px-4 flex flex-col items-center gap-2 bg-white/80 backdrop-blur-xl border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl transition-all"
                onClick={() => navigate(item.href)}
              >
                <item.icon className="w-6 h-6 text-indigo-600" />
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </Button>
            ))}
          </motion.div>

          {}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <StatsCard
              title="Total Projects"
              value={projects.length}
              icon={Rocket}
              delay={0.1}
            />
            <StatsCard
              title="Saved Projects"
              value={savedProjects.length}
              icon={BookOpen}
              delay={0.2}
            />
            <StatsCard
              title="Domains"
              value={10}
              icon={Brain}
              delay={0.3}
            />
            <StatsCard
              title="Resources"
              value="500+"
              icon={BookOpen}
              delay={0.4}
            />
          </div>

          {}
          <div className="grid lg:grid-cols-3 gap-8">
            {}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  {searchQuery ? 'Search Results' : 'Recommended for You'}
                </h2>
                <Button
                  variant="ghost"
                  className="text-indigo-600 hover:text-indigo-700 gap-1"
                  onClick={() => navigate(createPageUrl('Explore'))}
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {loadingProjects ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredProjects.slice(0, 4).map((project, idx) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      delay={idx * 0.05}
                      isSaved={savedProjects.some(sp => sp.project_id === project.id)}
                      onViewDetails={() => navigate(createPageUrl('ProjectDetails') + `?id=${project.id}`)}
                      onSave={() => saveProjectMutation.mutate(project)}
                    />
                  ))}
                </div>
              )}
            </div>

            {}
            <div className="space-y-6">
              <TrendingProjects
                projects={trendingProjects}
                onViewProject={(p) => navigate(createPageUrl('ProjectDetails') + `?id=${p.id}`)}
              />

              {}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Pro Tip
                </h3>
                <p className="text-sm text-indigo-100 leading-relaxed">
                  Complete at least 2-3 projects from different domains to stand out in interviews.
                  Focus on projects that solve real problems!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
