import { motion } from 'framer-motion';
import {
  Users, UserCheck, Clock, UserX, TrendingUp, Activity,
  ArrowUpRight, ArrowDownRight, Scan
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { dashboardStats, weeklyData, recentScans, departmentStats, monthlyTrend } from '../data/mockData';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

const statCards = [
  { label: 'Total Employees', value: dashboardStats.totalEmployees, icon: Users, color: 'bg-blue-500', change: '+3', up: true },
  { label: 'Present Today', value: dashboardStats.presentToday, icon: UserCheck, color: 'bg-green-500', change: '+12', up: true },
  { label: 'Late Arrivals', value: dashboardStats.lateToday, icon: Clock, color: 'bg-amber-500', change: '-2', up: false },
  { label: 'Absent Today', value: dashboardStats.absentToday, icon: UserX, color: 'bg-red-500', change: '-1', up: false },
  { label: 'Attendance Rate', value: `${dashboardStats.attendanceRate}%`, icon: TrendingUp, color: 'bg-purple-500', change: '+1.2%', up: true },
  { label: 'Avg Confidence', value: `${dashboardStats.avgConfidence}%`, icon: Activity, color: 'bg-cyan-500', change: '+0.5%', up: true },
];

const pieData = [
  { name: 'Present', value: dashboardStats.presentToday },
  { name: 'Late', value: dashboardStats.lateToday },
  { name: 'Absent', value: dashboardStats.absentToday },
  { name: 'Remaining', value: dashboardStats.totalEmployees - dashboardStats.presentToday - dashboardStats.lateToday - dashboardStats.absentToday },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-surface-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${card.up ? 'text-green-600' : 'text-red-500'}`}>
                  {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-surface-900">{card.value}</div>
              <div className="text-xs text-surface-500 mt-1">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Today's Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-surface-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="rate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="confidence" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900">Recent Scans</h3>
            <div className="flex items-center gap-1 text-xs text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
              Live
            </div>
          </div>
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {recentScans.slice(0, 8).map((scan) => (
              <div key={scan.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  scan.status === 'success' ? 'bg-accent-100' : 'bg-red-100'
                }`}>
                  <Scan className={`w-4 h-4 ${scan.status === 'success' ? 'text-accent-600' : 'text-red-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 truncate">{scan.employeeName}</p>
                  <p className="text-xs text-surface-500">
                    {new Date(scan.timestamp).toLocaleTimeString()} • {scan.confidence}% confidence
                  </p>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  scan.status === 'success' ? 'bg-accent-50 text-accent-700' : 'bg-red-50 text-red-700'
                }`}>
                  {scan.status === 'success' ? 'Marked' : 'Failed'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Department Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Department Performance</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={departmentStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
