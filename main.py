from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import logging
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, time, timedelta
import pytz

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

# Security
security = HTTPBearer()

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

def is_same_tracking_day(date1, date2):
    """
    Compare two dates based on 4 AM IST cutoff.
    A day is considered from 4 AM IST to 3:59 AM IST the next day
    """
    ist = pytz.timezone('Asia/Kolkata')
    cutoff_time = time(4, 0)  # 4 AM

    # Convert both dates to IST
    date1_ist = date1.astimezone(ist)
    date2_ist = date2.astimezone(ist)

    if date1_ist.time() < cutoff_time:
        date1_ist = date1_ist - timedelta(days=1)
    if date2_ist.time() < cutoff_time:
        date2_ist = date2_ist - timedelta(days=1)

    return date1_ist.date() == date2_ist.date()

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
    sql_attempted: bool = False
    sql_questions: int = 0
    aptitude_attempted: bool = False
    aptitude_questions: int = 0
    youtube_checked: bool = False
    youtube_link: Optional[str] = None
    linkedin_checked: bool = False
    linkedin_link: Optional[str] = None
    ml_checked: bool = False
    ml_hours: float = 0
    de_checked: bool = False
    de_hours: float = 0
    ds_checked: bool = False
    ds_hours: float = 0
    cert_checked: bool = False
    cert_hours: float = 0
    proj_checked: bool = False
    proj_hours: float = 0
    sd_checked: bool = False
    sd_hours: float = 0

class AttendanceRecord(BaseModel):
    student_email: str
    student_name: str
    status: str

class AttendanceData(BaseModel):
    date: str
    session: int  # 1 for morning, 2 for afternoon
    attendance: list[AttendanceRecord]

#Exception Handlers
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

# Routes
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

@app.get("/analytics", response_class=HTMLResponse)
async def analytics_page(request: Request):
    """Render the analytics page"""
    try:
        return templates.TemplateResponse("analytics.html", {"request": request})
    except Exception as e:
        logger.error(f"Error rendering analytics page: {e}")
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

        # Fetch user data
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

