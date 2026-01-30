import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  GraduationCap,
  Target,
  Code2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const domains = [
  { id: 'AI/ML', label: 'AI / Machine Learning', emoji: '🤖' },
  { id: 'Web Development', label: 'Web Development', emoji: '🌐' },
  { id: 'Mobile Development', label: 'Mobile Development', emoji: '📱' },
  { id: 'IoT', label: 'Internet of Things', emoji: '🔌' },
  { id: 'Cybersecurity', label: 'Cybersecurity', emoji: '🔒' },
  { id: 'Blockchain', label: 'Blockchain', emoji: '⛓️' },
  { id: 'Cloud Computing', label: 'Cloud Computing', emoji: '☁️' },
  { id: 'AR/VR', label: 'AR / VR', emoji: '🥽' },
  { id: 'Data Science', label: 'Data Science', emoji: '📊' },
  { id: 'DevOps', label: 'DevOps', emoji: '⚙️' }
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

const levels = [
  { id: 'Beginner', label: 'Beginner', description: 'Just starting out' },
  { id: 'Intermediate', label: 'Intermediate', description: '1-2 years experience' },
  { id: 'Advanced', label: 'Advanced', description: '3+ years experience' }
];

export default function OnboardingModal({ open, onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    domains: [],
    experience_level: '',
    target_roles: [],
    college: '',
    graduation_year: new Date().getFullYear() + 1
  });

  const handleDomainToggle = (domainId) => {
    setProfile(prev => ({
      ...prev,
      domains: prev.domains.includes(domainId)
        ? prev.domains.filter(d => d !== domainId)
        : [...prev.domains, domainId]
    }));
  };

  const handleRoleToggle = (role) => {
    setProfile(prev => ({
      ...prev,
      target_roles: prev.target_roles.includes(role)
        ? prev.target_roles.filter(r => r !== role)
        : [...prev.target_roles, role]
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return profile.domains.length > 0;
      case 2: return profile.experience_level !== '';
      case 3: return profile.target_roles.length > 0;
      default: return true;
    }
  };

  const handleComplete = () => {
    onComplete(profile);
  };

  const steps = [
    {
      title: "What interests you?",
      description: "Select the domains you want to explore",
      icon: Sparkles
    },
    {
      title: "Your Experience Level",
      description: "Help us recommend the right projects",
      icon: GraduationCap
    },
    {
      title: "Target Roles",
      description: "What positions are you aiming for?",
      icon: Target
    },
    {
      title: "Almost Done!",
      description: "Just a few more details",
      icon: CheckCircle2
    }
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white">
        {}
        <div className="h-1 bg-slate-100">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {React.createElement(steps[step - 1].icon, {
                className: "w-6 h-6 text-indigo-600"
              })}
              <DialogTitle className="text-xl">
                {steps[step - 1].title}
              </DialogTitle>
            </div>
            <DialogDescription>
              {steps[step - 1].description}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 gap-2"
              >
                {domains.map(domain => (
                  <button
                    key={domain.id}
                    onClick={() => handleDomainToggle(domain.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                      profile.domains.includes(domain.id)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <span className="text-xl">{domain.emoji}</span>
                    <span className="text-sm font-medium text-slate-700">
                      {domain.label}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                {levels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setProfile(prev => ({ ...prev, experience_level: level.id }))}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                      profile.experience_level === level.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="text-left">
                      <p className="font-medium text-slate-900">{level.label}</p>
                      <p className="text-sm text-slate-500">{level.description}</p>
                    </div>
                    {profile.experience_level === level.id && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-wrap gap-2"
              >
                {roles.map(role => (
                  <Badge
                    key={role}
                    variant="outline"
                    className={cn(
                      "cursor-pointer py-2 px-3 text-sm transition-all",
                      profile.target_roles.includes(role)
                        ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                        : "hover:bg-slate-100"
                    )}
                    onClick={() => handleRoleToggle(role)}
                  >
                    {profile.target_roles.includes(role) && (
                      <CheckCircle2 className="w-3 h-3 mr-1.5" />
                    )}
                    {role}
                  </Badge>
                ))}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="college">College / University (Optional)</Label>
                  <Input
                    id="college"
                    placeholder="e.g., MIT, Stanford..."
                    value={profile.college}
                    onChange={(e) => setProfile(prev => ({ ...prev, college: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Expected Graduation Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min={2024}
                    max={2030}
                    value={profile.graduation_year}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      graduation_year: parseInt(e.target.value) 
                    }))}
                    className="mt-1.5"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Sparkles className="w-4 h-4" />
                Get Started
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}