import { useAuth } from '../Auth/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold">
            Go 2 Control Panel
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              <User className="w-5 h-5" />
              <span>{user.displayName}</span>
            </Link>
            <button
              onClick={() => logout()}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}; 