@app.get("/api/user-activities")
async def get_user_activities(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get all activities for a user"""
    try:
        # Verify the token
        try:
            user = supabase.auth.get_user(credentials.credentials)
            user_email = user.user.email
        except Exception as auth_error:
            logger.error(f"Authentication failed: {auth_error}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )

        # Fetch user's activities from the database
        activities = supabase.table('daily_activities')\
            .select('*')\
            .eq('userid', user_email)\
            .order('date', desc=True)\
            .execute()

        if not activities.data:
            return {
                "success": True,
                "activities": []
            }

        return {
            "success": True,
            "activities": activities.data
        }

    except Exception as e:
        logger.error(f"Error fetching user activities: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch activity data"
        )

@app.post("/api/track-activity")
async def track_activity(activity_data: ActivityData):
    """Handle daily activity tracking"""
    try:
        # Convert activity date to IST
        activity_date = datetime.fromisoformat(activity_data.date.replace('Z', '+00:00'))
        ist_now = datetime.now(pytz.timezone('Asia/Kolkata'))

        # Check if user has already logged activity for the current tracking day
        existing_activity = supabase.table('daily_activities').select('*').eq('userid', activity_data.userid).execute()

        if existing_activity.data:
            for activity in existing_activity.data:
                activity_timestamp = datetime.fromisoformat(activity['date']).replace(tzinfo=pytz.UTC)
                if is_same_tracking_day(activity_timestamp, ist_now):
                    return JSONResponse(
                        status_code=400,
                        content={
                            "success": False,
                            "detail": "Activity has already been logged for today's tracking period"
                        }
                    )

        # Set the date to the current tracking day
        if ist_now.time() < time(4, 0):
            tracking_date = (ist_now - timedelta(days=1)).date()
        else:
            tracking_date = ist_now.date()

        # Insert activity data
        activity_insert = supabase.table('daily_activities').insert({
            "userid": activity_data.userid,
            "date": tracking_date.isoformat(),
            "dsa_attempted": activity_data.dsa_attempted,
            "dsa_easy": activity_data.dsa_easy,
            "dsa_medium": activity_data.dsa_medium,
            "dsa_hard": activity_data.dsa_hard,
            "sql_attempted": activity_data.sql_attempted,
            "sql_questions": activity_data.sql_questions,
            "aptitude_attempted": activity_data.aptitude_attempted,
            "aptitude_questions": activity_data.aptitude_questions,
            "youtube_checked": activity_data.youtube_checked,
            "youtube_link": activity_data.youtube_link,
            "linkedin_checked": activity_data.linkedin_checked,
            "linkedin_link": activity_data.linkedin_link,
            "ml_checked": activity_data.ml_checked,
            "ml_hours": activity_data.ml_hours,
            "de_checked": activity_data.de_checked,
            "de_hours": activity_data.de_hours,
            "ds_checked": activity_data.ds_checked,
            "ds_hours": activity_data.ds_hours,
            "cert_checked": activity_data.cert_checked,
            "cert_hours": activity_data.cert_hours,
            "proj_checked": activity_data.proj_checked,
            "proj_hours": activity_data.proj_hours,
            "sd_checked": activity_data.sd_checked,
            "sd_hours": activity_data.sd_hours
        }).execute()

        logger.info(f"Activity logged successfully for user: {activity_data.userid}")
        return JSONResponse(content={"success": True})

    except Exception as e:
        logger.error(f"Error tracking activity: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "detail": "Failed to log activity"
            }
        )


# ATTERDANCE FUNCTIONS
@app.get("/attendance", response_class=HTMLResponse)
async def attendance_page(request: Request):
    """Render the attendance page"""
    try:
        return templates.TemplateResponse("attendance.html", {"request": request})
    except Exception as e:
        logger.error(f"Error rendering attendance page: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/get-students")
async def get_students():
    """Get list of students from users table"""
    try:
        #fetch from users table instead of attendance
        response = supabase.table('users')\
            .select('email, name')\
            .execute()

        if not response.data:
            return {
                "success": True,
                "students": []
            }


        students = [
            {
                "email": user['email'],
                "name": user['name'] or user['email']  #fallbak toe emaol if error occur with name
            }
            for user in response.data
        ]

        return {
            "success": True,
            "students": students
        }
    except Exception as e:
        logger.error(f"Error fetching students: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch students"
        )


@app.post("/api/submit-attendance")
async def submit_attendance(attendance_data: AttendanceData):
    """Submit attendance records"""
    try:
        #figure out whith session to add to
        session_column = 'morning_session' if attendance_data.session == 1 else 'afternoon_session'

        for record in attendance_data.attendance:
            #chek if att alr exist or no in the bekend
            existing = supabase.table('attendance')\
                .select('*')\
                .eq('date', attendance_data.date)\
                .eq('student_email', record.student_email)\
                .execute()

            if existing.data:
                #upserting existing rekord
                supabase.table('attendance')\
                    .update({
                        session_column: record.status,
                        'marked_at': datetime.now().isoformat()
                    })\
                    .eq('date', attendance_data.date)\
                    .eq('student_email', record.student_email)\
                    .execute()
            else:
                #creating new record
                new_record = {
                    'date': attendance_data.date,
                    'student_name': record.student_name,
                    'student_email': record.student_email,
                    session_column: record.status,
                    'marked_at': datetime.now().isoformat()
                }
                supabase.table('attendance').insert(new_record).execute()

        return {"success": True}

    except Exception as e:
        logger.error(f"Error submitting attendance: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to submit attendance"
        )

@app.get("/api/check-attendance/{date}/{session}")
async def check_attendance(date: str, session: int):
    """Check if attendance has already been marked for a session"""
    try:
        session_column = 'morning_session' if session == 1 else 'afternoon_session'

        response = supabase.table('attendance')\
            .select('*')\
            .eq('date', date)\
            .not_.is_(session_column, 'null')\
            .execute()

        return {
            "success": True,
            "exists": len(response.data) > 0,
            "attendance": response.data
        }
    except Exception as e:
        logger.error(f"Error checking attendance: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to check attendance"
        )

@app.get("/api/user-attendance")
async def get_user_attendance(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get attendance records for a user"""
    try:
        # Verify the token
        try:
            user = supabase.auth.get_user(credentials.credentials)
            user_email = user.user.email
        except Exception as auth_error:
            logger.error(f"Authentication failed: {auth_error}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )

        # Fetch attendance records from Supabase
        attendance_records = supabase.table('attendance')\
            .select('*')\
            .eq('student_email', user_email)\
            .execute()

        if not attendance_records.data:
            return {
                "success": True,
                "attendance": []
            }

        return {
            "success": True,
            "attendance": attendance_records.data
        }

    except Exception as e:
        logger.error(f"Error fetching attendance records: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch attendance records"
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