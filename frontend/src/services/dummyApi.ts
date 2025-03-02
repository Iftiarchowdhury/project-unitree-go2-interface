import type { RobotStats } from '../types';
import type { Notification } from '../types/notifications';

// Dummy stats data generator
const generateDummyStats = (): RobotStats => ({
  battery: Math.floor(Math.random() * (100 - 20) + 20),
  temperature: Math.floor(Math.random() * (80 - 20) + 20),
  humidity: Math.floor(Math.random() * (100 - 30) + 30),
  cpuUsage: Math.floor(Math.random() * (100 - 10) + 10),
  powerConsumption: Math.floor(Math.random() * (500 - 100) + 100),
  speed: Number((Math.random() * 5).toFixed(1)),
  mode: ['Manual', 'Autonomous', 'Hybrid'][Math.floor(Math.random() * 3)],
  uptime: Math.floor(Math.random() * 86400), // Random seconds up to 24 hours
  errors: Math.floor(Math.random() * 5),
});

// Dummy notifications data
const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'Battery Low',
    message: 'Robot battery level is below 20%. Please connect to charging station.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    read: false,
  },
  {
    id: '2',
    title: 'Operation Completed',
    message: 'Scheduled maintenance routine has been completed successfully.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: true,
  },
  {
    id: '3',
    title: 'System Update',
    message: 'New firmware version 2.1.0 is available for installation.',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: '4',
    title: 'Connection Lost',
    message: 'Temporary connection loss detected. Reconnected automatically.',
    type: 'error',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: true,
  },
  {
    id: '5',
    title: 'Temperature Warning',
    message: 'Motor temperature exceeding normal operating range.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: false,
  },
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dummyApi = {
  // Stats API
  getStats: async (): Promise<RobotStats> => {
    await delay(800); // Simulate network delay
    return generateDummyStats();
  },

  subscribeToStats: (callback: (stats: RobotStats) => void) => {
    // Update stats every 5 seconds
    const interval = setInterval(() => {
      callback(generateDummyStats());
    }, 5000);

    return () => clearInterval(interval);
  },

  // Notifications API
  getNotifications: async (): Promise<Notification[]> => {
    await delay(1000);
    return [...dummyNotifications].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await delay(500);
    const notification = dummyNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  },

  markAllAsRead: async (): Promise<void> => {
    await delay(800);
    dummyNotifications.forEach(notification => {
      notification.read = true;
    });
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await delay(500);
    const index = dummyNotifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      dummyNotifications.splice(index, 1);
    }
  },
}; 