import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, ScanFace, Users, BarChart3, Clock, CheckCircle2,
  ArrowRight, Sparkles, Zap, Globe, Lock, Cpu, ChevronDown, UserPlus
} from 'lucide-react';

const features = [
  { icon: ScanFace, title: 'AI Face Recognition', desc: 'Real-time face detection with 96%+ accuracy using deep learning embeddings', color: 'from-blue-500 to-blue-700' },
  { icon: Clock, title: 'Instant Attendance', desc: 'Automatic check-in/out with sub-100ms recognition speed', color: 'from-green-500 to-green-700' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication, encrypted embeddings, and GDPR compliance', color: 'from-purple-500 to-purple-700' },
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Real-time dashboards, department insights, and trend analysis', color: 'from-orange-500 to-orange-700' },
  { icon: Users, title: 'Team Management', desc: 'Manage employees, departments, and registration workflows', color: 'from-pink-500 to-pink-700' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized pgvector search handles 100K+ employees effortlessly', color: 'from-yellow-500 to-yellow-700' },
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
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-primary-900 to-surface-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px]" />
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

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
              <span className="block bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
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
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-lg shadow-xl shadow-primary-600/30 transition-colors flex items-center justify-center gap-2"
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
      <section className="py-24 px-4 bg-surface-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-surface-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-surface-500 max-w-2xl mx-auto">
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
                  className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-100"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-surface-900 mb-2">{feature.title}</h3>
                  <p className="text-surface-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-surface-900 mb-4">How It Works</h2>
            <p className="text-lg text-surface-500">Three simple steps to transform your attendance system</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register Faces', desc: 'Capture multiple face samples for each employee using our guided wizard', icon: UserPlus },
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
                  className="relative text-center"
                >
                  <div className="text-6xl font-bold text-primary-100 mb-4">{item.step}</div>
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-surface-900 mb-2">{item.title}</h3>
                  <p className="text-surface-500">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-surface-900 to-primary-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Enterprise-Grade Security</h2>
              <p className="text-white/70 text-lg mb-8">
                Your data is protected with industry-leading security measures at every layer.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Lock, text: 'JWT Authentication with 24h token expiry' },
                  { icon: Shield, text: 'bcrypt password hashing & role-based access' },
                  { icon: Globe, text: 'CORS protection & rate limiting' },
                  { icon: Cpu, text: 'Encrypted face embeddings at rest' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-400" />
                      </div>
                      <span className="text-white/80">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-dark rounded-3xl p-8 border border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-sm text-white/60">Face Detection</span>
                    <span className="text-sm font-mono text-accent-400">~50ms</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-sm text-white/60">Face Encoding</span>
                    <span className="text-sm font-mono text-accent-400">~100ms</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-sm text-white/60">Vector Search (1K)</span>
                    <span className="text-sm font-mono text-accent-400">~5ms</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-sm text-white/60">API Response</span>
                    <span className="text-sm font-mono text-accent-400">&lt;100ms</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-sm text-white/60">Embedding Dimension</span>
                    <span className="text-sm font-mono text-primary-400">128-d</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-surface-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-surface-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-surface-500 mb-8">
              Deploy your AI attendance system in minutes with Docker. No complex setup required.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold text-lg shadow-xl shadow-primary-600/30 transition-all"
            >
              Launch Application
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-surface-900 text-center">
        <p className="text-surface-400 text-sm">
          © 2024 FaceTrack AI. Built with React, FastAPI, PostgreSQL & face_recognition.
        </p>
      </footer>
    </div>
  );
}
