import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Github, FileText, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { parseResumeFile, validateGitHubUrl } from '@/utils/fileParser';
import {
    extractSkillsFromText,
    analyzeGitHubProfile,
    performCompleteAnalysis
} from '@/services/skillAnalysisService';
import { getAllRoles } from '@/services/roleDatabase';

export default function SkillExtraction({ onAnalysisComplete, onStepChange, onLoadingChange }) {
    const [uploadMethod, setUploadMethod] = useState('paste'); 
    const [file, setFile] = useState(null);
    const [githubUrl, setGithubUrl] = useState('');
    const [pastedText, setPastedText] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [extractedSkills, setExtractedSkills] = useState(null);

    const roles = getAllRoles();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setError('');
        }
    };

    const handleAnalyze = async () => {
        try {
            setLoading(true);
            onLoadingChange?.(true);
            setError('');

            let textToAnalyze = '';
            let source = 'paste';

            
            if (uploadMethod === 'file' && file) {
                const result = await parseResumeFile(file);
                if (!result.success) {
                    throw new Error(result.error);
                }
                textToAnalyze = result.text;
                source = 'resume';
            } else if (uploadMethod === 'github' && githubUrl) {
                const validation = validateGitHubUrl(githubUrl);
                if (!validation.valid) {
                    throw new Error(validation.error);
                }

                
                const githubResult = await analyzeGitHubProfile(githubUrl);
                if (!githubResult.success) {
                    throw new Error(githubResult.error);
                }

                setExtractedSkills(githubResult.skills);
                source = 'github';

                
                textToAnalyze = `GitHub Profile: ${githubResult.profile.username}
Languages: ${githubResult.languages.join(', ')}
Skills: ${Object.values(githubResult.skills).flat().join(', ')}`;

            } else if (uploadMethod === 'paste' && pastedText) {
                textToAnalyze = pastedText;
                source = 'paste';
            } else {
                throw new Error('Please provide input to analyze');
            }

            if (!targetRole) {
                throw new Error('Please select a target role');
            }

            
            const analysis = await performCompleteAnalysis({
                text: textToAnalyze,
                source,
                targetRole
            });

            if (!analysis.success) {
                throw new Error(analysis.error);
            }

            
            onAnalysisComplete(analysis);

        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message || 'Analysis failed. Please try again.');
        } finally {
            setLoading(false);
            onLoadingChange?.(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Upload Your Profile</h2>

                {}
                <Tabs value={uploadMethod} onValueChange={setUploadMethod} className="mb-6">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="paste" className="gap-2">
                            <FileText className="w-4 h-4" />
                            Paste Text
                        </TabsTrigger>
                        <TabsTrigger value="file" className="gap-2">
                            <Upload className="w-4 h-4" />
                            Upload File
                        </TabsTrigger>
                        <TabsTrigger value="github" className="gap-2">
                            <Github className="w-4 h-4" />
                            GitHub Profile
                        </TabsTrigger>
                    </TabsList>

                    {}
                    <TabsContent value="paste" className="space-y-4">
                        <div>
                            <Label htmlFor="pastedText">Paste Resume or Profile Text</Label>
                            <textarea
                                id="pastedText"
                                value={pastedText}
                                onChange={(e) => setPastedText(e.target.value)}
                                placeholder="Paste your resume, LinkedIn profile, or any text containing your skills and experience..."
                                className="w-full min-h-[300px] p-4 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Tip: The more detailed, the better the analysis!
                            </p>
                        </div>
                    </TabsContent>

                    {}
                    <TabsContent value="file" className="space-y-4">
                        <div>
                            <Label>Upload Resume (TXT, PDF, DOC, DOCX)</Label>
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                {file ? (
                                    <div className="flex items-center justify-center gap-2 text-green-600">
                                        <Check className="w-5 h-5" />
                                        <span>{file.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                                        <p className="text-sm text-slate-600 mb-2">
                                            Drag and drop your resume here, or click to browse
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Supported: TXT, PDF, DOC, DOCX (max 5MB)
                                        </p>
                                    </>
                                )}
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept=".txt,.pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {}
                    <TabsContent value="github" className="space-y-4">
                        <div>
                            <Label htmlFor="githubUrl">GitHub Profile URL or Username</Label>
                            <Input
                                id="githubUrl"
                                type="text"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                placeholder="github.com/username or just username"
                                className="mt-2"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                We'll analyze your public repositories, languages, and activity
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Target Role Selection */}
                <div className="mb-6">
                    <Label htmlFor="targetRole">Target Role *</Label>
                    <Select value={targetRole} onValueChange={setTargetRole}>
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select your target role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-2">
                        We'll compare your skills with this role's requirements
                    </p>
                </div>

                {}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
                    >
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800">Error</p>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    </motion.div>
                )}

                {}
                <Button
                    onClick={handleAnalyze}
                    disabled={loading || !targetRole}
                    className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing with AI...
                        </>
                    ) : (
                        <>
                            <FileText className="w-5 h-5 mr-2" />
                            Analyze Skills & Generate Report
                        </>
                    )}
                </Button>

                {loading && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-sm text-slate-600 mt-4"
                    >
                        This may take 10-30 seconds... Extracting skills with Gemini AI 🤖
                    </motion.p>
                )}
            </Card>

            {}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">AI-Powered</h3>
                    <p className="text-sm text-blue-700">
                        Uses Gemini AI to intelligently extract and categorize your skills
                    </p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-2">Role-Specific</h3>
                    <p className="text-sm text-purple-700">
                        Compare against actual requirements for your target role
                    </p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">Actionable</h3>
                    <p className="text-sm text-green-700">
                        Get project recommendations and a clear learning path
                    </p>
                </Card>
            </div>
        </div>
    );
}
