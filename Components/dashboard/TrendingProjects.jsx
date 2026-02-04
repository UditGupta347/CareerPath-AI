import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function TrendingProjects({ projects, onViewProject }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg shadow-slate-200/50">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-slate-900">Trending Now</h3>
        </div>
        <Badge className="bg-orange-100 text-orange-700 border-0">
          <TrendingUp className="w-3 h-3 mr-1" />
          Hot
        </Badge>
      </div>
      
      <div className="divide-y divide-slate-100">
        {projects?.slice(0, 5).map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
            onClick={() => onViewProject?.(project)}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{domainEmojis[project.domain] || '💡'}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {project.complexity}
                  </Badge>
                  <span className="text-xs text-slate-400">{project.domain}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}