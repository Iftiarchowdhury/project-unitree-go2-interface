import { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { getUserPreferences, updateUserPreferences } from '../../services/firebase';
import type { UserPreferences } from '../../types';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Save,
  Moon,
  Bell,
  Sliders,
  Gauge,
  AlertTriangle
} from 'lucide-react';

export const ProfileView = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    if (!user) return;
    
    try {
      const prefs = await getUserPreferences(user.id);
      setPreferences(prefs || {
        userId: user.id,
        theme: 'dark',
        notifications: true,
        controlSettings: {
          sensitivity: 1,
          maxSpeed: 2.5,
          safetyLimits: true,
        },
        dashboardLayout: ['stats', 'controls', 'camera']
      });
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (
    key: keyof UserPreferences,
    value: any
  ) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  const handleControlSettingChange = (
    key: keyof UserPreferences['controlSettings'],
    value: any
  ) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      controlSettings: {
        ...preferences.controlSettings,
        [key]: value
      }
    });
  };

  const handleSave = async () => {
    if (!user || !preferences) return;
    
    setSaving(true);
    try {
      await updateUserPreferences(user.id, preferences);
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Info */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-400">Display Name</div>
                <div>{user.displayName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-400">Email</div>
                <div>{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-400">Joined</div>
                <div>{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-400">Role</div>
                <div className="capitalize">{user.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        {preferences && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Preferences</h2>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* General Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-gray-400" />
                      <span>Dark Theme</span>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('theme', preferences.theme === 'dark' ? 'light' : 'dark')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          preferences.theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <span>Notifications</span>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.notifications ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          preferences.notifications ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Control Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Control Settings</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-gray-400" />
                        <span>Control Sensitivity</span>
                      </div>
                      <span>{preferences.controlSettings.sensitivity}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={preferences.controlSettings.sensitivity}
                      onChange={(e) => handleControlSettingChange('sensitivity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-gray-400" />
                        <span>Maximum Speed</span>
                      </div>
                      <span>{preferences.controlSettings.maxSpeed} m/s</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.5"
                      value={preferences.controlSettings.maxSpeed}
                      onChange={(e) => handleControlSettingChange('maxSpeed', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-gray-400" />
                      <span>Safety Limits</span>
                    </div>
                    <button
                      onClick={() => handleControlSettingChange('safetyLimits', !preferences.controlSettings.safetyLimits)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.controlSettings.safetyLimits ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          preferences.controlSettings.safetyLimits ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 