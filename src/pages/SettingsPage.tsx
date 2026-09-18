import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Shield, Globe, Palette, Database, Mail,
  Save, Loader2, Moon, Sun, Monitor
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { theme, toggleTheme, setTheme } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    attendanceAlerts: true,
    lateArrivalAlerts: true,
    weeklyReport: true,
    language: 'en',
    timezone: 'UTC-5',
    recognitionThreshold: 90,
    autoCheckOut: true,
    maxLateMinutes: 15,
  });

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully!');
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Settings</h2>
        <p className="text-surface-500">Manage your application preferences</p>
      </div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary-600" /> Appearance
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-surface-700 mb-3 block">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  theme === 'light' ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:border-surface-300'
                }`}
              >
                <Sun className="w-6 h-6 text-amber-500" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  theme === 'dark' ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:border-surface-300'
                }`}
              >
                <Moon className="w-6 h-6 text-indigo-500" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                className="p-4 rounded-xl border-2 border-surface-200 hover:border-surface-300 flex flex-col items-center gap-2 transition-all"
              >
                <Monitor className="w-6 h-6 text-surface-500" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-600" /> Notifications
        </h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about attendance' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications for real-time alerts' },
            { key: 'attendanceAlerts', label: 'Attendance Alerts', desc: 'Get notified when employees check in/out' },
            { key: 'lateArrivalAlerts', label: 'Late Arrival Alerts', desc: 'Alert when employees arrive late' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly attendance summary' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors">
              <div>
                <p className="font-medium text-surface-900 text-sm">{item.label}</p>
                <p className="text-xs text-surface-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onChange={(e) => setSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recognition Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-600" /> Recognition Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-surface-700 mb-1.5 block">
              Recognition Confidence Threshold: {settings.recognitionThreshold}%
            </label>
            <input
              type="range"
              min="70"
              max="99"
              value={settings.recognitionThreshold}
              onChange={(e) => setSettings(prev => ({ ...prev, recognitionThreshold: parseInt(e.target.value) }))}
              className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <p className="text-xs text-surface-500 mt-1">Minimum confidence score required for face match</p>
          </div>
          <div>
            <label className="text-sm font-medium text-surface-700 mb-1.5 block">
              Max Late Minutes: {settings.maxLateMinutes}
            </label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={settings.maxLateMinutes}
              onChange={(e) => setSettings(prev => ({ ...prev, maxLateMinutes: parseInt(e.target.value) }))}
              className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <p className="text-xs text-surface-500 mt-1">Minutes after start time to mark as late</p>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors">
            <div>
              <p className="font-medium text-surface-900 text-sm">Auto Check-out</p>
              <p className="text-xs text-surface-500">Automatically mark check-out at end of day</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoCheckOut}
                onChange={(e) => setSettings(prev => ({ ...prev, autoCheckOut: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Regional Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary-600" /> Regional Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-surface-700 mb-1.5 block">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 outline-none text-sm bg-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-surface-700 mb-1.5 block">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-500 outline-none text-sm bg-white"
            >
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC-6">Central Time (UTC-6)</option>
              <option value="UTC-7">Mountain Time (UTC-7)</option>
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC+0">UTC</option>
              <option value="UTC+1">Central European (UTC+1)</option>
              <option value="UTC+8">China Standard (UTC+8)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save All Settings
        </button>
      </div>
    </div>
  );
}
