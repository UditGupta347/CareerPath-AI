import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Target, TrendingUp, Mail, Lock, User, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuthStore();

    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    const [signupForm, setSignupForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from || '/Home';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    
    const getRegisteredUsers = () => {
        const users = localStorage.getItem('registered_users');
        return users ? JSON.parse(users) : [];
    };

    
    const saveRegisteredUsers = (users) => {
        localStorage.setItem('registered_users', JSON.stringify(users));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            
            await new Promise(resolve => setTimeout(resolve, 800));

            const registeredUsers = getRegisteredUsers();
            const user = registeredUsers.find(
                u => u.email === loginForm.email && u.password === loginForm.password
            );

            if (!user) {
                setError('Invalid email or password. Please check your credentials or sign up.');
                setLoading(false);
                return;
            }

            
            login({
                full_name: user.name,
                email: user.email,
                id: user.id,
                provider: 'email',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`
            });

            
            const from = location.state?.from || '/Home';
            navigate(from, { replace: true });

        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            
            if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
                setError('Please fill in all fields');
                setLoading(false);
                return;
            }

            if (signupForm.password !== signupForm.confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            if (signupForm.password.length < 6) {
                setError('Password must be at least 6 characters');
                setLoading(false);
                return;
            }

            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(signupForm.email)) {
                setError('Please enter a valid email address');
                setLoading(false);
                return;
            }

            
            await new Promise(resolve => setTimeout(resolve, 800));

            const registeredUsers = getRegisteredUsers();

            
            if (registeredUsers.find(u => u.email === signupForm.email)) {
                setError('An account with this email already exists. Please login instead.');
                setLoading(false);
                return;
            }

            
            const newUser = {
                id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: signupForm.name,
                email: signupForm.email,
                password: signupForm.password, 
                createdAt: new Date().toISOString()
            };

            registeredUsers.push(newUser);
            saveRegisteredUsers(registeredUsers);

            
            login({
                full_name: newUser.name,
                email: newUser.email,
                id: newUser.id,
                provider: 'email',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=6366f1&color=fff`
            });

            
            const from = location.state?.from || '/Home';
            navigate(from, { replace: true });

        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            {}
            <div className="fixed inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(99, 102, 241, 0.15) 1px, transparent 0)',
                    backgroundSize: '48px 48px'
                }} />
            </div>

            <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                {}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden lg:block"
                >
                    <div className="space-y-6">
                        {}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">
                                    ProjectPath<span className="text-indigo-600">AI</span>
                                </h1>
                                <p className="text-sm text-slate-600">Your AI Career Companion</p>
                            </div>
                        </div>

                        {}
                        <h2 className="text-5xl font-bold text-slate-900 leading-tight">
                            Build Your Dream Career with AI-Powered Projects
                        </h2>

                        <p className="text-xl text-slate-600 leading-relaxed">
                            Discover personalized project ideas, analyze your skills, and get a roadmap to your dream role.
                        </p>

                        {}
                        <div className="space-y-4 pt-6">
                            {[
                                { icon: Target, text: 'AI Skill Gap Analysis', color: 'text-indigo-600' },
                                { icon: Rocket, text: 'Smart Project Recommendations', color: 'text-purple-600' },
                                { icon: TrendingUp, text: 'Personalized Learning Paths', color: 'text-pink-600' }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                        <feature.icon className={`w-5 h-5 ${feature.color}`} />
                                    </div>
                                    <span className="text-slate-700 font-medium">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {}
                        <div className="grid grid-cols-3 gap-4 pt-8">
                            {[
                                { value: '1000+', label: 'Projects' },
                                { value: '50+', label: 'Skills Tracked' },
                                { value: '10+', label: 'Career Paths' }
                            ].map((stat, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
                                    <div className="text-sm text-slate-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="p-8 lg:p-10 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                        {}
                        <div className="lg:hidden flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    ProjectPath<span className="text-indigo-600">AI</span>
                                </h1>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            {isSignup ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-slate-600 mb-8">
                            {isSignup ? 'Sign up to get started with your career journey' : 'Sign in to continue your journey'}
                        </p>

                        {}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
                            >
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">{error}</p>
                            </motion.div>
                        )}

                        {}
                        {!isSignup ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email" className="text-slate-700">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={loginForm.email}
                                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                            className="pl-10 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="login-password" className="text-slate-700">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <Input
                                            id="login-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={loginForm.password}
                                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                            className="pl-10 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium mt-6"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>Sign In</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name" className="text-slate-700">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="John Doe"
                                            value={signupForm.name}
                                            onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                                            className="pl-10 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-email" className="text-slate-700">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={signupForm.email}
                                            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                                            className="pl-10 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-password" className="text-slate-700">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={signupForm.password}
                                            onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                            className="pl-10 h-12"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">Must be at least 6 characters</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-confirm-password" className="text-slate-700">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <Input
                                            id="signup-confirm-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={signupForm.confirmPassword}
                                            onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                                            className="pl-10 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium mt-6"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Creating account...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>Create Account</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        )}

                        {}
                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignup(!isSignup);
                                    setError('');
                                }}
                                className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                {isSignup ? (
                                    <>
                                        Already have an account?{' '}
                                        <span className="font-semibold text-indigo-600">Sign in</span>
                                    </>
                                ) : (
                                    <>
                                        Don't have an account?{' '}
                                        <span className="font-semibold text-indigo-600">Sign up</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Security Note */}
                        <div className="mt-6 flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-900">
                                <span className="font-semibold">Secure & Private:</span> Your data is encrypted and never shared with third parties.
                            </div>
                        </div>

                        {/* Terms */}
                        <p className="text-center text-xs text-slate-500 mt-4">
                            By continuing, you agree to our{' '}
                            <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                        </p>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
