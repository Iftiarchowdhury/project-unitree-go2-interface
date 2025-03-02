import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from './components/Auth/AuthContext';
import { LoginPage, RegisterPage } from './components/Auth';
import { UserList } from './components/Users/UserList';
import { ConfigPage } from './components/Config/ConfigPage';
import { ControlView } from './components/Control/ControlView';
import { StatsView } from './components/Stats/StatsView';
import { ProfileView } from './components/Profile/ProfileView';
import { NotificationsView } from './components/Notifications/NotificationsView';
import App from './App';

// Protected Route wrapper component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to="/control" replace />,
      },
      {
        path: '/control',
        element: (
          <ProtectedRoute>
            <ControlView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/stats',
        element: (
          <ProtectedRoute>
            <StatsView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfileView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute adminOnly>
            <UserList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/config',
        element: (
          <ProtectedRoute adminOnly>
            <ConfigPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/notifications',
        element: (
          <ProtectedRoute>
            <NotificationsView />
          </ProtectedRoute>
        ),
      },
    ],
  },
]); 