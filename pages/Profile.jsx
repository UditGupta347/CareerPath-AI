import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Target, 
  Code2,
  Save,
  Loader2,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import AnimatedBackground from '@/components/ui/AnimatedBackground';

const domains = [
  { id: 'AI/ML', label: 'AI / ML', emoji: '🤖' },
  { id: 'Web Development', label: 'Web Dev', emoji: '🌐' },
  { id: 'Mobile Development', label: 'Mobile', emoji: '📱' },
  { id: 'IoT', label: 'IoT', emoji: '🔌' },
  { id: 'Cybersecurity', label: 'Security', emoji: '🔒' },
  { id: 'Blockchain', label: 'Blockchain', emoji: '⛓️' },
  { id: 'Cloud Computing', label: 'Cloud', emoji: '☁️' },
  { id: 'AR/VR', label: 'AR/VR', emoji: '🥽' },
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

export default function Profile() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {}
  };

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ user_email: user?.email });
      return profiles[0] || {
        user_email: user?.email,
        domains: [],
        experience_level: 'Beginner',
        target_roles: [],
        skills: [],
        college: '',
        graduation_year: new Date().getFullYear() + 1
      };
    },
    enabled: !!user?.email
  });

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (profile?.id) {
        await base44.entities.UserProfile.update(profile.id, data);
      } else {
        await base44.entities.UserProfile.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile']);
      toast.success('Profile saved successfully!');
    }
  });

  const handleDomainToggle = (domainId) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains?.includes(domainId)
        ? prev.domains.filter(d => d !== domainId)
        : [...(prev.domains || []), domainId]
    }));
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => ({
      ...prev,
      target_roles: prev.target_roles?.includes(role)
        ? prev.target_roles.filter(r => r !== role)
        : [...(prev.target_roles || []), role]
    }));
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (isLoading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <AnimatedBackground />
      
      <div className="relative pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
            <p className="text-slate-600">Customize your preferences for better recommendations</p>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 mb-6 text-white"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.full_name || 'Student'}</h2>
                <p className="text-indigo-100 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
              </div>
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-6 shadow-xl space-y-8"
          >
            {}
            <div>
              <Label className="text-base font-semibold mb-4 block">Interested Domains</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {domains.map(domain => (
                  <button
                    key={domain.id}
                    onClick={() => handleDomainToggle(domain.id)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm",
                      formData.domains?.includes(domain.id)
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <span>{domain.emoji}</span>
                    <span className="font-medium">{domain.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {}
            <div>
              <Label className="text-base font-semibold mb-4 block">Experience Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFormData(prev => ({ ...prev, experience_level: level }))}
                    className={cn(
                      "p-4 rounded-xl border-2 text-center transition-all",
                      formData.experience_level === level
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <p className="font-medium text-slate-900">{level}</p>
                  </button>
                ))}
              </div>
            </div>

            {}
            <div>
              <Label className="text-base font-semibold mb-4 block">Target Roles</Label>
              <div className="flex flex-wrap gap-2">
                {roles.map(role => (
                  <Badge
                    key={role}
                    variant="outline"
                    className={cn(
                      "cursor-pointer py-2 px-3 text-sm transition-all",
                      formData.target_roles?.includes(role)
                        ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                        : "hover:bg-slate-100"
                    )}
                    onClick={() => handleRoleToggle(role)}
                  >
                    {formData.target_roles?.includes(role) && (
                      <CheckCircle2 className="w-3 h-3 mr-1.5" />
                    )}
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            {}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="college">College / University</Label>
                <Input
                  id="college"
                  placeholder="e.g., MIT, Stanford..."
                  value={formData.college || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="year">Graduation Year</Label>
                <Input
                  id="year"
                  type="number"
                  min={2020}
                  max={2035}
                  value={formData.graduation_year || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    graduation_year: parseInt(e.target.value) 
                  }))}
                  className="mt-1.5"
                />
              </div>
            </div>

            {}
            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
              <Button
                onClick={() => saveMutation.mutate(formData)}
                disabled={saveMutation.isPending}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}