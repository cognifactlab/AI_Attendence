import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Download, Calendar, Clock, CheckCircle2,
  AlertCircle, XCircle, UserCheck, Building2
} from 'lucide-react';
import { attendanceRecords } from '../data/mockData';

export default function AttendanceRecords() {
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const departments = [...new Set(attendanceRecords.map(r => r.department))];

  const filtered = attendanceRecords.filter(record => {
    const matchDate = record.date === dateFilter;
    const matchDept = departmentFilter === 'all' || record.department === departmentFilter;
    const matchStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchSearch = record.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(search.toLowerCase());
    return matchDate && matchDept && matchStatus && matchSearch;
  });

  const statusConfig = {
    present: { icon: CheckCircle2, color: 'text-accent-600', bg: 'bg-accent-50', label: 'Present' },
    late: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Late' },
    absent: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Absent' },
    'half-day': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Half Day' },
  };

  const summaryStats = {
    present: filtered.filter(r => r.status === 'present').length,
    late: filtered.filter(r => r.status === 'late').length,
    absent: filtered.filter(r => r.status === 'absent').length,
    halfDay: filtered.filter(r => r.status === 'half-day').length,
  };

  const handleExport = () => {
    const csv = [
      'Employee ID,Name,Department,Date,Check In,Check Out,Status,Confidence',
      ...filtered.map(r => `${r.employeeId},${r.employeeName},${r.department},${r.date},${r.checkIn || ''},${r.checkOut || ''},${r.status},${r.confidence}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${dateFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Present', value: summaryStats.present, icon: UserCheck, color: 'bg-accent-500', textColor: 'text-accent-600' },
          { label: 'Late', value: summaryStats.late, icon: Clock, color: 'bg-amber-500', textColor: 'text-amber-600' },
          { label: 'Absent', value: summaryStats.absent, icon: XCircle, color: 'bg-red-500', textColor: 'text-red-600' },
          { label: 'Half Day', value: summaryStats.halfDay, icon: AlertCircle, color: 'bg-blue-500', textColor: 'text-blue-600' },
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
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                  <div className="text-sm text-surface-500">{stat.label}</div>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-surface-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
            />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 outline-none text-sm"
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 outline-none text-sm bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 outline-none text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
            <option value="half-day">Half Day</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium flex items-center gap-2 transition-colors text-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Records Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Employee</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Department</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Check In</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Check Out</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filtered.slice(0, 50).map((record, i) => {
                const config = statusConfig[record.status];
                const StatusIcon = config.icon;
                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.01 }}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-surface-900">{record.employeeName}</div>
                        <div className="text-xs text-surface-500">{record.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-surface-600">
                        <Building2 className="w-3.5 h-3.5 text-surface-400" />
                        {record.department}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-surface-700 font-mono">{record.checkIn || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-surface-700 font-mono">{record.checkOut || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {record.confidence > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${record.confidence >= 95 ? 'bg-accent-500' : 'bg-amber-500'}`}
                              style={{ width: `${record.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-surface-600">{record.confidence}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-surface-400">N/A</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <p className="text-surface-500">No records found for the selected filters</p>
          </div>
        )}

        {filtered.length > 50 && (
          <div className="p-4 border-t border-surface-100 text-center">
            <p className="text-sm text-surface-500">Showing 50 of {filtered.length} records</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
