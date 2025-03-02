from dataclasses import dataclass
from typing import Optional

@dataclass
class RobotState:
    battery: float
    temperature: float
    humidity: float
    cpu_usage: float
    power_consumption: float
    speed: float
    mode: str
    uptime: int
    errors: int

@dataclass
class RobotCommand:
    command: str
    parameters: Optional[dict] = None 