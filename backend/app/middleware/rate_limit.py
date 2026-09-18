from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict
import time

class RateLimiter:
    """Simple in-memory rate limiter"""
    
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
    
    def is_rate_limited(self, client_id: str) -> bool:
        """Check if client has exceeded rate limit"""
        now = time.time()
        window_start = now - self.window_seconds
        
        # Clean old requests
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if req_time > window_start
        ]
        
        # Check if limit exceeded
        if len(self.requests[client_id]) >= self.max_requests:
            return True
        
        # Add current request
        self.requests[client_id].append(now)
        return False

# Global rate limiter instance
rate_limiter = RateLimiter(max_requests=100, window_seconds=60)

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    async def dispatch(self, request: Request, call_next):
        # Get client identifier (IP address)
        client_id = request.client.host
        
        # Check rate limit
        if rate_limiter.is_rate_limited(client_id):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later."
            )
        
        response = await call_next(request)
        return response
