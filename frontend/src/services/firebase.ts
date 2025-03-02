import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getDatabase, 
  ref, 
  set, 
  get,
  update 
} from 'firebase/database';
import type { User, UserPreferences } from '../types';
import { firebaseConfig } from '../config/firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Auth functions
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  // Update last login time
  await update(ref(database, `users/${userCredential.user.uid}`), {
    lastLogin: new Date().toISOString(),
    role: isAdminEmail(email) ? 'admin' : 'user' // Ensure admin role is set on login
  });
  
  return userCredential;
};

export const registerUser = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user profile in realtime database
  await set(ref(database, `users/${user.uid}`), {
    email,
    displayName,
    role: email === 'shakhawat.swe@gmail.com' ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  });

  return userCredential;
};

export const logoutUser = () => {
  return signOut(auth);
};

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

// Database functions
export const getUserProfile = async (userId: string): Promise<User | null> => {
  const snapshot = await get(ref(database, `users/${userId}`));
  const userData = snapshot.val();
  if (userData) {
    // Ensure admin role is set correctly based on email
    if (isAdminEmail(userData.email)) {
      userData.role = 'admin';
      // Update the role in database if it's not correct
      if (userData.role !== 'admin') {
        await update(ref(database, `users/${userId}`), { role: 'admin' });
      }
    }
  }
  return userData;
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
  return update(ref(database, `users/${userId}`), data);
};

export const getUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  const snapshot = await get(ref(database, `preferences/${userId}`));
  return snapshot.val();
};

export const updateUserPreferences = async (userId: string, preferences: Partial<UserPreferences>) => {
  return update(ref(database, `preferences/${userId}`), preferences);
};

export const getAllUsers = async (): Promise<User[]> => {
  const snapshot = await get(ref(database, 'users'));
  return Object.values(snapshot.val() || {});
};

// Add a function to check if a user is admin
export const isAdminEmail = (email: string) => {
  return email === 'shakhawat.swe@gmail.com';
};

export { auth, database }; 