from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import logging
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

SUPABASE_URL = "https://qqeanlpfsgowrbzukhie.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZWFubHBmc2dvd3JienVraGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5NzI3ODUsImV4cCI6MjAzNDU0ODc4NX0.qC1V67KzK6iCRh1CuuKkZSS4PbBYtBiMZ0SAY7AKQ-c"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Models
class LoginData(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    email: str
    name: Optional[str] = None
    points: Optional[int] = 0
    category: Optional[str] = None
    rank: Optional[int] = 0
    resumePoints: Optional[int] = 0
    aptitudePoints: Optional[int] = 0
    mockPoints: Optional[int] = 0
    dp900Points: Optional[int] = 0
    dp203Points: Optional[int] = 0
    aiCertPoints: Optional[int] = 0
    problemSolvingPoints: Optional[int] = 0

class ActivityData(BaseModel):
    date: str
    userid: str
    dsa_attempted: bool = False
    dsa_easy: int = 0
    dsa_medium: int = 0
    dsa_hard: int = 0
    sql_questions: int
    sql_platform: str
    learning_hours: float
    learning_topic: str
    project_hours: float
    project_description: str

# Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    logger.error(f"HTTP error occurred: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "status_code": exc.status_code,
            "detail": exc.detail
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"General error occurred: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "status_code": 500,
            "detail": "Internal server error"
        }
    )

# Page Routes
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Render the login page"""
    try:
        return templates.TemplateResponse("login.html", {"request": request})
    except Exception as e:
        logger.error(f"Error rendering login page: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/welcome", response_class=HTMLResponse)
async def welcome(request: Request):
    """Render the welcome page"""
    try:
        return templates.TemplateResponse("welcome.html", {"request": request})
    except Exception as e:
        logger.error(f"Error rendering welcome page: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/tracker", response_class=HTMLResponse)
async def tracker_page(request: Request):
    """Render the activity tracker page"""
    try:
        return templates.TemplateResponse("tracker.html", {"request": request})
    except Exception as e:
        logger.error(f"Error rendering tracker page: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# API Routes
@app.post("/login")
async def login(login_data: LoginData):
    """Handle user login"""
    try:
        logger.info(f"Login attempt for email: {login_data.email}")

        # Authenticate with Supabase
        try:
            auth_response = supabase.auth.sign_in_with_password({
                "email": login_data.email,
                "password": login_data.password
            })
            logger.debug("Authentication successful")
        except Exception as auth_error:
            logger.error(f"Authentication failed: {auth_error}")
            return JSONResponse(
                status_code=401,
                content={
                    "success": False,
                    "detail": "Invalid credentials"
                }
            )

        # Fetch user details
        try:
            user_data = supabase.table('users').select('*').eq('email', login_data.email).execute()

            if not user_data.data:
                logger.error("User data not found in database")
                return JSONResponse(
                    status_code=404,
                    content={
                        "success": False,
                        "detail": "User data not found"
                    }
                )

            user_details = user_data.data[0]
            logger.debug(f"User details retrieved successfully: {user_details}")
        except Exception as db_error:
            logger.error(f"Database query failed: {db_error}")
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "detail": "Error fetching user data"
                }
            )

        response_data = {
            "success": True,
            "access_token": auth_response.session.access_token,
            "user": {
                "email": login_data.email,
                "name": user_details.get('name', ''),
                "points": user_details.get('points', 0),
                "category": user_details.get('category', ''),
                "rank": user_details.get('rank', 0),
                "resumePoints": user_details.get('resume_points', 0),
                "aptitudePoints": user_details.get('aptitude_points', 0),
                "mockPoints": user_details.get('mock_points', 0),
                "dp900Points": user_details.get('dpai900_points', 0),
                "dp203Points": user_details.get('dp203etc_points', 0),
                "finalProjectPoints": user_details.get('final_project', 0),
                "aiCertPoints": user_details.get('ai_cert_points', 0),
                "problemSolvingPoints": user_details.get('problem_solving_points', 0)
            }
        }
        logger.info(f"Login successful for user: {login_data.email}")
        return JSONResponse(content=response_data)

    except Exception as e:
        logger.error(f"Unexpected error during login: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "detail": "An unexpected error occurred"
            }
        )

@app.post("/api/track-activity")
async def track_activity(activity_data: ActivityData):
    """Handle daily activity tracking"""
    try:
        # Convert activity date to UTC
        activity_date = datetime.fromisoformat(activity_data.date.replace('Z', '+00:00'))

        try:
            # Check if user has already logged activity for today
            existing_activity = supabase.table('daily_activities').select('*').eq('userid', activity_data.userid).eq('date', activity_date.date().isoformat()).execute()

            if existing_activity.data:
                return JSONResponse(
                    status_code=400,
                    content={
                        "success": False,
                        "detail": "Activity has already been logged for today"
                    }
                )

            # Insert activity data
            activity_insert = supabase.table('daily_activities').insert({
                "userid": activity_data.userid,
                "date": activity_date.date().isoformat(),
                "dsa_easy": activity_data.dsa_easy,
                "dsa_medium": activity_data.dsa_medium,
                "dsa_hard": activity_data.dsa_hard,
                "sql_questions": activity_data.sql_questions,
                "sql_platform": activity_data.sql_platform,
                "learning_hours": activity_data.learning_hours,
                "learning_topic": activity_data.learning_topic,
                "project_hours": activity_data.project_hours,
                "project_description": activity_data.project_description
            }).execute()

            logger.info(f"Activity logged successfully for user: {activity_data.userid}")
            return JSONResponse(content={"success": True})

        except Exception as db_error:
            logger.error(f"Database error: {db_error}")
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "detail": "Database error occurred"
                }
            )

    except Exception as e:
        logger.error(f"Error tracking activity: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "detail": "Failed to log activity"
            }
        )

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting application...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8008,
        reload=True,
        log_level="debug"
    )