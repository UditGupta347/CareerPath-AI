import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function LearningTimeline({ timeline }) {
    if (!timeline || !timeline.success || !timeline.milestones) {
        return null;
    }

    const { totalWeeks, totalMonths, milestones, estimatedCompletion, totalSkills } = timeline;

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Programming Language': '💻',
            'Framework': '🎨',
            'Tool': '🔧',
            'Concept': '📚'
        };
        return icons[category] || '📘';
    };

    return (
        <div className="space-y-6">
            {}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            Learning Timeline
                        </h2>
                        <p className="text-slate-600">
                            Suggested learning path to acquire missing skills
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-1">
                            {estimatedCompletion}
                        </div>
                        <div className="text-sm text-slate-600">Total Time</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                            {totalSkills}
                        </div>
                        <div className="text-xs text-slate-600">Skills to Learn</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600 mb-1">
                            {totalWeeks}
                        </div>
                        <div className="text-xs text-slate-600">Weeks</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-pink-600 mb-1">
                            {milestones.length}
                        </div>
                        <div className="text-xs text-slate-600">Phases</div>
                    </div>
                </div>
            </Card>

            {}
            <Card className="p-6">
                <div className="relative">
                    {milestones.map((milestone, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.15 }}
                            className="relative mb-8 last:mb-0"
                        >
                            {}
                            {idx < milestones.length - 1 && (
                                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-indigo-600 to-purple-600 opacity-30" />
                            )}

                            <div className="flex gap-4">
                                {}
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg z-10">
                                        {milestone.phase}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2 font-medium">
                                        Weeks {milestone.startWeek}-{milestone.endWeek}
                                    </div>
                                </div>

                                {}
                                <div className="flex-1 pb-4">
                                    <Card className="p-5 bg-gradient-to-br from-slate-50 to-white border-2 border-indigo-100 hover:border-indigo-300 transition-colors">
                                        {}
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-1">
                                                    Phase {milestone.phase}
                                                </h3>
                                                <p className="text-sm text-slate-600">
                                                    {milestone.skills.length} skill{milestone.skills.length > 1 ? 's' : ''} to learn
                                                </p>
                                            </div>
                                            <Badge className="bg-indigo-100 text-indigo-800">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {milestone.durationWeeks} week{milestone.durationWeeks > 1 ? 's' : ''}
                                            </Badge>
                                        </div>

                                        {}
                                        <div className="space-y-3">
                                            {milestone.skills.map((skill, skillIdx) => (
                                                <div
                                                    key={skillIdx}
                                                    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200"
                                                >
                                                    <div className="text-2xl mt-0.5">
                                                        {getCategoryIcon(skill.category)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-semibold text-slate-900">
                                                                {skill.skill}
                                                            </span>
                                                            <Badge variant="outline" className={getPriorityColor(skill.priority)}>
                                                                {skill.priority}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs text-slate-600">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {skill.weeks} week{skill.weeks > 1 ? 's' : ''}
                                                            </span>
                                                            <span className="text-indigo-600 font-medium">
                                                                {skill.category}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {}
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <div className="flex items-center justify-between text-xs text-slate-600">
                                                <span>Phase Completion</span>
                                                <span className="font-semibold">
                                                    {Math.round(((milestone.endWeek) / totalWeeks) * 100)}% of total timeline
                                                </span>
                                            </div>
                                            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all"
                                                    style={{ width: `${((milestone.endWeek) / totalWeeks) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: milestones.length * 0.15 }}
                    className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-green-900 mb-1">
                                Complete this timeline and you'll be ready for your target role!
                            </h4>
                            <p className="text-sm text-green-700">
                                Stay consistent, build projects, and track your progress along the way.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </Card>

            {}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Learning Tips
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Focus on one skill at a time for better retention</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Build projects while learning to apply knowledge practically</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Use the recommended projects below to practice your new skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Track your progress and adjust the timeline as needed</span>
                    </li>
                </ul>
            </Card>
        </div>
    );
}
