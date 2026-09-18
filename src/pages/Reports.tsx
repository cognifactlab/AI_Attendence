import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Award, Target, Clock, CheckCircle2,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { departmentStats, monthlyTrend, weeklyData, dashboardStats, employees } from '../data/mockData';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const topPerformers = [
  { name: 'Sarah Johnson', dept: 'Engineering', rate: 100, streak: 45 },
  { name: 'Michael Williams', dept: 'Marketing', rate: 99.2, streak: 38 },
  { name: 'Emily Brown', dept: 'Design', rate: 98.8, streak: 32 },
  { name: 'David Jones', dept: 'Sales', rate: 98.5, streak: 28 },
  { name: 'Jessica Garcia', dept: 'HR', rate: 97.9, streak: 25 },
];

const radarData = departmentStats.map(d => ({
  department: d.department,
  attendance: d.attendance,
  employees: d.employees * 5,
  fullMark: 100,
}));

const hourlyData = Array.from({ length: 12 }, (_, i) => ({
  hour: `${8 + i}:00`,
  checkins: Math.max(0, Math.floor(40 - i * 4 + Math.random() * 8)),
}));

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Avg Rate', value: '94.2%', change: '+2.1%', up: true, icon: TrendingUp, color: 'bg-primary-500' },
          { label: 'Total Employees', value: dashboardStats.totalEmployees.toString(), change: '+3', up: true, icon: Users, color: 'bg-purple-500' },
          { label: 'Perfect Attendance', value: '12', change: '+4', up: true, icon: Award, color: 'bg-amber-500' },
          { label: 'Avg Check-in Time', value: '8:42 AM', change: '-3min', up: true, icon: Clock, color: 'bg-cyan-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-surface-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-accent-600' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-surface-900">{stat.value}</div>
              <div className="text-xs text-surface-500">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Attendance Rate Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[80, 100]} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="rate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} name="Attendance %" />
              <Area type="monotone" dataKey="confidence" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={2} name="Confidence %" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Department Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="department" fontSize={11} stroke="#64748b" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10} />
              <Radar name="Attendance" dataKey="attendance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hourly Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Check-in Time Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="checkins" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Check-ins" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">By Department</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={departmentStats}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                dataKey="employees"
                nameKey="department"
                stroke="none"
              >
                {departmentStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-4">
            {departmentStats.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-surface-600">{d.department}</span>
                </div>
                <span className="font-medium text-surface-900">{d.attendance}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Performers & Weekly Summary */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-surface-900">Top Performers</h3>
          </div>
          <div className="space-y-3">
            {topPerformers.map((emp, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-amber-100 text-amber-700' :
                  i === 1 ? 'bg-surface-200 text-surface-700' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-surface-100 text-surface-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-surface-900">{emp.name}</div>
                  <div className="text-xs text-surface-500">{emp.dept}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-accent-600">{emp.rate}%</div>
                  <div className="text-xs text-surface-500">{emp.streak} day streak</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Weekly Summary</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="present" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} name="Present" />
              <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} name="Late" />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} name="Absent" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" /> Key Insights
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { metric: 'Best Day', value: 'Tuesday', detail: '98.2% attendance' },
            { metric: 'Peak Check-in', value: '8:30-9:00', detail: '72% of employees' },
            { metric: 'Improvement', value: '+3.2%', detail: 'vs last month' },
            { metric: 'Recognition Rate', value: '99.1%', detail: 'Successful matches' },
          ].map((insight, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-xs text-white/60 mb-1">{insight.metric}</div>
              <div className="text-xl font-bold">{insight.value}</div>
              <div className="text-xs text-white/70 mt-1">{insight.detail}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
