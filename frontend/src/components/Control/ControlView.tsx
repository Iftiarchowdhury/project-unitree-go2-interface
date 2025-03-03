import { useState, useEffect, useRef } from 'react';
import { robotService } from '../../services/robotService';
import type { RobotStats } from '../../types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Square } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ControlView = () => {
    const [stats, setStats] = useState<RobotStats | null>(null);
    const [ipAddress, setIpAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [selectedCommand, setSelectedCommand] = useState('');
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const videoIntervalRef = useRef<number | null>(null);

    const commands = [
        'standup',
        'sitdown',
        'left',
        'right',
        'forward',
        'backward',
        'hello',
        'stop'
    ];

    const validateIpAddress = (ip: string) => {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(ip)) return false;
        const parts = ip.split('.');
        return parts.every(part => {
            const num = parseInt(part);
            return num >= 0 && num <= 255;
        });
    };

    const handleConnect = async () => {
        if (!validateIpAddress(ipAddress)) {
            toast.error('Invalid IP address format');
            return;
        }

        try {
            await robotService.connect(ipAddress);
            setIsConnected(true);
            toast.success('Successfully connected to robot');
            
            // Start fetching video frames
            fetchVideoFrame();
        } catch (error) {
            console.error('Connection error:', error);
            toast.error('Failed to connect to robot');
        }
    };

    const handleCommand = async (command: string) => {
        if (!isConnected) {
            toast.error('Please connect to robot first');
            return;
        }

        try {
            await robotService.sendCommand(command);
            toast.success(`Command ${command} sent successfully`);
        } catch (error) {
            console.error('Error sending command:', error);
            toast.error('Failed to send command');
        }
    };

    const handleExecuteCommand = async () => {
        if (!selectedCommand) {
            toast.error('Please select a command');
            return;
        }
        await handleCommand(selectedCommand);
    };

    const handleTerminate = async () => {
        try {
            await robotService.terminateSession();
            setIsConnected(false);
            toast.success('Session terminated successfully');
            
            // Stop video frame fetching
            if (videoIntervalRef.current) {
                clearInterval(videoIntervalRef.current);
                videoIntervalRef.current = null;
                setVideoSrc(null);
            }
        } catch (error) {
            console.error('Error terminating session:', error);
            toast.error('Failed to terminate session');
        }
    };
    
    // Function to fetch video frames
    const fetchVideoFrame = async () => {
        if (!isConnected) return;
        
        try {
            const response = await robotService.getVideoFrame();
            if (response && response.frame) {
                setVideoSrc(`data:image/jpeg;base64,${response.frame}`);
            }
        } catch (error) {
            console.error('Error fetching video frame:', error);
        }
    };
    
    // Start/stop video streaming
    useEffect(() => {
        if (isConnected) {
            // Start fetching video frames
            fetchVideoFrame();
            videoIntervalRef.current = window.setInterval(fetchVideoFrame, 100);
        } else {
            // Stop fetching video frames
            if (videoIntervalRef.current) {
                clearInterval(videoIntervalRef.current);
                videoIntervalRef.current = null;
            }
            setVideoSrc(null);
        }
        
        // Cleanup on unmount
        return () => {
            if (videoIntervalRef.current) {
                clearInterval(videoIntervalRef.current);
            }
        };
    }, [isConnected]);

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Video Feed */}
                <div className="lg:col-span-2">
                    <div className="bg-black rounded-lg overflow-hidden aspect-video">
                        {videoSrc ? (
                            <img
                                className="w-full h-full object-cover"
                                src={videoSrc}
                                alt="Robot video feed"
                            />
                        ) : (
                            <video
                                className="w-full h-full object-cover"
                                autoPlay
                                playsInline
                                muted
                                loop
                                poster="https://www.docs.quadruped.de/projects/go2/html/_images/Go2_Walking.gif"
                            >
                                <source src="/video-feed-url" type="video/mp4" />
                                Your browser does not support video playback.
                            </video>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    {/* Connection Panel */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Connection</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="ip-address" className="block text-sm font-medium mb-2">
                                    Robot IP Address
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="ip-address"
                                        type="text"
                                        value={ipAddress}
                                        onChange={(e) => setIpAddress(e.target.value)}
                                        placeholder="192.168.1.100"
                                        className="flex-1 bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleConnect}
                                        disabled={isConnected}
                                        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {isConnected ? 'Connected' : 'Connect'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Control Pad */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Controls</h2>
                        <div className="space-y-4 max-w-[240px] mx-auto">
                            {/* First row - Up arrow */}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => handleCommand('forward')}
                                    className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 active:bg-gray-500 transition"
                                >
                                    <ChevronUp className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Second row - Left, Stop, Right */}
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => handleCommand('left')}
                                    className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 active:bg-gray-500 transition"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={() => handleCommand('stop')}
                                    className="w-16 h-16 bg-red-700 rounded-lg flex items-center justify-center hover:bg-red-600 active:bg-red-500 transition"
                                >
                                    <Square className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={() => handleCommand('right')}
                                    className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 active:bg-gray-500 transition"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Third row - Down arrow */}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => handleCommand('backward')}
                                    className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 active:bg-gray-500 transition"
                                >
                                    <ChevronDown className="w-8 h-8" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Command Selection */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Commands</h2>
                        <div className="space-y-4">
                            <select
                                value={selectedCommand}
                                onChange={(e) => setSelectedCommand(e.target.value)}
                                className="w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Command</option>
                                {commands.map((cmd) => (
                                    <option key={cmd} value={cmd}>
                                        {cmd.charAt(0).toUpperCase() + cmd.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleExecuteCommand}
                                className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                            >
                                Execute
                            </button>
                        </div>
                    </div>

                    {/* Terminate Session */}
                    <button
                        onClick={handleTerminate}
                        className="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                    >
                        Terminate Session
                    </button>
                </div>
            </div>
        </div>
    );
};