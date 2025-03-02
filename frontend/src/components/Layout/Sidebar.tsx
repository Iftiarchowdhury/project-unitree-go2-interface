import { useAuth } from '../Auth/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
  Gauge,
  Users,
  Settings,
  BarChart2,
  Gamepad2,
  User,
  Bell,
} from 'lucide-react';

export const Sidebar = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/control', icon: Gamepad2, label: 'Control', showAlways: true },
    { path: '/stats', icon: BarChart2, label: 'Stats', showAlways: true },
    { path: '/profile', icon: User, label: 'Profile', showAlways: true },
    { path: '/notifications', icon: Bell, label: 'Notifications', showAlways: true },
    { path: '/users', icon: Users, label: 'Users', adminOnly: true },
    { path: '/config', icon: Settings, label: 'Configuration', adminOnly: true },
  ];

  return (
    <aside className="bg-gray-800 w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          if (!item.showAlways && !isAdmin) return null;

          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}; 