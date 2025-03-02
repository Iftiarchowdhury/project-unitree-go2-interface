from app.domain.interfaces.robot_repository import RobotRepositoryInterface
from app.domain.entities.robot import RobotState, RobotCommand
import random

class RobotRepository(RobotRepositoryInterface):
    def __init__(self):
        self.connected = False
        self.ip_address = None
    
    def connect(self, ip_address: str) -> bool:
        # Simulate connection
        print(f"Connecting to robot at {ip_address}")
        self.connected = True
        self.ip_address = ip_address
        return True
    
    def disconnect(self) -> bool:
        # Simulate disconnection
        print(f"Disconnecting from robot at {self.ip_address}")
        self.connected = False
        self.ip_address = None
        return True
    
    def send_command(self, command: RobotCommand) -> bool:
        if not self.connected:
            raise ConnectionError("Not connected to robot")
        # Simulate sending command
        print(f"Sending command {command.command} to robot")
        return True
    
    def get_state(self) -> RobotState:
        if not self.connected:
            raise ConnectionError("Not connected to robot")
        # Simulate getting robot state with random values
        return RobotState(
            battery=random.uniform(20, 100),
            temperature=random.uniform(20, 80),
            humidity=random.uniform(30, 70),
            cpu_usage=random.uniform(10, 90),
            power_consumption=random.uniform(100, 500),
            speed=random.uniform(0, 5),
            mode=random.choice(['Manual', 'Autonomous', 'Hybrid']),
            uptime=random.randint(0, 86400),
            errors=random.randint(0, 5)
        ) 