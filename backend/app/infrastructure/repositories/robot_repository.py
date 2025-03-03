from app.domain.interfaces.robot_repository import RobotRepositoryInterface
from app.domain.entities.robot import RobotState, RobotCommand
from app.services.robot_connection import robot_connection
import cv2
import base64

class RobotRepository(RobotRepositoryInterface):
    def __init__(self):
        self.connected = False
        self.ip_address = None
    
    def connect(self, ip_address: str) -> bool:
        # Connect to the robot using the RobotConnection service
        print(f"Connecting to robot at {ip_address}")
        try:
            robot_connection.connect(ip_address)
            self.connected = True
            self.ip_address = ip_address
            return True
        except Exception as e:
            print(f"Error connecting to robot: {e}")
            return False
    
    def disconnect(self) -> bool:
        # Disconnect from the robot
        print(f"Disconnecting from robot at {self.ip_address}")
        try:
            robot_connection.disconnect()
            self.connected = False
            self.ip_address = None
            return True
        except Exception as e:
            print(f"Error disconnecting from robot: {e}")
            return False
    
    def send_command(self, command: RobotCommand) -> bool:
        if not self.connected:
            raise ConnectionError("Not connected to robot")
        
        # Send the command to the robot
        print(f"Sending command {command.command} to robot")
        try:
            return robot_connection.send_command(command.command)
        except Exception as e:
            print(f"Error sending command: {e}")
            return False
    
    def get_state(self) -> RobotState:
        if not self.connected:
            raise ConnectionError("Not connected to robot")
        
        # Get the latest sensor data from the robot
        sensor_data = robot_connection.get_latest_sensor_data()
        
        if not sensor_data:
            # Return default state if no sensor data available
            return RobotState(
                battery=0,
                temperature=0,
                humidity=0,
                cpu_usage=0,
                power_consumption=0,
                speed=0,
                mode="Unknown",
                uptime=0,
                errors=0
            )
        
        # Extract data from sensor_data
        # The format matches what we've seen in the examples
        imu_state = sensor_data.get('imu_state', {}).get('rpy', [0, 0, 0])
        bms_state = sensor_data.get('bms_state', {})
        temperature_ntc1 = sensor_data.get('temperature_ntc1', 0)
        power_v = sensor_data.get('power_v', 0)
        
        # Map the sensor data to our RobotState structure
        return RobotState(
            battery=bms_state.get('soc', 0),
            temperature=temperature_ntc1,
            humidity=50,  # Not directly available in sensor data
            cpu_usage=30,  # Not directly available in sensor data
            power_consumption=bms_state.get('current', 0) * power_v / 1000,  # Current * Voltage = Power
            speed=float(abs(imu_state[2])) / 10,  # Use yaw rotation as approximate speed indicator
            mode="Manual",  # Default mode
            uptime=100,  # Not directly available in sensor data
            errors=0   # Not directly available in sensor data
        )
    
    def get_video_frame(self):
        """Get the latest video frame as a base64-encoded JPEG image"""
        if not self.connected:
            raise ConnectionError("Not connected to robot")
        
        frame = robot_connection.get_latest_video_frame()
        
        if frame is not None:
            # Encode frame as JPEG
            _, buffer = cv2.imencode('.jpg', frame)
            # Convert to base64
            jpg_as_text = base64.b64encode(buffer).decode('utf-8')
            return jpg_as_text
        
        return None