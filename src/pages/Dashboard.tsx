import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { dashboardStats, weeklyData, recentScans, monthlyTrend } from '../data/mockData';

const stats = [
  { 
    label: 'Total Employees', 
    value: dashboardStats.totalEmployees, 
    icon: Users, 
    change: '+12%', 
    trend: 'up',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    label: 'Present Today', 
    value: dashboardStats.presentToday, 
    icon: UserCheck, 
    change: '+8%', 
    trend: 'up',
    gradient: 'from-emerald-500 to-teal-500'
  },
  { 
    label: 'Late Arrivals', 
    value: dashboardStats.lateToday, 
    icon: Clock, 
    change: '-3%', 
    trend: 'down',
    gradient: 'from-amber-500 to-orange-500'
  },
  { 
    label: 'Attendance Rate', 
    value: `${dashboardStats.attendanceRate}%`, 
    icon: TrendingUp, 
    change: '+5%', 
    trend: 'up',
    gradient: 'from-purple-500 to-pink-500'
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-surface-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
                Weekly Attendance
              </h3>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Employee attendance over the week
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#71717a" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e4e4e7',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="present" 
                fill="url(#colorPresent)" 
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
                Monthly Trend
              </h3>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Attendance rate over the year
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#71717a" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e4e4e7',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#6366f1" 
                strokeWidth={2}
                fill="url(#colorRate)"
              />
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
              Recent Activity
            </h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Latest face recognition scans
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Live
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {recentScans.slice(0, 5).map((scan, index) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                scan.status === 'success' 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                <Activity className={`w-5 h-5 ${
                  scan.status === 'success' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                  {scan.employeeName}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {new Date(scan.timestamp).toLocaleTimeString()} • {scan.confidence}% confidence
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                scan.status === 'success'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {scan.status === 'success' ? 'Marked' : 'Failed'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
