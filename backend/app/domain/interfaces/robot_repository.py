from abc import ABC, abstractmethod
from app.domain.entities.robot import RobotState, RobotCommand

class RobotRepositoryInterface(ABC):
    @abstractmethod
    def connect(self, ip_address: str) -> bool:
        pass
    
    @abstractmethod
    def disconnect(self) -> bool:
        pass
    
    @abstractmethod
    def send_command(self, command: RobotCommand) -> bool:
        pass
    
    @abstractmethod
    def get_state(self) -> RobotState:
        pass 