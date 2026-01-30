import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronRight,
  Clock,
  Target,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

const phaseIcons = {
  'Design': '🎨',
  'Development': '💻',
  'Testing': '🧪',
  'Deployment': '🚀'
};

const phaseColors = {
  'Design': 'from-purple-500 to-indigo-500',
  'Development': 'from-blue-500 to-cyan-500',
  'Testing': 'from-amber-500 to-orange-500',
  'Deployment': 'from-emerald-500 to-green-500'
};

export default function RoadmapView({ roadmap, completedMilestones = [], onMilestoneToggle }) {
  const [expandedPhases, setExpandedPhases] = useState(['Design']);

  if (!roadmap?.phases) return null;

  const togglePhase = (phaseName) => {
    setExpandedPhases(prev => 
      prev.includes(phaseName) 
        ? prev.filter(p => p !== phaseName)
        : [...prev, phaseName]
    );
  };

  const totalTasks = roadmap.phases.reduce((acc, phase) => acc + (phase.tasks?.length || 0), 0);
  const completedTasks = completedMilestones.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      {}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Project Progress</h3>
            <p className="text-indigo-100 text-sm">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <div className="text-4xl font-bold">
            {Math.round(progressPercent)}%
          </div>
        </div>
        <Progress value={progressPercent} className="h-2 bg-white/20" />
      </div>

      {}
      <div className="space-y-4">
        {roadmap.phases.map((phase, phaseIndex) => {
          const isExpanded = expandedPhases.includes(phase.name);
          const phaseTasks = phase.tasks || [];
          const phaseCompleted = phaseTasks.filter(t => 
            completedMilestones.includes(`${phase.name}-${t.id}`)
          ).length;
          const phaseProgress = phaseTasks.length > 0 
            ? (phaseCompleted / phaseTasks.length) * 100 
            : 0;

          return (
            <motion.div
              key={phase.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: phaseIndex * 0.1 }}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm"
            >
              {}
              <button
                onClick={() => togglePhase(phase.name)}
                className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                  "bg-gradient-to-br",
                  phaseColors[phase.name] || 'from-slate-500 to-slate-600'
                )}>
                  {phaseIcons[phase.name] || '📋'}
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900">{phase.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {phaseCompleted}/{phaseTasks.length}
                    </Badge>
                  </div>
                  <div className="mt-1.5 w-full max-w-xs">
                    <Progress value={phaseProgress} className="h-1.5" />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{phase.duration}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
              </button>

              {}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-100"
                  >
                    <div className="p-4 space-y-2">
                      {phaseTasks.map((task, taskIndex) => {
                        const taskId = `${phase.name}-${task.id}`;
                        const isCompleted = completedMilestones.includes(taskId);

                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: taskIndex * 0.05 }}
                            onClick={() => onMilestoneToggle?.(taskId)}
                            className={cn(
                              "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all",
                              isCompleted 
                                ? "bg-emerald-50 hover:bg-emerald-100" 
                                : "bg-slate-50 hover:bg-slate-100"
                            )}
                          >
                            <div className="mt-0.5">
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-300" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={cn(
                                "text-sm font-medium",
                                isCompleted ? "text-emerald-700 line-through" : "text-slate-700"
                              )}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            {task.duration && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                {task.duration}
                              </Badge>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}