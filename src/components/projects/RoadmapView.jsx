import React, { useState, useEffect } from 'react';
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

export default function RoadmapView({
  roadmap,
  completedMilestones = [],
  onMilestoneToggle,
  isLoading = false,
  error = null,
  onRegenerate,
  isGenerated = false
}) {
  
  const [expandedPhases, setExpandedPhases] = useState(() =>
    roadmap?.phases?.map(phase => phase.name) || []
  );

  
  useEffect(() => {
    console.log('RoadmapView - roadmap data:', roadmap);
    console.log('RoadmapView - phases:', roadmap?.phases);

    
    if (roadmap?.phases && roadmap.phases.length > 0) {
      const allPhaseNames = roadmap.phases.map(phase => phase.name);
      console.log('RoadmapView - expanding phases:', allPhaseNames);
      setExpandedPhases(allPhaseNames);
    }
  }, [roadmap]);

  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-semibold">Generating roadmap with AI...</p>
          </div>
          <p className="text-indigo-100 text-sm text-center mt-2">
            This may take 5-10 seconds
          </p>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h3 className="text-red-800 font-semibold mb-2">Failed to Load Roadmap</h3>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        {onRegenerate && (
          <Button onClick={onRegenerate} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (!roadmap?.phases) {
    console.log('RoadmapView - No roadmap phases found, returning null');
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-slate-600">No roadmap available for this project.</p>
      </div>
    );
  }

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
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">Project Progress</h3>
              {isGenerated && (
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  🤖 AI Generated
                </Badge>
              )}
            </div>
            <p className="text-indigo-100 text-sm">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold">
              {Math.round(progressPercent)}%
            </div>
            {isGenerated && onRegenerate && (
              <Button
                onClick={onRegenerate}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-xs"
              >
                ↻ Regenerate
              </Button>
            )}
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