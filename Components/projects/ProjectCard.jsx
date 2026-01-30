import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Zap, 
  TrendingUp, 
  Bookmark, 
  ArrowRight,
  Layers,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

const complexityColors = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  Advanced: 'bg-rose-50 text-rose-700 border-rose-200'
};

const domainIcons = {
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

export default function ProjectCard({ 
  project, 
  onViewDetails, 
  onSave,
  isSaved = false,
  delay = 0 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      
      <div className="relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-500">
        {}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{domainIcons[project.domain] || '💡'}</span>
              <div>
                <Badge variant="outline" className={cn("text-xs font-medium", complexityColors[project.complexity])}>
                  {project.complexity}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {project.is_trending && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                </motion.div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-colors",
                  isSaved ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-indigo-600"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSave?.(project);
                }}
              >
                <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
              </Button>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {project.title}
          </h3>
          
          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
            {project.description}
          </p>

          {}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech_stack?.slice(0, 4).map((tech, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="bg-slate-100 text-slate-600 text-xs font-normal hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {tech}
              </Badge>
            ))}
            {project.tech_stack?.length > 4 && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-400 text-xs">
                +{project.tech_stack.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{project.estimated_time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{project.domain}</span>
              </div>
            </div>
            
            <Button 
              size="sm"
              className="bg-slate-900 hover:bg-indigo-600 text-white rounded-lg gap-1.5 text-xs transition-all duration-300"
              onClick={() => onViewDetails?.(project)}
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}