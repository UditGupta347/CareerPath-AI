import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Clock, TrendingUp, ExternalLink, BookmarkPlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';

export default function ProjectRecommendations({ projects, skillGaps }) {
    const navigate = useNavigate();
    const { saveProject } = useProjectStore();

    if (!projects || projects.length === 0) {
        return (
            <Card className="p-8 text-center">
                <p className="text-slate-600">No project recommendations available.</p>
            </Card>
        );
    }

    const handleViewProject = (project) => {
        navigate('/ProjectDetails', { state: { project } });
    };

    const handleSaveProject = (project) => {
        saveProject(project);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Recommended Projects
                    </h2>
                    <p className="text-slate-600">
                        Projects that will help you fill your skill gaps
                    </p>
                </div>
                <Badge className="bg-indigo-600 text-white px-4 py-2">
                    {projects.length} Projects
                </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project, idx) => (
                    <motion.div
                        key={project.id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-shadow border-l-4 border-l-indigo-600">
                            {}
                            <div className="mb-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-bold text-slate-900 flex-1">
                                        {project.title}
                                    </h3>
                                    {project.is_trending && (
                                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white ml-2">
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            Trending
                                        </Badge>
                                    )}
                                </div>

                                <p className="text-sm text-slate-600 line-clamp-2">
                                    {project.description}
                                </p>
                            </div>

                            {}
                            {project.matchedGapSkills && project.matchedGapSkills.length > 0 && (
                                <div className="mb-4">
                                    <div className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                                        <Rocket className="w-3 h-3" />
                                        Skills You'll Learn from Your Gap List:
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {project.matchedGapSkills.map((skill, i) => (
                                            <Badge key={i} className="bg-green-100 text-green-800 text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tech Stack */}
                            {project.tech_stack && project.tech_stack.length > 0 && (
                                <div className="mb-4">
                                    <div className="text-xs font-semibold text-slate-700 mb-2">
                                        Tech Stack:
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {project.tech_stack.slice(0, 5).map((tech, i) => (
                                            <Badge key={i} variant="outline" className="text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                        {project.tech_stack.length > 5 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{project.tech_stack.length - 5} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Project Meta */}
                            <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {project.estimated_time || '3-4 weeks'}
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {project.complexity || 'Intermediate'}
                                </Badge>
                                {project.domain && (
                                    <Badge variant="outline" className="text-xs">
                                        {project.domain}
                                    </Badge>
                                )}
                            </div>

                            {}
                            {project.gapScore && (
                                <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                                    <div className="text-xs text-indigo-900 font-semibold mb-1">
                                        Skill Gap Match
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-indigo-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-600 rounded-full"
                                                style={{ width: `${Math.min(100, project.gapScore * 20)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-indigo-600">
                                            {project.gapScore}/5
                                        </span>
                                    </div>
                                </div>
                            )}

                            {}
                            <div className="flex gap-2 mt-auto">
                                <Button
                                    onClick={() => handleViewProject(project)}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                    size="sm"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View Details
                                </Button>
                                <Button
                                    onClick={() => handleSaveProject(project)}
                                    variant="outline"
                                    size="sm"
                                >
                                    <BookmarkPlus className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
