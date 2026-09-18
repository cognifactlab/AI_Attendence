from datetime import datetime
from typing import Optional

def format_datetime(dt: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """Format a datetime object to string"""
    return dt.strftime(format_str)

def generate_employee_id(counter: int) -> str:
    """Generate a unique employee ID"""
    return f"EMP-{str(counter).zfill(4)}"

def calculate_confidence_level(confidence: float) -> str:
    """Calculate confidence level based on score"""
    if confidence >= 95:
        return "high"
    elif confidence >= 85:
        return "medium"
    else:
        return "low"

def parse_time_string(time_str: str) -> Optional[datetime.time]:
    """Parse a time string to time object"""
    try:
        parts = time_str.split(':')
        if len(parts) == 2:
            return datetime.time(int(parts[0]), int(parts[1]))
        elif len(parts) == 3:
            return datetime.time(int(parts[0]), int(parts[1]), int(parts[2]))
    except:
        pass
    return None
