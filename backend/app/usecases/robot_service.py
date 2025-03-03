from app.domain.interfaces.robot_repository import RobotRepositoryInterface
from app.domain.entities.robot import RobotCommand, RobotState

class RobotService:
    def __init__(self, repository: RobotRepositoryInterface):
        self.repository = repository
    
    def connect(self, ip_address: str) -> bool:
        return self.repository.connect(ip_address)
    
    def disconnect(self) -> bool:
        return self.repository.disconnect()
    
    def send_command(self, command: str, parameters: dict = None) -> bool:
        cmd = RobotCommand(command=command, parameters=parameters)
        return self.repository.send_command(cmd)
    
    def get_state(self) -> RobotState:
        return self.repository.get_state()
    
    def get_video_frame(self) -> str:
        """Get the latest video frame as a base64-encoded JPEG image"""
        return self.repository.get_video_frame()