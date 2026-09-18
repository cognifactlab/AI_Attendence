import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Plus, Edit2, Trash2, UserCheck, UserX,
  Mail, Phone, Building2, Calendar, Scan, X, ChevronDown
} from 'lucide-react';
import { employees as initialEmployees } from '../data/mockData';
import { Employee } from '../types';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<{
    name: string; email: string; department: string; position: string; phone: string; status: 'active' | 'inactive';
  }>({
    name: '', email: '', department: '', position: '', phone: '', status: 'active',
  });

  const departments = [...new Set(employees.map(e => e.department))];

  const filtered = employees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const openAdd = () => {
    setEditingEmployee(null);
    setFormData({ name: '', email: '', department: '', position: '', phone: '', status: 'active' });
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name, email: emp.email, department: emp.department,
      position: emp.position, phone: emp.phone, status: emp.status,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? {
        ...e, ...formData,
      } : e));
    } else {
      const newEmp: Employee = {
        id: `EMP-${String(employees.length + 1).padStart(4, '0')}`,
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        faceRegistered: false,
        faceSamples: 0,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=3b82f6&color=fff&size=128`,
      };
      setEmployees(prev => [newEmp, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-surface-900">Employee Directory</h3>
          <p className="text-surface-500">{filtered.length} of {employees.length} employees</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-surface-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
            />
          </div>
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((emp, i) => (
          <motion.div
            key={emp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-surface-100 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-semibold text-surface-900 text-sm">{emp.name}</h4>
                  <p className="text-xs text-surface-500">{emp.id}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                emp.status === 'active' ? 'bg-accent-50 text-accent-700' : 'bg-red-50 text-red-700'
              }`}>
                {emp.status}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-surface-600">
                <Building2 className="w-3.5 h-3.5 text-surface-400" />
                {emp.department} • {emp.position}
              </div>
              <div className="flex items-center gap-2 text-xs text-surface-600">
                <Mail className="w-3.5 h-3.5 text-surface-400" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-surface-600">
                <Calendar className="w-3.5 h-3.5 text-surface-400" />
                Joined {emp.joinDate}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-100">
              <div className="flex items-center gap-1.5">
                {emp.faceRegistered ? (
                  <span className="flex items-center gap-1 text-xs text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
                    <Scan className="w-3 h-3" /> {emp.faceSamples} samples
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <UserX className="w-3 h-3" /> Not registered
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(emp)}
                  className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-900">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-surface-100">
                  <X className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-surface-700 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-surface-700 mb-1 block">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-700 mb-1 block">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-surface-700 mb-1 block">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 outline-none text-sm bg-white"
                    >
                      <option value="">Select...</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-700 mb-1 block">Position</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                      placeholder="Senior Developer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-surface-200 rounded-xl text-surface-700 font-medium hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.name || !formData.email}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 text-white rounded-xl font-medium transition-colors"
                >
                  {editingEmployee ? 'Save Changes' : 'Add Employee'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
