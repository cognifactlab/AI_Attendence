import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, Shield, Camera, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateProfile(formData);
    toast.success('Profile updated successfully!');
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-surface-100"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=3b82f6&color=fff&size=128`}
              alt={user?.name}
              className="w-24 h-24 rounded-full"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-surface-900">{user?.name}</h2>
            <p className="text-surface-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium capitalize">
                {user?.role}
              </span>
              <span className="px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-surface-100"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-6">Personal Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-surface-700 mb-1.5 block flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-surface-700 mb-1.5 block flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Department
              </label>
              <input
                type="text"
                placeholder="Engineering"
                className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-surface-100"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-600" /> Security Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
            <div>
              <p className="font-medium text-surface-900">Two-Factor Authentication</p>
              <p className="text-sm text-surface-500">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
            <div>
              <p className="font-medium text-surface-900">Change Password</p>
              <p className="text-sm text-surface-500">Last changed 30 days ago</p>
            </div>
            <button className="px-4 py-2 border border-surface-200 text-surface-700 rounded-lg text-sm font-medium hover:bg-surface-100 transition-colors">
              Update
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
            <div>
              <p className="font-medium text-surface-900">Active Sessions</p>
              <p className="text-sm text-surface-500">2 devices currently logged in</p>
            </div>
            <button className="px-4 py-2 border border-surface-200 text-surface-700 rounded-lg text-sm font-medium hover:bg-surface-100 transition-colors">
              Manage
            </button>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-red-200"
      >
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
          <div>
            <p className="font-medium text-red-900">Delete Account</p>
            <p className="text-sm text-red-700">Permanently delete your account and all data</p>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
