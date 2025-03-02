export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin: string;
}

export interface RobotStats {
  battery: number;
  speed: number;
  mode: 'Manual' | 'Autonomous';
  temperature: number;
  humidity: number;
  powerConsumption: number;
  batteryCapacity: number;
  cpuUsage: number;
  signalStrength: number;
  gpsAccuracy: number;
  uptime: number;
  errors: number;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  controlSettings: {
    sensitivity: number;
    maxSpeed: number;
    safetyLimits: boolean;
  };
  dashboardLayout: string[];
} 