import { useState, useEffect } from 'react';
import { robotApi } from '../../services/api';
import type { RobotStats } from '../../types';
import {
    Battery,
    Gauge,
    Thermometer,
    Cloud,
    Zap,
    Timer,
    Cpu,
    Signal,
    Navigation,
    AlertTriangle,
    Settings
} from 'lucide-react';

export const StatsView = () => {
    const [stats, setStats] = useState<RobotStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial load
        loadStats();
        
        // Set up interval to update stats
        const interval = setInterval(loadStats, 1000);
        
        return () => {
            clearInterval(interval);
        };
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const response = await robotApi.getStatus();
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatUptime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    if (loading && !stats) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* System Status */}
                <div className="bg-gray-800 rounded-lg p-6 col-span-full">
                    <h2 className="text-xl font-semibold mb-4">System Status</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400">Status</span>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="text-2xl font-bold">Online</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400">Uptime</span>
                                <Timer className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="text-2xl font-bold">{stats ? formatUptime(stats.uptime) : '0h 0m'}</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400">Errors</span>
                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div className="text-2xl font-bold">{stats?.errors || 0}</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400">Mode</span>
                                <Settings className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-2xl font-bold">{stats?.mode || 'Unknown'}</div>
                        </div>
                    </div>
                </div>

                {/* Power Metrics */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Power</h2>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Battery className="w-5 h-5 text-green-400" />
                                    <span>Battery</span>
                                </div>
                                <span className="text-xl font-bold">{stats?.battery || 0}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-green-400 rounded-full transition-all duration-500"
                                    style={{ width: `${stats?.battery || 0}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    <span>Power Draw</span>
                                </div>
                                <span className="text-xl font-bold">{stats?.powerConsumption.toFixed(1) || 0}W</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                    style={{ width: `${((stats?.powerConsumption || 0) / 500) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Environmental Metrics */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Environmental</h2>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Thermometer className="w-5 h-5 text-red-400" />
                                    <span>Temperature</span>
                                </div>
                                <span className="text-xl font-bold">{stats?.temperature || 0}°C</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-red-400 rounded-full transition-all duration-500"
                                    style={{ width: `${((stats?.temperature || 0) / 100) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Cloud className="w-5 h-5 text-blue-400" />
                                    <span>Humidity</span>
                                </div>
                                <span className="text-xl font-bold">{stats?.humidity || 0}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-400 rounded-full transition-all duration-500"
                                    style={{ width: `${stats?.humidity || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Performance</h2>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-purple-400" />
                                    <span>CPU Usage</span>
                                </div>
                                <span className="text-xl font-bold">{stats?.cpuUsage || 0}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-purple-400 rounded-full transition-all duration-500"
                                    style={{ width: `${stats?.cpuUsage || 0}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Gauge className="w-5 h-5 text-blue-400" />
                                    <span>Speed</span>
                                </div>
                                <span className="text-xl font-bold">{stats?.speed.toFixed(2) || 0} m/s</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-400 rounded-full transition-all duration-500"
                                    style={{ width: `${((stats?.speed || 0) / 5) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};