import axios ,{ AxiosResponse }from 'axios';
import type { RobotStats } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';  // Replace with your Flask backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        //'Accept': 'application/json',
    },
    withCredentials: true // if using credentials
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface LogEntry {
    operation: string;
    timestamp: string;
    userId: string;
}

export const robotApi = {
    // Connection endpoints
    connect: (ipAddress: string) =>
        api.post('/robot/connect', { ipAddress }),

    terminateSession: () =>
        api.post('/robot/terminate'),

    // Robot control endpoints
    sendCommand: (command: string) => 
        api.post('/robot/command', { command }),

    getStatus: () => 
        api.get<RobotStats>('/robot/status'),
    
    // Video endpoint
    getVideoFrame: () =>
        api.get('/robot/video'),

    // Configuration endpoints
    updateConfig: (config: Record<string, any>) =>
        api.post('/robot/config', config),

    getConfig: () =>
        api.get('/robot/config'),

    // System endpoints
    getSystemLogs: (limit: number = 100) =>
        api.get('/system/logs', { params: { limit } }),

    checkConnection: () =>
        api.get('/system/health'),

    // Add the logs endpoint
    logOperation: (logEntry: LogEntry): Promise<AxiosResponse> =>
        api.post('/robot/logs', logEntry),
};

export default api;