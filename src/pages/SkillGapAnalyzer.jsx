import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target,
    Upload,
    Github,
    Linkedin,
    FileText,
    Sparkles,
    TrendingUp,
    Clock,
    Award,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import SkillExtraction from '@/components/skillgap/SkillExtraction';
import GapAnalysisResults from '@/components/skillgap/GapAnalysisResults';
import ProjectRecommendations from '@/components/skillgap/ProjectRecommendations';
import LearningTimeline from '@/components/skillgap/LearningTimeline';
import { getAllRoles } from '@/services/roleDatabase';

export default function SkillGapAnalyzer() {
    const navigate = useNavigate();
    const [step, setStep] = useState('upload'); 
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalysisComplete = (data) => {
        setAnalysisData(data);
        setStep('results');
    };

    const handleReset = () => {
        setStep('upload');
        setAnalysisData(null);
    };

    
    const roles = getAllRoles();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pb-20">
            {}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-16">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">AI-Powered Career Analysis</span>
                        </div>

                        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
                            🔥 Skill Gap Analyzer
                        </h1>

                        <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
                            Upload your resume, GitHub, or LinkedIn profile. Get instant AI-powered skill analysis,
                            role comparison, and personalized project recommendations with a learning timeline.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-200" />
                                <span>6+ Role Comparisons</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-200" />
                                <span>AI Skill Extraction</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-indigo-200" />
                                <span>Learning Timeline</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-indigo-200" />
                                <span>Smart Project Suggestions</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {['Upload', 'Analyze', 'Results'].map((stepName, idx) => {
                        const stepId = ['upload', 'analysis', 'results'][idx];
                        const isActive = step === stepId;
                        const isComplete =
                            (step === 'analysis' && idx === 0) ||
                            (step === 'results' && idx <= 1);

                        return (
                            <React.Fragment key={stepName}>
                                <div className="flex items-center gap-2">
                                    <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all
                    ${isActive ? 'bg-indigo-600 text-white scale-110' : ''}
                    ${isComplete ? 'bg-green-500 text-white' : ''}
                    ${!isActive && !isComplete ? 'bg-slate-200 text-slate-500' : ''}
                  `}>
                                        {isComplete ? '✓' : idx + 1}
                                    </div>
                                    <span className={`
                    font-medium text-sm transition-all
                    ${isActive ? 'text-indigo-600' : ''}
                    ${isComplete ? 'text-green-600' : ''}
                    ${!isActive && !isComplete ? 'text-slate-400' : ''}
                  `}>
                                        {stepName}
                                    </span>
                                </div>

                                {idx < 2 && (
                                    <ArrowRight className={`
                    w-4 h-4 transition-all
                    ${isComplete ? 'text-green-500' : 'text-slate-300'}
                  `} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {}
                <AnimatePresence mode="wait">
                    {step === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <SkillExtraction
                                onAnalysisComplete={handleAnalysisComplete}
                                onStepChange={setStep}
                                onLoadingChange={setLoading}
                            />
                        </motion.div>
                    )}

                    {step === 'results' && analysisData && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {}
                            <GapAnalysisResults data={analysisData} />

                            {}
                            {analysisData.timeline && (
                                <LearningTimeline timeline={analysisData.timeline} />
                            )}

                            {}
                            {analysisData.recommendations && analysisData.recommendations.length > 0 && (
                                <ProjectRecommendations
                                    projects={analysisData.recommendations}
                                    skillGaps={analysisData.gapAnalysis?.required?.gaps || []}
                                />
                            )}

                            {}
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={handleReset}
                                    size="lg"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Analyze Another Profile
                                </Button>
                                <Button
                                    onClick={() => navigate('/Explore')}
                                    size="lg"
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Explore All Projects
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
