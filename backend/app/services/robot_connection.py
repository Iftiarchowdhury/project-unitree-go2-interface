import asyncio
import logging
import sys
import threading
import time
from queue import Queue
from lib.go2_webrtc_driver.webrtc_driver import Go2WebRTCConnection, WebRTCConnectionMethod
from lib.go2_webrtc_driver.constants import RTC_TOPIC, SPORT_CMD
from aiortc import MediaStreamTrack

# Configure logging
logging.basicConfig(level=logging.FATAL)

class RobotConnection:
    def __init__(self):
        self.conn = None
        self.ip_address = None
        self.connected = False
        self.video_frame_queue = Queue(maxsize=10)  # Limit queue size to avoid memory issues
        self.sensor_data_latest = None
        self.asyncio_loop = None
        self.asyncio_thread = None
        
    def connect(self, ip_address):
        """Connect to the robot using its IP address"""
        self.ip_address = ip_address
        
        # Create asyncio event loop
        self.asyncio_loop = asyncio.new_event_loop()
        
        # Start the asyncio event loop in a separate thread
        self.asyncio_thread = threading.Thread(
            target=self._run_connect_loop,
            args=(self.asyncio_loop, ip_address)
        )
        self.asyncio_thread.daemon = True
        self.asyncio_thread.start()
        
        # Wait for connection to be established
        timeout = 10
        start_time = time.time()
        while not self.connected and time.time() - start_time < timeout:
            time.sleep(0.1)
                
        if not self.connected:
            raise ConnectionError(f"Failed to connect to robot at {ip_address}")
                
        return True
            
    def _run_connect_loop(self, loop, ip_address):
        """Run the connection process in an asyncio loop"""
        asyncio.set_event_loop(loop)
        
        try:
            # Connect to the robot
            self.conn = Go2WebRTCConnection(WebRTCConnectionMethod.LocalSTA, ip=ip_address)
            loop.run_until_complete(self.conn.connect())
            
            # Switch video channel on and start receiving video frames
            self.conn.video.switchVideoChannel(True)
            
            # Add callback to handle received video frames
            self.conn.video.add_track_callback(self._handle_video_frame)
            
            # Define a callback function to handle lowstate status when received
            def lowstate_callback(message):
                current_message = message['data']
                self.sensor_data_latest = current_message
                # Log the data for debugging
                # print(f"Received sensor data: {current_message}")
            
            # Subscribe to the LOW_STATE data channel to receive sensor updates
            self.conn.datachannel.pub_sub.subscribe(RTC_TOPIC['LOW_STATE'], lowstate_callback)
            
            # Set connected status
            self.connected = True
            print(f"Successfully connected to robot at {ip_address}")
            
            # Keep the loop running
            loop.run_forever()
                
        except Exception as e:
            logging.error(f"Error in WebRTC connection: {e}")
            self.connected = False
                
    async def _handle_video_frame(self, track: MediaStreamTrack):
        """Handle incoming video frames"""
        while True:
            try:
                frame = await track.recv()
                # Convert frame to numpy array for OpenCV
                img = frame.to_ndarray(format="bgr24")
                
                # If the queue is getting too large, remove old frames
                if self.video_frame_queue.full():
                    try:
                        self.video_frame_queue.get_nowait()
                    except:
                        pass
                        
                self.video_frame_queue.put(img)
            except Exception as e:
                logging.error(f"Error receiving video frame: {e}")
                # Brief pause to avoid tight loop if there's a persistent error
                await asyncio.sleep(0.1)
            
    def get_latest_video_frame(self):
        """Get the latest video frame from the queue"""
        if not self.connected:
            return None
            
        if not self.video_frame_queue.empty():
            return self.video_frame_queue.get()
        return None
            
    def get_latest_sensor_data(self):
        """Get the latest sensor data"""
        if not self.connected:
            return None
            
        return self.sensor_data_latest
            
    def send_command(self, command):
        """Send a command to the robot"""
        if not self.connected or not self.conn:
            raise ConnectionError("Not connected to robot")
                
        # Use asyncio to run the coroutine
        future = asyncio.run_coroutine_threadsafe(
            self._send_command_async(command),
            self.asyncio_loop
        )
        
        # Wait for the result with a timeout
        try:
            return future.result(timeout=5)
        except Exception as e:
            raise RuntimeError(f"Error sending command: {e}")
                
    async def _send_command_async(self, command):
        """Send a command to the robot asynchronously"""
        # Commands mapping
        commands = {
            "forward": {"api_id": SPORT_CMD["Move"], "parameter": {"x": 0.5, "y": 0, "z": 0}},
            "backward": {"api_id": SPORT_CMD["Move"], "parameter": {"x": -0.5, "y": 0, "z": 0}},
            "left": {"api_id": SPORT_CMD["Move"], "parameter": {"x": 0, "y": 0.5, "z": 0}},
            "right": {"api_id": SPORT_CMD["Move"], "parameter": {"x": 0, "y": -0.5, "z": 0}},
            "stop": {"api_id": SPORT_CMD["StopMove"]},
            "standup": {"api_id": SPORT_CMD["StandUp"]},
            "sitdown": {"api_id": SPORT_CMD["StandDown"]},
            "hello": {"api_id": SPORT_CMD["Hello"]}
        }
        
        if command in commands:
            await self.conn.datachannel.pub_sub.publish_request_new(
                RTC_TOPIC["SPORT_MOD"], 
                commands[command]
            )
            return True
        else:
            raise ValueError(f"Unknown command: {command}")
                
    def disconnect(self):
        """Disconnect from the robot"""
        if self.connected and self.conn:
            if self.asyncio_loop:
                try:
                    asyncio.run_coroutine_threadsafe(
                        self.conn.disconnect(),
                        self.asyncio_loop
                    )
                except Exception as e:
                    logging.error(f"Error disconnecting: {e}")
                    
            # Stop the asyncio loop
            if self.asyncio_loop:
                try:
                    self.asyncio_loop.call_soon_threadsafe(self.asyncio_loop.stop)
                except Exception as e:
                    logging.error(f"Error stopping asyncio loop: {e}")
                    
            # Join the thread
            if self.asyncio_thread and self.asyncio_thread.is_alive():
                self.asyncio_thread.join(timeout=5)
                    
            self.connected = False
            self.conn = None
            self.ip_address = None
            self.video_frame_queue = Queue(maxsize=10)
            self.sensor_data_latest = None
                
        return True

# Create a singleton instance
robot_connection = RobotConnection()