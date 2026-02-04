import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  Sparkles, 
  Upload, 
  Copy, 
  Check,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import AnimatedBackground from '@/components/ui/AnimatedBackground';

export default function ResumeBuilder() {
  const [user, setUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [atsResult, setAtsResult] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {}
  };

  const { data: savedProjects = [] } = useQuery({
    queryKey: ['savedProjects', user?.email],
    queryFn: () => base44.entities.SavedProject.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list()
  });

  const enrichedProjects = savedProjects.map(sp => {
    const project = allProjects.find(p => p.id === sp.project_id);
    return { ...sp, project };
  }).filter(p => p.project);

  const generateResumeMutation = useMutation({
    mutationFn: async (projectId) => {
      const project = allProjects.find(p => p.id === projectId);
      if (!project) return null;

      const prompt = `Generate professional resume content for this project:

Title: ${project.title}
Description: ${project.description}
Tech Stack: ${project.tech_stack?.join(', ')}
Domain: ${project.domain}
Complexity: ${project.complexity}

Generate:
1. Three bullet points using XYZ formula (Accomplished X by doing Y resulting in Z)
2. A concise tech stack line
3. An impact statement
4. A GitHub README template with sections

Return as JSON with keys: bulletPoints (array), techStack (string), impactStatement (string), readmeTemplate (string)`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            bulletPoints: { type: 'array', items: { type: 'string' } },
            techStack: { type: 'string' },
            impactStatement: { type: 'string' },
            readmeTemplate: { type: 'string' }
          }
        }
      });

      return result;
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      toast.success('Resume content generated!');
    }
  });

  const analyzeATSMutation = useMutation({
    mutationFn: async ({ fileUrl, jobDesc }) => {
      const prompt = `Analyze this resume against the job description and provide an ATS score.

Job Description:
${jobDesc}

Analyze the resume and return:
1. ATS Score (0-100)
2. Keyword matches found
3. Missing important keywords
4. Suggestions for improvement
5. Format issues (if any)

Return as JSON with keys: score (number), matchedKeywords (array), missingKeywords (array), suggestions (array), formatIssues (array)`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: [fileUrl],
        response_json_schema: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            matchedKeywords: { type: 'array', items: { type: 'string' } },
            missingKeywords: { type: 'array', items: { type: 'string' } },
            suggestions: { type: 'array', items: { type: 'string' } },
            formatIssues: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      return result;
    },
    onSuccess: (data) => {
      setAtsResult(data);
      toast.success('ATS analysis complete!');
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFile(file);
    toast.success('Resume uploaded');
  };

  const handleATSAnalysis = async () => {
    if (!resumeFile || !jobDescription) {
      toast.error('Please upload resume and enter job description');
      return;
    }

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: resumeFile });
      analyzeATSMutation.mutate({ fileUrl: file_url, jobDesc: jobDescription });
    } catch (e) {
      toast.error('Failed to upload resume');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen pb-20">
      <AnimatedBackground />
      
      <div className="relative pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Resume Builder & ATS Analyzer</h1>
            </div>
            <p className="text-slate-600">Create professional resume descriptions and analyze ATS compatibility</p>
          </motion.div>

          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="bg-white/80 backdrop-blur-xl border border-slate-100 p-1.5 rounded-xl mb-6">
              <TabsTrigger value="builder" className="rounded-lg gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Sparkles className="w-4 h-4" />
                AI Resume Builder
              </TabsTrigger>
              <TabsTrigger value="ats" className="rounded-lg gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Target className="w-4 h-4" />
                ATS Score Analyzer
              </TabsTrigger>
            </TabsList>

            {}
            <TabsContent value="builder" className="mt-0">
              <div className="grid lg:grid-cols-2 gap-6">
                {}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-6 shadow-lg">
                    <h3 className="font-semibold text-slate-900 mb-4">Select Your Project</h3>
                    
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Choose a project..." />
                      </SelectTrigger>
                      <SelectContent>
                        {enrichedProjects.map((item) => (
                          <SelectItem key={item.project.id} value={item.project.id}>
                            {item.project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      className="w-full mt-4 gap-2 bg-indigo-600 hover:bg-indigo-700"
                      disabled={!selectedProject || generateResumeMutation.isPending}
                      onClick={() => generateResumeMutation.mutate(selectedProject)}
                    >
                      {generateResumeMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Resume Content
                        </>
                      )}
                    </Button>
                  </div>

                  {}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                    <h4 className="font-semibold text-slate-900 mb-3">What you'll get:</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>3 bullet points using XYZ formula</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>Professional tech stack summary</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>Compelling impact statement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>Complete GitHub README template</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* Output Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {generatedContent ? (
                    <>
                      {/* Bullet Points */}
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-slate-900">Resume Bullet Points</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleCopy(generatedContent.bulletPoints.join('\n'))}
                          >
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <ul className="space-y-3">
                          {generatedContent.bulletPoints?.map((point, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-slate-700">
                              <span className="text-indigo-600">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {}
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-slate-900">Tech Stack</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleCopy(generatedContent.techStack)}
                          >
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-slate-700">{generatedContent.techStack}</p>
                      </div>

                      {}
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-slate-900">Impact Statement</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleCopy(generatedContent.impactStatement)}
                          >
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-slate-700">{generatedContent.impactStatement}</p>
                      </div>

                      {}
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-slate-900">GitHub README Template</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleCopy(generatedContent.readmeTemplate)}
                          >
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs overflow-x-auto whitespace-pre-wrap">
                          {generatedContent.readmeTemplate}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-12 text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">Select a project and generate content to see results</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </TabsContent>

            {}
            <TabsContent value="ats" className="mt-0">
              <div className="grid lg:grid-cols-2 gap-6">
                {}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-6 shadow-lg">
                    <h3 className="font-semibold text-slate-900 mb-4">Upload Resume</h3>
                    
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        {resumeFile ? (
                          <p className="text-sm text-slate-700 font-medium">{resumeFile.name}</p>
                        ) : (
                          <>
                            <p className="text-sm text-slate-600 mb-1">Click to upload resume</p>
                            <p className="text-xs text-slate-400">PDF, DOC, or DOCX</p>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="mt-6">
                      <Label htmlFor="job-desc" className="mb-2 block">Job Description</Label>
                      <Textarea
                        id="job-desc"
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="h-40 resize-none"
                      />
                    </div>

                    <Button
                      className="w-full mt-4 gap-2 bg-indigo-600 hover:bg-indigo-700"
                      disabled={!resumeFile || !jobDescription || analyzeATSMutation.isPending}
                      onClick={handleATSAnalysis}
                    >
                      {analyzeATSMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4" />
                          Analyze ATS Score
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>

                {}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {atsResult ? (
                    <>
                      {}
                      <div className={cn(
                        "rounded-2xl border p-8 text-center shadow-lg",
                        atsResult.score >= 80 ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200" :
                        atsResult.score >= 60 ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200" :
                        "bg-gradient-to-br from-rose-50 to-red-50 border-rose-200"
                      )}>
                        <div className="text-6xl font-bold mb-2">
                          <span className={cn(
                            atsResult.score >= 80 ? "text-emerald-600" :
                            atsResult.score >= 60 ? "text-amber-600" :
                            "text-rose-600"
                          )}>{atsResult.score}</span>
                          <span className="text-2xl text-slate-400">/100</span>
                        </div>
                        <p className="text-slate-600 font-medium">ATS Compatibility Score</p>
                      </div>

                      {}
                      {atsResult.matchedKeywords?.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            Matched Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {atsResult.matchedKeywords.map((keyword, idx) => (
                              <Badge key={idx} className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {}
                      {atsResult.missingKeywords?.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            Missing Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {atsResult.missingKeywords.map((keyword, idx) => (
                              <Badge key={idx} variant="outline" className="border-amber-200 text-amber-700">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {}
                      {atsResult.suggestions?.length > 0 && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            Suggestions
                          </h4>
                          <ul className="space-y-2">
                            {atsResult.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex gap-2 text-sm text-slate-700">
                                <span className="text-indigo-600">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {}
                      {atsResult.formatIssues?.length > 0 && (
                        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-rose-600" />
                            Format Issues
                          </h4>
                          <ul className="space-y-2">
                            {atsResult.formatIssues.map((issue, idx) => (
                              <li key={idx} className="flex gap-2 text-sm text-slate-700">
                                <span className="text-rose-600">•</span>
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-12 text-center">
                      <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">Upload your resume and add a job description to get ATS analysis</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}