import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast.success('Welcome back!');
          navigate('/dashboard');
        } else {
          toast.error('Invalid credentials. Try admin@company.com / admin123');
        }
      } else {
        const register = useAuthStore.getState().register;
        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
          toast.success('Account created successfully!');
          navigate('/dashboard');
        } else {
          toast.error('Registration failed');
        }
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface-900 via-primary-900 to-surface-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">FaceTrack AI</h1>
              <p className="text-sm text-white/60">Intelligent Attendance</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Smart Attendance<br />Powered by AI
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Revolutionize your workforce management with real-time face recognition, 
            automated attendance tracking, and comprehensive analytics.
          </p>
          <div className="space-y-3">
            {['96%+ Recognition Accuracy', 'Real-time Processing', 'Enterprise Security'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent-400" />
                </div>
                <span className="text-white/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-50 dark:bg-surface-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-surface-900">FaceTrack AI</h1>
          </div>

          <div className="bg-white dark:bg-surface-800 rounded-2xl p-8 shadow-xl border border-surface-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-surface-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-surface-500 mt-2">
                {isLogin ? 'Sign in to access your dashboard' : 'Get started with FaceTrack AI'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-surface-200'} focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-surface-200'} focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all`}
                    placeholder="you@company.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-surface-200'} focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div>
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-surface-200'} focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-surface-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-surface-500">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
                  className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Demo credentials */}
            {isLogin && (
              <div className="mt-4 p-3 bg-primary-50 rounded-xl">
                <p className="text-xs text-primary-700 font-medium mb-1">Demo Credentials:</p>
                <p className="text-xs text-primary-600">Email: admin@company.com</p>
                <p className="text-xs text-primary-600">Password: admin123</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
