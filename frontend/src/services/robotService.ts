import { robotApi } from './api';
import { database, getCurrentUser } from './firebase';
import { ref, onValue, off } from 'firebase/database';
import type { RobotStats } from '../types';

class RobotService {
  private statsListener: any = null;
  private currentIp: string | null = null;

  // Connect to robot
  async connect(ipAddress: string): Promise<void> {
    try {
      await robotApi.connect(ipAddress);
      this.currentIp = ipAddress;
    } catch (error) {
      console.error('Error connecting to robot:', error);
      throw error;
    }
  }

  // Send control commands to the robot
  async sendCommand(command: string): Promise<void> {
    if (!this.currentIp) {
      throw new Error('Not connected to robot');
    }

    try {
      await robotApi.sendCommand(command);
      await this.logOperation(`Sent command: ${command}`);
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  }

  // Terminate session
  async terminateSession(): Promise<void> {
    if (!this.currentIp) {
      throw new Error('Not connected to robot');
    }

    try {
      await robotApi.terminateSession();
      this.currentIp = null;
      await this.logOperation('Session terminated');
    } catch (error) {
      console.error('Error terminating session:', error);
      throw error;
    }
  }

  // Get current robot stats
  async getRobotStats(): Promise<RobotStats> {
    try {
      const response = await robotApi.getStatus();
      return response.data;
    } catch (error) {
      console.error('Error getting robot stats:', error);
      throw error;
    }
  }

  // Subscribe to real-time robot stats updates
  subscribeToStats(callback: (stats: RobotStats) => void): void {
    const statsRef = ref(database, 'robotStats');
    this.statsListener = onValue(statsRef, (snapshot) => {
      const stats = snapshot.val();
      callback(stats);
    });
  }

  // Unsubscribe from stats updates
  unsubscribeFromStats(): void {
    if (this.statsListener) {
      const statsRef = ref(database, 'robotStats');
      off(statsRef, 'value', this.statsListener);
      this.statsListener = null;
    }
  }

  // Log robot operation
  async logOperation(operation: string): Promise<void> {
    const user = await getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const logEntry = {
      operation,
      timestamp: new Date().toISOString(),
      userId: user.uid,
    };

    try {
      await robotApi.logOperation(logEntry);
    } catch (error) {
      console.error('Error logging operation:', error);
      throw error;
    }
  }
}

export const robotService = new RobotService();
export default robotService; 