import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ScanFace, 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Lock,
  Cpu,
  ChevronDown
} from 'lucide-react';

const features = [
  { 
    icon: ScanFace, 
    title: 'AI Face Recognition', 
    desc: 'Real-time face detection with 96%+ accuracy using deep learning embeddings',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    icon: Clock, 
    title: 'Instant Attendance', 
    desc: 'Automatic check-in/out with sub-100ms recognition speed',
    gradient: 'from-emerald-500 to-teal-500'
  },
  { 
    icon: Shield, 
    title: 'Secure & Private', 
    desc: 'JWT authentication, encrypted embeddings, and GDPR compliance',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    icon: BarChart3, 
    title: 'Smart Analytics', 
    desc: 'Real-time dashboards, department insights, and trend analysis',
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    icon: Users, 
    title: 'Team Management', 
    desc: 'Manage employees, departments, and registration workflows',
    gradient: 'from-indigo-500 to-purple-500'
  },
  { 
    icon: Zap, 
    title: 'Lightning Fast', 
    desc: 'Optimized pgvector search handles 100K+ employees effortlessly',
    gradient: 'from-yellow-500 to-orange-500'
  },
];

const stats = [
  { value: '96.8%', label: 'Recognition Accuracy' },
  { value: '<100ms', label: 'Response Time' },
  { value: '100K+', label: 'Scalable Users' },
  { value: '99.9%', label: 'Uptime SLA' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-primary-900 to-surface-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px]" />
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 grid-pattern" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/80">Powered by Advanced AI & Machine Learning</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Intelligent
              <span className="block gradient-text">
                Attendance System
              </span>
            </h1>

            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Revolutionize workforce management with AI-powered face recognition. 
              Seamless check-ins, real-time analytics, and enterprise-grade security — all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/face-recognition')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-lg backdrop-blur-sm border border-white/20 transition-colors flex items-center justify-center gap-2"
              >
                Try Face Recognition
                <ScanFace className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass-dark rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              A complete attendance management solution with cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-8"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-surface-600 dark:text-surface-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-white dark:bg-surface-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-surface-600 dark:text-surface-400">Three simple steps to transform your attendance system</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register Faces', desc: 'Capture multiple face samples for each employee using our guided wizard', icon: Users },
              { step: '02', title: 'AI Processing', desc: '128-dimensional embeddings are generated and stored securely in pgvector', icon: Cpu },
              { step: '03', title: 'Auto Attendance', desc: 'Employees simply look at the camera — attendance is marked automatically', icon: CheckCircle2 },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="text-center"
                >
                  <div className="text-6xl font-bold text-primary-100 dark:text-primary-900 mb-4">{item.step}</div>
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-surface-600 dark:text-surface-400">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 mb-8">
              Deploy your AI attendance system in minutes with Docker. No complex setup required.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="btn-primary px-10 py-4 text-lg"
            >
              Launch Application
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-surface-900 dark:bg-surface-950 text-center">
        <p className="text-surface-400 text-sm">
          © 2024 FaceTrack AI. Built with React, FastAPI, PostgreSQL & face_recognition.
        </p>
      </footer>
    </div>
  );
}
