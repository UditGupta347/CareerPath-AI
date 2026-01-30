import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Loader2, Grid3X3, List, RefreshCw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import AnimatedBackground from '@/components/ui/AnimatedBackground';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilters from '@/components/projects/ProjectFilters';

export default function Explore() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ domain: 'All Domains', complexity: 'All Levels' });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [user, setUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState(null);

  React.useEffect(() => {
    loadUser();
    loadCacheInfo();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await api.auth.me();
      setUser(userData);
    } catch (e) { }
  };

  const loadCacheInfo = async () => {
    try {
      const { getCacheStats } = await import('@/services/dynamicProjectService');
      const stats = getCacheStats();
      setCacheInfo(stats);
    } catch (e) {
      console.error('Failed to load cache info:', e);
    }
  };

  const handleRefreshProjects = async () => {
    setIsRefreshing(true);
    try {
      
      const { mockProjects } = await import('@/services/mockData');
      const { getDynamicProjects } = await import('@/services/dynamicProjectService');
      const { getMarketTrends } = await import('@/services/marketDataService');

      console.log('🔄 Refreshing projects based on market trends...');

      
      const TOTAL_PROJECTS = 12;

      
      const trends = await getMarketTrends();
      const topTrendingDomains = Object.entries(trends.domains)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([domain]) => domain);

      console.log('📈 Top trending domains:', topTrendingDomains);

      
      const dynamicProjects = await getDynamicProjects(true); 
      console.log('🤖 Generated', dynamicProjects.length, 'dynamic projects');

      
      let finalProjects = [];

      if (dynamicProjects.length >= 6) {
        
        const shuffledCurated = [...mockProjects].sort(() => Math.random() - 0.5);
        const keptCurated = shuffledCurated.slice(0, 6);

        
        const trendingDynamic = dynamicProjects
          .filter(p => topTrendingDomains.includes(p.domain))
          .slice(0, 6);

        const selectedDynamic = trendingDynamic.length >= 6
          ? trendingDynamic
          : [...trendingDynamic, ...dynamicProjects.slice(0, 6 - trendingDynamic.length)];

        finalProjects = [...keptCurated, ...selectedDynamic.slice(0, 6)];
        console.log(`✅ Blend: ${keptCurated.length} curated + ${selectedDynamic.slice(0, 6).length} dynamic`);
      } else {
        
        const dynamicCount = dynamicProjects.length;
        const curatedNeeded = TOTAL_PROJECTS - dynamicCount;

        const shuffledCurated = [...mockProjects].sort(() => Math.random() - 0.5);
        const keptCurated = shuffledCurated.slice(0, curatedNeeded);

        finalProjects = [...keptCurated, ...dynamicProjects];
        console.log(`✅ Fallback: ${keptCurated.length} curated + ${dynamicProjects.length} dynamic`);
      }

      
      const blendedProjects = finalProjects
        .sort(() => Math.random() - 0.5)
        .slice(0, TOTAL_PROJECTS); 

      
      if (blendedProjects.length < TOTAL_PROJECTS) {
        const needed = TOTAL_PROJECTS - blendedProjects.length;
        const additional = [...mockProjects]
          .sort(() => Math.random() - 0.5)
          .slice(0, needed);
        blendedProjects.push(...additional);
        console.log(`⚠️ Added ${needed} more curated projects to reach 12`);
      }

      console.log(`✅ Final count: ${blendedProjects.length} projects (target: ${TOTAL_PROJECTS})`);

      
      const store = await import('@/store/projectStore');
      store.useProjectStore.getState().setProjects(blendedProjects);

      
      queryClient.invalidateQueries(['projects']);
      await loadCacheInfo();
    } catch (error) {
      console.error('Failed to refresh projects:', error);
      alert('Failed to generate dynamic projects. Please check console for details.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.entities.Project.list('-created_date', 12), 
    onSuccess: (data) => {
      console.log('📊 Explore page loaded with', data.length, 'projects');
      loadCacheInfo();
    }
  });

  const { data: savedProjects = [] } = useQuery({
    queryKey: ['savedProjects', user?.email],
    queryFn: () => api.entities.SavedProject.filter({ user_email: user?.email }),
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

  const filteredProjects = projects.filter(project => {
    const matchesDomain = filters.domain === 'All Domains' || project.domain === filters.domain;
    const matchesComplexity = filters.complexity === 'All Levels' || project.complexity === filters.complexity;
    const matchesSearch = !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech_stack?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesComplexity && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20">
      <AnimatedBackground />

      <div className="relative pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Explore Projects</h1>
                <p className="text-slate-600">
                  Discover {projects.length}+ AI-generated project ideas based on 2026 market trends
                  {cacheInfo?.exists && (
                    <span className="ml-2 text-sm text-slate-500">
                      • Updated {cacheInfo.hoursOld}h ago
                    </span>
                  )}
                </p>
              </div>
              <Button
                onClick={handleRefreshProjects}
                disabled={isRefreshing}
                className="gap-2"
                variant="outline"
              >
                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Projects'}
              </Button>
            </div>
            {cacheInfo?.exists && (
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <TrendingUp className="w-3 h-3" />
                <span>Dynamic projects powered by Gemini AI • Cache expires in {cacheInfo.hoursRemaining}h</span>
              </div>
            )}
          </motion.div>

          {}
          <div className="mb-6">
            <ProjectFilters
              filters={filters}
              onFilterChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              Showing {filteredProjects.length} projects
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-lg",
                  viewMode === 'grid' && "bg-slate-100"
                )}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-lg",
                  viewMode === 'list' && "bg-slate-100"
                )}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
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
                <Grid3X3 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms</p>
            </motion.div>
          ) : (
            <div className={cn(
              "grid gap-4",
              viewMode === 'grid'
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 max-w-3xl"
            )}>
              {filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  delay={idx * 0.03}
                  isSaved={savedProjects.some(sp => sp.project_id === project.id)}
                  onViewDetails={() => navigate(createPageUrl('ProjectDetails') + `?id=${project.id}`)}
                  onSave={() => saveProjectMutation.mutate(project)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
