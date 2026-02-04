import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Loader2, Grid3X3, List } from 'lucide-react';
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

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {}
  };

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date', 100)
  });

  const { data: savedProjects = [] } = useQuery({
    queryKey: ['savedProjects', user?.email],
    queryFn: () => base44.entities.SavedProject.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const saveProjectMutation = useMutation({
    mutationFn: async (project) => {
      const existing = savedProjects.find(sp => sp.project_id === project.id);
      if (existing) {
        await base44.entities.SavedProject.delete(existing.id);
      } else {
        await base44.entities.SavedProject.create({
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Explore Projects</h1>
            <p className="text-slate-600">Discover {projects.length}+ curated project ideas across 10 domains</p>
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