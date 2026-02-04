import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, TrendingUp, Award, Target, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function GapAnalysisResults({ data }) {
    const { userSkills, gapAnalysis } = data;

    if (!gapAnalysis || !gapAnalysis.success) {
        return null;
    }

    const { matchPercentage, required, preferred, tools, roleDetails, aiRecommendations } = gapAnalysis;

    const getMatchColor = (percentage) => {
        if (percentage >= 80) return 'text-green-600 bg-green-50';
        if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
        if (percentage >= 40) return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="space-y-6">
            {}
            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            Role Match Analysis
                        </h2>
                        <p className="text-slate-600">
                            Comparing your skills with <span className="font-semibold text-indigo-600">{gapAnalysis.role}</span>
                        </p>
                    </div>
                    <div className={`text-6xl font-bold ${getMatchColor(matchPercentage)} rounded-2xl px-6 py-4`}>
                        {matchPercentage}%
                    </div>
                </div>

                <Progress value={matchPercentage} className="h-3 mb-4" />

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                            {required.matchCount}
                        </div>
                        <div className="text-sm text-slate-600">Required Skills Matched</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                            {preferred.matchCount}
                        </div>
                        <div className="text-sm text-slate-600">Preferred Skills Matched</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-3xl font-bold text-purple-600 mb-1">
                            {tools.matchCount}
                        </div>
                        <div className="text-sm text-slate-600">Tools Matched</div>
                    </div>
                </div>
            </Card>

            {}
            <div className="grid lg:grid-cols-2 gap-6">
                {}
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <h3 className="text-xl font-bold text-slate-900">Your Skills</h3>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(userSkills).map(([category, skills]) => {
                            if (!skills || skills.length === 0) return null;

                            return (
                                <div key={category}>
                                    <div className="text-sm font-semibold text-slate-700 mb-2 capitalize">
                                        {category}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, idx) => (
                                            <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {}
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-orange-600" />
                        <h3 className="text-xl font-bold text-slate-900">Skills to Learn</h3>
                    </div>

                    <div className="space-y-4">
                        {required.gaps.length > 0 && (
                            <div>
                                <div className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Required Skills ({required.gaps.length})
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {required.gaps.map((skill, idx) => (
                                        <Badge key={idx} className="bg-red-100 text-red-800 border-red-300">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {preferred.gaps.length > 0 && (
                            <div>
                                <div className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    Preferred Skills ({preferred.gaps.length})
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {preferred.gaps.map((skill, idx) => (
                                        <Badge key={idx} variant="outline" className="border-orange-400 text-orange-700">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tools.gaps.length > 0 && (
                            <div>
                                <div className="text-sm font-semibold text-amber-700 mb-2">
                                    Tools ({tools.gaps.length})
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tools.gaps.map((skill, idx) => (
                                        <Badge key={idx} variant="outline" className="border-amber-400 text-amber-700">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {}
            {aiRecommendations && aiRecommendations.recommendations && aiRecommendations.recommendations.length > 0 && (
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-xl font-bold text-slate-900">AI Learning Recommendations</h3>
                    </div>

                    <p className="text-sm text-slate-700 mb-4 italic">
                        {aiRecommendations.learningPath}
                    </p>

                    <div className="space-y-3">
                        {aiRecommendations.recommendations.slice(0, 5).map((rec, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-4 rounded-lg border border-indigo-100"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="font-semibold text-slate-900">{rec.skill}</div>
                                    <Badge className={
                                        rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                                            rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                    }>
                                        {rec.priority} Priority
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{rec.reason}</p>
                                {rec.prerequisites && rec.prerequisites.length > 0 && (
                                    <div className="text-xs text-indigo-600">
                                        Prerequisites: {rec.prerequisites.join(', ')}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="text-center text-sm text-slate-600">
                        <span className="font-semibold">Estimated Learning Time:</span> {aiRecommendations.estimatedTime}
                    </div>
                </Card>
            )}
        </div>
    );
}
