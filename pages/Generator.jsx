import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  Rocket, 
  CheckCircle2,
  Wand2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

import AnimatedBackground from '@/components/ui/AnimatedBackground';

const domains = [
  'AI/ML',
  'Web Development',
  'Mobile Development',
  'IoT',
  'Cybersecurity',
  'Blockchain',
  'Cloud Computing',
  'AR/VR',
  'Data Science',
  'DevOps'
];

const roles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Machine Learning Engineer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile Developer',
  'Cloud Engineer',
  'Security Analyst',
  'Blockchain Developer'
];

export default function Generator() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    domain: '',
    complexity: '',
    targetRole: '',
    interests: '',
    existingSkills: ''
  });
  const [generatedProject, setGeneratedProject] = useState(null);
  const [error, setError] = useState('');

  const generateMutation = useMutation({
    mutationFn: async (data) => {
      const prompt = `Generate a unique, innovative project idea for a college student with the following profile:
      
Domain: ${data.domain}
Experience Level: ${data.complexity}
Target Job Role: ${data.targetRole}
Specific Interests: ${data.interests || 'General'}
Existing Skills: ${data.existingSkills || 'Basic programming'}

Generate a JSON response with this EXACT structure:
{
  "title": "Creative project name",
  "description": "2-3 sentence compelling description",
  "domain": "${data.domain}",
  "complexity": "${data.complexity}",
  "tech_stack": ["tech1", "tech2", "tech3", "tech4"],
  "estimated_time": "X weeks",
  "use_cases": ["use case 1", "use case 2", "use case 3"],
  "target_roles": ["${data.targetRole}"],
  "is_trending": true,
  "roadmap": {
    "phases": [
      {
        "name": "Design",
        "duration": "1 week",
        "tasks": [
          {"id": "d1", "title": "Research and planning", "description": "Study similar solutions", "duration": "2 days"},
          {"id": "d2", "title": "Create wireframes", "description": "Design UI mockups", "duration": "2 days"},
          {"id": "d3", "title": "Define architecture", "description": "Plan system design", "duration": "3 days"}
        ]
      },
      {
        "name": "Development",
        "duration": "3 weeks",
        "tasks": [
          {"id": "dev1", "title": "Setup project", "description": "Initialize repository and dependencies", "duration": "1 day"},
          {"id": "dev2", "title": "Build core features", "description": "Implement main functionality", "duration": "1 week"},
          {"id": "dev3", "title": "Integrate APIs", "description": "Connect external services", "duration": "1 week"},
          {"id": "dev4", "title": "Build UI components", "description": "Create user interface", "duration": "1 week"}
        ]
      },
      {
        "name": "Testing",
        "duration": "1 week",
        "tasks": [
          {"id": "t1", "title": "Unit testing", "description": "Test individual components", "duration": "3 days"},
          {"id": "t2", "title": "Integration testing", "description": "Test feature integration", "duration": "2 days"},
          {"id": "t3", "title": "Bug fixes", "description": "Fix identified issues", "duration": "2 days"}
        ]
      },
      {
        "name": "Deployment",
        "duration": "3 days",
        "tasks": [
          {"id": "dp1", "title": "Setup hosting", "description": "Configure deployment platform", "duration": "1 day"},
          {"id": "dp2", "title": "Deploy application", "description": "Push to production", "duration": "1 day"},
          {"id": "dp3", "title": "Documentation", "description": "Write README and docs", "duration": "1 day"}
        ]
      }
    ]
  },
  "resources": [
    {"title": "Official Documentation", "type": "documentation", "level": "Beginner", "source": "docs.example.com", "url": "https://docs.example.com"},
    {"title": "Tutorial Playlist", "type": "video", "level": "Beginner", "source": "YouTube", "url": "https://youtube.com"},
    {"title": "Starter Template", "type": "github", "level": "Intermediate", "source": "GitHub", "url": "https://github.com"},
    {"title": "Best Practices Guide", "type": "article", "level": "Intermediate", "source": "Medium", "url": "https://medium.com"},
    {"title": "Advanced Course", "type": "course", "level": "Advanced", "source": "Udemy", "url": "https://udemy.com"}
  ],
  "weekly_plan": [
    {"title": "Week 1: Foundation", "hours": 10, "focus": "Planning & Setup"},
    {"title": "Week 2: Core Development", "hours": 15, "focus": "Building Features"},
    {"title": "Week 3: Advanced Features", "hours": 15, "focus": "API Integration"},
    {"title": "Week 4: Polish & Deploy", "hours": 10, "focus": "Testing & Launch"}
  ],
  "github_structure": "├── src/\\n│   ├── components/\\n│   ├── pages/\\n│   ├── services/\\n│   └── utils/\\n├── tests/\\n├── docs/\\n├── README.md\\n└── package.json",
  "architecture": "Client-Server architecture with REST API. Frontend handles UI and state management. Backend manages business logic and database. External APIs for specialized features.",
  "deployment_guide": "1. Push code to GitHub\\n2. Connect to Vercel/Netlify for frontend\\n3. Deploy backend on Render/Railway\\n4. Set environment variables\\n5. Configure custom domain"
}

Make it practical, achievable, and relevant to current industry trends.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            domain: { type: "string" },
            complexity: { type: "string" },
            tech_stack: { type: "array", items: { type: "string" } },
            estimated_time: { type: "string" },
            use_cases: { type: "array", items: { type: "string" } },
            target_roles: { type: "array", items: { type: "string" } },
            is_trending: { type: "boolean" },
            roadmap: { type: "object" },
            resources: { type: "array" },
            weekly_plan: { type: "array" },
            github_structure: { type: "string" },
            architecture: { type: "string" },
            deployment_guide: { type: "string" }
          }
        }
      });

      return response;
    },
    onSuccess: (data) => {
      setGeneratedProject(data);
      setStep(3);
    },
    onError: (error) => {
      setError('Failed to generate project. Please try again.');
      console.error(error);
    }
  });

  const saveProjectMutation = useMutation({
    mutationFn: async (project) => {
      const created = await base44.entities.Project.create(project);
      return created;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['projects']);
      navigate(createPageUrl('ProjectDetails') + `?id=${data.id}`);
    }
  });

  const canProceed = () => {
    if (step === 1) return formData.domain && formData.complexity;
    if (step === 2) return formData.targetRole;
    return true;
  };

  const handleGenerate = () => {
    setError('');
    generateMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen pb-20">
      <AnimatedBackground />
      
      <div className="relative pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Project Generator</h1>
            <p className="text-slate-600">Get a personalized project idea with complete roadmap</p>
          </motion.div>

          {}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                  step >= s 
                    ? "bg-indigo-600 text-white" 
                    : "bg-slate-100 text-slate-400"
                )}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={cn(
                    "w-16 h-1 rounded-full transition-all",
                    step > s ? "bg-indigo-600" : "bg-slate-200"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>

          {}
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-8 shadow-xl"
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Select Domain</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {domains.map(domain => (
                        <button
                          key={domain}
                          onClick={() => setFormData(prev => ({ ...prev, domain }))}
                          className={cn(
                            "p-3 rounded-xl border-2 text-left transition-all text-sm font-medium",
                            formData.domain === domain
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          {domain}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Experience Level</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <button
                          key={level}
                          onClick={() => setFormData(prev => ({ ...prev, complexity: level }))}
                          className={cn(
                            "p-4 rounded-xl border-2 text-center transition-all",
                            formData.complexity === level
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <p className="font-medium text-slate-900">{level}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Target Role</Label>
                    <Select
                      value={formData.targetRole}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, targetRole: value }))}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your target role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Specific Interests (Optional)</Label>
                    <Input
                      placeholder="e.g., healthcare, e-commerce, social media..."
                      value={formData.interests}
                      onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Existing Skills (Optional)</Label>
                    <Textarea
                      placeholder="e.g., Python, React, basic SQL..."
                      value={formData.existingSkills}
                      onChange={(e) => setFormData(prev => ({ ...prev, existingSkills: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && generatedProject && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Generated!</h2>
                    <p className="text-slate-600">Here's your personalized project idea</p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{generatedProject.title}</h3>
                    <p className="text-slate-600 mb-4">{generatedProject.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {generatedProject.tech_stack?.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-white">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Complexity:</span>
                        <span className="ml-2 font-medium">{generatedProject.complexity}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Time:</span>
                        <span className="ml-2 font-medium">{generatedProject.estimated_time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setStep(1);
                        setGeneratedProject(null);
                      }}
                    >
                      Generate Another
                    </Button>
                    <Button
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 gap-2"
                      onClick={() => saveProjectMutation.mutate(generatedProject)}
                      disabled={saveProjectMutation.isPending}
                    >
                      {saveProjectMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Rocket className="w-4 h-4" />
                      )}
                      Save & View Details
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {}
            {step < 3 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setStep(s => s - 1)}
                  disabled={step === 1}
                >
                  Back
                </Button>

                {step === 2 ? (
                  <Button
                    onClick={handleGenerate}
                    disabled={!canProceed() || generateMutation.isPending}
                    className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Project
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setStep(s => s + 1)}
                    disabled={!canProceed()}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}