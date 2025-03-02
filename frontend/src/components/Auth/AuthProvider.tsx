import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { auth, loginUser, logoutUser, registerUser, getUserProfile } from '../../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from '../../types';
import { toast } from 'react-hot-toast';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setUser(userProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Error loading user profile');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await loginUser(email, password);
      const userProfile = await getUserProfile(userCredential.user.uid);
      if (userProfile) {
        setUser(userProfile);
        toast.success('Successfully logged in');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await registerUser(email, password, displayName);
      const userProfile = await getUserProfile(userCredential.user.uid);
      if (userProfile) {
        setUser(userProfile);
        toast.success('Successfully registered');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 