import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  BookOpen, 
  Github, 
  FileText,
  ExternalLink,
  Clock,
  Star,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const resourceTypeIcons = {
  video: Play,
  course: GraduationCap,
  github: Github,
  article: FileText,
  documentation: BookOpen
};

const levelColors = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-rose-100 text-rose-700'
};

export default function ResourcesView({ resources, weeklyPlan }) {
  const [activeLevel, setActiveLevel] = useState('all');

  const groupedResources = resources?.reduce((acc, resource) => {
    const type = resource.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(resource);
    return acc;
  }, {}) || {};

  const filteredResources = activeLevel === 'all' 
    ? resources 
    : resources?.filter(r => r.level === activeLevel);

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 mr-2">Filter by level:</span>
        {['all', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
          <Button
            key={level}
            variant={activeLevel === level ? 'default' : 'outline'}
            size="sm"
            className={cn(
              "rounded-full text-xs",
              activeLevel === level && "bg-indigo-600 hover:bg-indigo-700"
            )}
            onClick={() => setActiveLevel(level)}
          >
            {level === 'all' ? 'All Levels' : level}
          </Button>
        ))}
      </div>

      {}
      {weeklyPlan && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Weekly Learning Plan
          </h3>
          <div className="grid gap-3">
            {weeklyPlan.map((week, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-4 border border-indigo-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">
                      W{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{week.title}</h4>
                      <p className="text-xs text-slate-500">{week.hours} hours estimated</p>
                    </div>
                  </div>
                  <Badge variant="outline">{week.focus}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
          <TabsTrigger value="video" className="rounded-lg">Videos</TabsTrigger>
          <TabsTrigger value="course" className="rounded-lg">Courses</TabsTrigger>
          <TabsTrigger value="github" className="rounded-lg">GitHub</TabsTrigger>
          <TabsTrigger value="article" className="rounded-lg">Articles</TabsTrigger>
        </TabsList>

        {['all', 'video', 'course', 'github', 'article'].map(type => (
          <TabsContent key={type} value={type} className="mt-4">
            <div className="grid gap-3">
              {(type === 'all' ? filteredResources : filteredResources?.filter(r => r.type === type))?.map((resource, idx) => {
                const Icon = resourceTypeIcons[resource.type] || FileText;
                
                return (
                  <motion.a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">{resource.source}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={cn("text-xs", levelColors[resource.level])}>
                        {resource.level}
                      </Badge>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}