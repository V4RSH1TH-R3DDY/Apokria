"""
Authentication router for Apokria API.
Provides endpoints for user registration, login, and user management.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from models.auth import UserCreate, UserLogin, Token, UserResponse, User, UserRole
from services.auth import AuthService
from utils.auth import get_current_user, require_admin
from utils.api_helpers import APIResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=dict)
async def register_user(user_data: UserCreate):
    """
    Register a new user account.
    
    - **username**: Unique username (3-20 characters)
    - **email**: Valid email address
    - **full_name**: User's full name
    - **password**: Password (minimum 8 characters)
    - **role**: User role (student/organizer/admin, default: student)
    """
    try:
        user = await AuthService.register_user(user_data)
        return APIResponse.success(
            data=user.dict(),
            message="User registered successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login", response_model=dict)
async def login_user(login_data: UserLogin):
    """
    Login with username and password.
    
    Returns JWT access token for authenticated requests.
    """
    try:
        token_response = await AuthService.login_user(login_data)
        return APIResponse.success(
            data=token_response,
            message="Login successful"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.get("/me", response_model=dict)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current user information from JWT token.
    
    Requires valid authentication token.
    """
    try:
        return APIResponse.success(
            data=current_user.dict(),
            message="User information retrieved successfully"
        )
    except Exception as e:
        logger.error(f"Get user info error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve user information"
        )

@router.post("/logout", response_model=dict)
async def logout_user(current_user: User = Depends(get_current_user)):
    """
    Logout current user.
    
    Note: In a JWT-based system, logout is typically handled client-side
    by removing the token. This endpoint is for logging purposes.
    """
    try:
        logger.info(f"User logged out: {current_user.username}")
        return APIResponse.success(
            message="Logout successful"
        )
    except Exception as e:
        logger.error(f"Logout endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed"
        )

@router.get("/users/{username}", response_model=dict)
async def get_user_by_username(
    username: str, 
    current_user: User = Depends(get_current_user)
):
    """
    Get user information by username.
    
    Requires authentication. Users can only view their own profile
    unless they have admin or organizer privileges.
    """
    try:
        # Check permissions
        if (current_user.username != username and 
            current_user.role not in [UserRole.ADMIN, UserRole.ORGANIZER]):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to view this user"
            )
        
        user = await AuthService.get_user_by_username(username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return APIResponse.success(
            data=user.dict(),
            message="User information retrieved successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get user by username error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve user information"
        )

@router.put("/users/{username}/role", response_model=dict)
async def update_user_role(
    username: str,
    new_role: UserRole,
    admin_user: User = Depends(require_admin)
):
    """
    Update user role (Admin only).
    
    Allows admins to change user roles between student, organizer, and admin.
    """
    try:
        updated_user = await AuthService.update_user_role(username, new_role, admin_user)
        return APIResponse.success(
            data=updated_user.dict(),
            message=f"User role updated to {new_role.value}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update user role error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not update user role"
        )

@router.get("/health", response_model=dict)
async def auth_health_check():
    """
    Authentication system health check.
    """
    try:
        # Test database connection
        from database.mongo_connection import mongodb
        
        # Check if database connection is healthy using the health check method
        db_healthy = await mongodb.health_check()
        
        # Simple database test - count users if connected
        user_count = 0
        if db_healthy:
            try:
                user_count = await mongodb.database.users.count_documents({})
            except Exception:
                user_count = 0  # If collection doesn't exist or other error
        
        return APIResponse.success(
            data={
                "status": "healthy",
                "database": "connected" if db_healthy else "disconnected",
                "total_users": user_count,
                "jwt_enabled": True
            },
            message="Authentication system is operational"
        )
        
    except Exception as e:
        logger.error(f"Auth health check error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication system is not available"
        )

# Test endpoints for development
@router.get("/protected", response_model=dict)
async def protected_route(current_user: User = Depends(get_current_user)):
    """
    Test endpoint for protected routes.
    Requires valid authentication token.
    """
    return APIResponse.success(
        data={
            "message": f"Hello {current_user.full_name}!",
            "username": current_user.username,
            "role": current_user.role.value,
            "user_id": current_user.id
        },
        message="Protected route accessed successfully"
    )

@router.get("/admin-only", response_model=dict)
async def admin_only_route(admin_user: User = Depends(require_admin)):
    """
    Test endpoint for admin-only routes.
    Requires admin role.
    """
    return APIResponse.success(
        data={
            "message": f"Admin access granted to {admin_user.full_name}",
            "admin_username": admin_user.username
        },
        message="Admin route accessed successfully"
    )