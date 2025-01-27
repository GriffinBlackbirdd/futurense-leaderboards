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
from cryptography.fernet import Fernet
import hashlib
import time
import base64
import hmac


logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
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
    ist = pytz.timezone("Asia/Kolkata")
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
    cohort: str
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
            "detail": exc.detail,
        },
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
            "detail": "Internal server error",
        },
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

@app.get("/videos", response_class=HTMLResponse)
async def videos_page(request: Request):
    """Render the videos page"""
    try:
        return templates.TemplateResponse("videos.html", {"request": request})
    except Exception as e:
        logger.error(f"Error rendering videos page: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/video-thumbnail/{video_id}")
async def get_video_thumbnail(video_id: str):
    """Fetch and return YouTube video thumbnail with fallback"""
    try:
        # Try to get YouTube thumbnail
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg")

            # If maxresdefault fails, try hqdefault
            if response.status_code != 200:
                response = await client.get(f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg")

            if response.status_code == 200:
                return StreamingResponse(
                    BytesIO(response.content),
                    media_type="image/jpeg",
                    headers={"Cache-Control": "public, max-age=31536000"}
                )

        # If both thumbnail attempts fail, return default placeholder
        default_path = "static/images/video-placeholder.jpg"
        if os.path.exists(default_path):
            return FileResponse(
                default_path,
                headers={"Cache-Control": "public, max-age=31536000"}
            )

    except Exception as e:
        logger.error(f"Error serving video thumbnail: {str(e)}")

    # Last resort: Return a generated placeholder
    fallback_url = "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/randoms/video-placeholder.jpg"
    async with httpx.AsyncClient() as client:
        response = await client.get(fallback_url)
        if response.status_code == 200:
            return StreamingResponse(
                BytesIO(response.content),
                media_type="image/jpeg"
            )

    raise HTTPException(status_code=404, detail="Thumbnail not found")

@app.get("/api/video-content")
async def get_video_content(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Return the video content data"""
    try:
        # Verify the token
        user = supabase.auth.get_user(credentials.credentials)

        # Video content structure
        video_content = {
            "python": [
                # {
                #     "id": "rfscVS0vtbw",
                #     "title": "Python Full Course for Beginners",
                #     "description": "Learn Python like a Professional. Start from the basics and go all the way to creating your own applications and games.",
                #     "duration": "4:26:52"
                # },
                # {
                #     "id": "kqtD5dpn9C8",
                #     "title": "Python for Beginners - Learn Python in 1 Hour",
                #     "description": "This Python tutorial for beginners shows how to get started with Python quickly. Learn to code in 1 hour!",
                #     "duration": "1:00:00"
                # },
                # {
                #     "id": "kqtD5dpn9C8",
                #     "title": "Python for Beginners - Learn Python in 1 Hour",
                #     "description": "This Python tutorial for beginners shows how to get started with Python quickly. Learn to code in 1 hour!",
                #     "duration": "1:00:00"
                # },

            ],
            "data_engineering": [
                {
                    "id": "ember/_05IfMn125o",
                    "title": "Session - 1: Data Engineering 101: Your Ultimate Begineer's Guide",
                    "description": "Curious about data engineering but not sure where to begin? In this 1-hour session, we’ll break down the basics and guide you through the fundamentals of data engineering. Whether you’re just starting out or hoping to deepen your understanding, this video has everything you need to get started on your journey.",
                    "duration": "1:06:21"
                },
                {
                    "id": "aK4Gpx3d2zU",
                    "title": "Session - 2: Getting Started with Azure: Creating Storage and Understanding the Basics",
                    "description": "Ready to dive into the world of Azure? In this video, we’ll walk you through the essentials of Microsoft Azure, including how to create and manage Azure Storage. Whether you’re a beginner or just looking to brush up on the basics, this session will help you understand the core concepts and give you hands-on experience.",
                    "duration": "55:21"
                },
                {
                    "id": "fvfxIIdkSXc",
                    "title": "Session - 3: Introduction to Azure Data Factory",
                    "description": "Curious about how to move and transform data in the cloud? In this video, we’ll introduce you to Azure Data Factory (ADF), Microsoft’s powerful data integration and orchestration tool. Whether you’re a beginner or exploring data engineering tools, this session will help you understand how Azure Data Factory works and why it’s essential for modern data workflows.",
                    "duration": "1:00:04"
                },
                {
                    "id": "1w0956AM7ZU",
                    "title": "Session - 4: Azure Data Factory 102",
                    "description": "Ready to take your Azure Data Factory skills to the next level? In this video, we’ll dive deeper into Azure Data Factory (ADF) and explore advanced features that help you design and manage complex data pipelines with ease. Whether you’re expanding your ADF knowledge or refining your data engineering skills, this session is packed with practical insights and tips.",
                    "duration": "47:40"
                },
                {
                    "id": "LG55zu_2cg0",
                    "title": "Session - 5: Dynamic Azure Data Factory 103",
                    "description": "Unlock the full potential of Azure Data Factory (ADF) with dynamic pipelines! In this advanced session, we’ll focus on creating dynamic and reusable workflows, enabling you to streamline data integration processes and maximize efficiency.",
                    "duration": "1:11:54"
                },
            ],
            "machine_learning": [
                # {
                #     "id": "KNAWp2S3w94",
                #     "title": "Machine Learning Basics",
                #     "description": "Introduction to machine learning concepts, algorithms, and practical applications.",
                #     "duration": "2:10:25"
                # },
                # {
                #     "id": "JcI5E2Ng6r4",
                #     "title": "Scikit-Learn Tutorial",
                #     "description": "Learn how to use Scikit-Learn for machine learning tasks with hands-on examples.",
                #     "duration": "1:30:15"
                # }
            ],
            "data_science": [
                # {
                #     "id": "ua-CiDNNj30",
                #     "title": "Data Science Full Course",
                #     "description": "Comprehensive guide to data science concepts, tools, and methodologies.",
                #     "duration": "1:45:15"
                # },
                # {
                #     "id": "LHBE6Q9XlzI",
                #     "title": "Pandas for Data Analysis",
                #     "description": "Master data analysis with Pandas library through practical examples and real-world datasets.",
                #     "duration": "1:15:40"
                # }
            ],
            "system_design": [
                # {
                #     "id": "xpDnVSmNFX0",
                #     "title": "System Design Fundamentals",
                #     "description": "Learn the core concepts of system design and architecture with practical examples.",
                #     "duration": "2:30:00"
                # },
                # {
                #     "id": "Y6Ev8GIlbxc",
                #     "title": "Scalable System Design Patterns",
                #     "description": "Explore common system design patterns used in building scalable applications.",
                #     "duration": "1:55:30"
                # }
            ]
        }

        return {
            "success": True,
            "content": video_content
        }

    except Exception as e:
        logger.error(f"Error fetching video content: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch video content"
        )


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
            auth_response = supabase.auth.sign_in_with_password(
                {"email": login_data.email, "password": login_data.password}
            )
            logger.debug("Authentication successful")
        except Exception as auth_error:
            logger.error(f"Authentication failed: {auth_error}")
            return JSONResponse(
                status_code=401,
                content={"success": False, "detail": "Invalid credentials"},
            )

        # Fetch user data
        try:
            user_data = (
                supabase.table("users")
                .select("*")
                .eq("email", login_data.email)
                .execute()
            )

            if not user_data.data:
                logger.error("User data not found in database")
                return JSONResponse(
                    status_code=404,
                    content={"success": False, "detail": "User data not found"},
                )

            user_details = user_data.data[0]
            logger.debug(f"User details retrieved successfully: {user_details}")
        except Exception as db_error:
            logger.error(f"Database query failed: {db_error}")
            return JSONResponse(
                status_code=500,
                content={"success": False, "detail": "Error fetching user data"},
            )

        response_data = {
            "success": True,
            "access_token": auth_response.session.access_token,
            "user": {
                "email": login_data.email,
                "name": user_details.get("name", ""),
                "points": user_details.get("points", 0),
                "category": user_details.get("category", ""),
                "rank": user_details.get("rank", 0),
                "cohort": user_details.get("cohort", ""),
                "resumePoints": user_details.get("resume_points", 0),
                "aptitudePoints": user_details.get("aptitude_points", 0),
                "mockPoints": user_details.get("mock_points", 0),
                "dp900Points": user_details.get("dpai900_points", 0),
                "dp203Points": user_details.get("dp203etc_points", 0),
                "finalProjectPoints": user_details.get("final_project", 0),
                "aiCertPoints": user_details.get("ai_cert_points", 0),
                "problemSolvingPoints": user_details.get("problem_solving_points", 0),
            },
        }
        logger.info(f"Login successful for user: {login_data.email}")
        return JSONResponse(content=response_data)

    except Exception as e:
        logger.error(f"Unexpected error during login: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "detail": "An unexpected error occurred"},
        )


@app.get("/api/user-activities")
async def get_user_activities(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
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
                detail="Invalid authentication credentials",
            )

        # Fetch user's activities from the database
        activities = (
            supabase.table("daily_activities")
            .select("*")
            .eq("userid", user_email)
            .order("date", desc=True)
            .execute()
        )

        if not activities.data:
            return {"success": True, "activities": []}

        return {"success": True, "activities": activities.data}

    except Exception as e:
        logger.error(f"Error fetching user activities: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch activity data",
        )


@app.post("/api/track-activity")
async def track_activity(activity_data: ActivityData):
    try:
        # Convert activity date to IST
        activity_date = datetime.fromisoformat(
            activity_data.date.replace("Z", "+00:00")
        )
        ist_now = datetime.now(pytz.timezone("Asia/Kolkata"))

        # Check if user has already logged activity for the current tracking day
        existing_activity = (
            supabase.table("daily_activities")
            .select("*")
            .eq("userid", activity_data.userid)
            .execute()
        )

        if existing_activity.data:
            for activity in existing_activity.data:
                activity_timestamp = datetime.fromisoformat(activity["date"]).replace(
                    tzinfo=pytz.UTC
                )
                if is_same_tracking_day(activity_timestamp, ist_now):
                    return JSONResponse(
                        status_code=400,
                        content={
                            "success": False,
                            "detail": "Activity has already been logged for today's tracking period",
                        },
                    )

        # Set the date to the current tracking day
        if ist_now.time() < time(4, 0):
            tracking_date = (ist_now - timedelta(days=1)).date()
        else:
            tracking_date = ist_now.date()

        # Insert activity data
        activity_insert = (
            supabase.table("daily_activities")
            .insert(
                {
                    "userid": activity_data.userid,
                    "cohort": activity_data.cohort,
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
                    "sd_hours": activity_data.sd_hours,
                }
            )
            .execute()
        )

        logger.info(f"Activity logged successfully for user: {activity_data.userid}")
        return JSONResponse(content={"success": True})

    except Exception as e:
        logger.error(f"Error tracking activity: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "detail": "Failed to log activity"},
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
        # fetch from users table instead of attendance
        response = supabase.table("users").select("email, name").eq("cohort", 2026).execute()


        if not response.data:
            return {"success": True, "students": []}

        students = [
            {
                "email": user["email"],
                "name": user["name"]
                or user["email"],  # fallbak toe emaol if error occur with name
            }
            for user in response.data
        ]

        return {"success": True, "students": students}
    except Exception as e:
        logger.error(f"Error fetching students: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch students")


@app.post("/api/submit-attendance")
async def submit_attendance(attendance_data: AttendanceData):
    """Submit attendance records"""
    try:
        # figure out whith session to add to
        session_column = (
            "morning_session" if attendance_data.session == 1 else "afternoon_session"
        )

        for record in attendance_data.attendance:
            # chek if att alr exist or no in the bekend
            existing = (
                supabase.table("attendance")
                .select("*")
                .eq("date", attendance_data.date)
                .eq("student_email", record.student_email)
                .execute()
            )

            if existing.data:
                # upserting existing rekord
                supabase.table("attendance").update(
                    {
                        session_column: record.status,
                        "marked_at": datetime.now().isoformat(),
                    }
                ).eq("date", attendance_data.date).eq(
                    "student_email", record.student_email
                ).execute()
            else:
                # creating new record
                new_record = {
                    "date": attendance_data.date,
                    "student_name": record.student_name,
                    "student_email": record.student_email,
                    session_column: record.status,
                    "marked_at": datetime.now().isoformat(),
                }
                supabase.table("attendance").insert(new_record).execute()

        return {"success": True}

    except Exception as e:
        logger.error(f"Error submitting attendance: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit attendance")


@app.get("/api/check-attendance/{date}/{session}")
async def check_attendance(date: str, session: int):
    """Check if attendance has already been marked for a session"""
    try:
        session_column = "morning_session" if session == 1 else "afternoon_session"

        response = (
            supabase.table("attendance")
            .select("*")
            .eq("date", date)
            .not_.is_(session_column, "null")
            .execute()
        )

        return {
            "success": True,
            "exists": len(response.data) > 0,
            "attendance": response.data,
        }
    except Exception as e:
        logger.error(f"Error checking attendance: {e}")
        raise HTTPException(status_code=500, detail="Failed to check attendance")


@app.get("/api/user-attendance")
async def get_user_attendance(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Get attendance records for a user"""
    try:
        try:
            user = supabase.auth.get_user(credentials.credentials)
            user_email = user.user.email
        except Exception as auth_error:
            logger.error(f"Authentication failed: {auth_error}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )

        attendance_records = (
            supabase.table("attendance")
            .select("*")
            .eq("student_email", user_email)
            .execute()
        )

        if not attendance_records.data:
            return {"success": True, "attendance": []}

        return {"success": True, "attendance": attendance_records.data}

    except Exception as e:
        logger.error(f"Error fetching attendance records: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch attendance records",
        )


@app.get("/sql-courses", response_class=HTMLResponse)
async def sql_courses_page(request: Request):
    return templates.TemplateResponse("sql-course.html", {"request": request})

@app.get("/sql-cheatsheet", response_class=HTMLResponse)
async def sqlCheatSheet(request: Request):
    CHEATSHEET_URL = "https://docs.google.com/spreadsheets/d/1ga0CGbYAUs240docApUdxLkJxUYGtsvSSnH3bjbKDpM/edit?gid=0#gid=0"
    return RedirectResponse(url=CHEATSHEET_URL, status_code = 303)

@app.get("/pandas-courses", response_class=HTMLResponse)
async def pandas_courses_page(request: Request):
    return templates.TemplateResponse("pandas-course.html", {"request": request})

from fastapi.responses import FileResponse
from pathlib import Path
from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse


@app.get("/api/pdf-proxy/{course_type}/{session_id}")
async def get_pdf_proxy(
    course_type: str,
    session_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        user = supabase.auth.get_user(credentials.credentials)

        # Separate PDF URLs for SQL and Pandas
        pdf_urls = {
            "sql": {
                1: "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Session%201%20_%20Details.pdf",
                2: "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Session%202%20_%20Details.pdf",
                3: "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Session%203%20_%20Details.pdf",
                4: "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Session%204%20_%20Details.pdf?t=2025-01-23T19%3A47%3A58.935Z",
                5: "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Session%205%20_%20Details.pdf?t=2025-01-23T19%3A50%3A22.135Z",
                6: "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Session%206%20_%20Details.pdf?t=2025-01-23T19%3A57%3A59.573Z",
                7: "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Session%207%20_%20Details.pdf?t=2025-01-23T19%3A59%3A28.693Z"

            },
            "pandas": {
                1: "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Pandas%201.pdf",
                2: "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Pandas%202.pdf",
                3: "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Pandas%203.pdf",
            }
        }

        if course_type not in pdf_urls or session_id not in pdf_urls[course_type]:
            logger.error(f"PDF URL not found for {course_type} session_id: {session_id}")
            raise HTTPException(status_code=404, detail="PDF not found")

        return RedirectResponse(url=pdf_urls[course_type][session_id], status_code=303)

    except Exception as e:
        logger.error(f"Error serving PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error serving PDF: {str(e)}")



@app.get("/api/sql-sessions")
async def get_sql_sessions(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        user = supabase.auth.get_user(credentials.credentials)

        sessions = [
            {
                "id": 1,
                "title": "Session 1: Introduction to SQL",
                "info": "Duration: 2 hours",
                "topics": "Importance of databases, Different types of databases with example, Introduction of SQL with real world examples , Installation of MySQL and related softwares, Understand the interface of MySQL",
                "pdfUrl": "/api/pdf-proxy/sql/1",
            },
            {
                "id": 2,
                "title": "Session 2: Basic database operations-II",
                "info": "Duration: 2.5 hours",
                "topics": "Importing the datasets in MySQL workbench. Demonstrating the ways of importing dataset, Defining the datasets which will be used throughout the module, Describe the basics of primary key and foreign key, Explanation on the DESCRIBE function for exploration, Explanation on the data types and their attributes, Running simple queries on the datasets which is the fundamental of SQL like SELECT clause and WHERE clause",
                "pdfUrl": "/api/pdf-proxy/sql/2",
            },
            {
                "id": 3,
                "title": "Session 3: Basic database operations-III",
                "info": "Duration: 2 hours",
                "topics": "Fetching the databases on conditions using WHERE Clause and usage of logical operators AND, OR and relational operators like >, <, >=, <=, <>, Applying filteration techniques like DISTINCT, Pattern Matching using LIKE Operator, Column Alias, Applying techniques like commenting which will help prepare documentation.",
                "pdfUrl": "/api/pdf-proxy/sql/3",
            },

            {
                "id": 4,
                "title": "Session 4: Basic database operations-IV",
                "info": "Duration: 2 hours",
                "topics": "Learning and applying CRUD operations (CREATE, READ, UPDATE, DELETE) on databases, using WHERE and IS NULL for filtering or finding null values, deleting rows (DELETE), and clearing tables while retaining headers (TRUNCATE)",
                "pdfUrl": "/api/pdf-proxy/sql/4",
            },

            {
                "id": 5,
                "title": "Session 5: Basic database operations-V",
                "info": "Duration: 2 hours",
                "topics": "Data-changing operations include ALTER for modifying tables (ADD, RENAME, DROP, MODIFY columns), INSERT for adding data into one or multiple columns, and applying CREATE, SHOW, DROP, and USE statements",
                "pdfUrl": "/api/pdf-proxy/sql/5",
            },

            {
                "id": 6,
                "title": "Session 6: Basic database operations-VI",
                "info": "Duration: 2 hours",
                "topics": "Data-changing operations include ALTER for modifying tables (ADD, RENAME, DROP, MODIFY columns), INSERT for adding data into one or multiple columns, and applying CREATE, SHOW, DROP, and USE statements",
                "pdfUrl": "/api/pdf-proxy/sql/6",
            },

            {
                "id": 7,
                "title": "Session 7: Basic database operations-VII",
                "info": "Duration: 2 hours",
                "topics": "Aggregate functions in SQL include SUM, MIN, MAX, AVG, COUNT, and DISTINCT, with practical use cases demonstrated alongside GROUP BY for grouping data, HAVING for filtering grouped data, and applying these functions on a dataset.",
                "pdfUrl": "/api/pdf-proxy/sql/7",
            }
        ]

        return {"success": True, "sessions": sessions}

    except Exception as e:
        logger.error(f"Error getting SQL sessions: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching session data")


@app.get("/api/pandas-sessions")
async def get_pandas_sessions(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        user = supabase.auth.get_user(credentials.credentials)

        sessions = [
            {
                "id": 1,
                "title": "Session 1: Pandas-I",
                "info": "Duration: 2 hours",
                "topics": "What is Pandas and why use it, installation of Pandas using pip or conda, data structures in Pandas, what a Series is, creation of Series, accessing elements of a Series, attributes of Series, methods of Series, mathematical operations on Series, difference between Series and NumPy array.",
                "pdfUrl": "/api/pdf-proxy/pandas/1",
            },
            {
                "id": 2,
                "title": "Session 2: Pandas-II",
                "info": "Duration: 2 hours",
                "topics": "Data exploration and manipulation: head(), tail(), info(), describe() functions, index and select data using iloc and loc with practical implementation, data alignment and reindexing with examples; Data cleaning and preprocessing: handling missing data using dropna(), fillna(), isna() with examples, imputation techniques (mean, median, mode), removing duplicates using drop_duplicates().",
                "pdfUrl": "/api/pdf-proxy/pandas/2",
            },
            {
                "id": 3,
                "title": "Session 3: Pandas-III",
                "info": "Duration: 2 hours",
                "topics": "Combining data using join(), concat(), and merge() with examples, groupby() function, aggregation functions like sum(), mean(), count(), min(), max() with practical implementation.",
                "pdfUrl": "/api/pdf-proxy/pandas/3",
            }
        ]

        return {"success": True, "sessions": sessions}

    except Exception as e:
        logger.error(f"Error getting Pandas sessions: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching session data")

import zipfile
import os
import httpx
import zipfile
import io
import os
import httpx
import zipfile
import io
import os
from fastapi.responses import StreamingResponse


@app.get("/api/resources/{course_type}/{session_id}")
async def get_session_resources(
    course_type: str,
    session_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        user = supabase.auth.get_user(credentials.credentials)

        resources = {
            "sql": {
                1: ["https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/SQL-Session1-Assignment.pdf"],
                2: [
                    "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Master%20Sales%20FY.zip",
                    "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/SQL-Session2-Assignment.pdf",
                ],
                3: ["https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/SQL-Session3-Assignment.pdf"],
                4: ["https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Session%204%20_%20Assessment%204.pdf?t=2025-01-23T19%3A50%3A30.790Z"],
                5: ["https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Session%205%20_%20Assessment%205.pdf?t=2025-01-23T19%3A56%3A54.957Z"],
                6: ["https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Session%206%20_%20Assessment%206.pdf?t=2025-01-23T19%3A56%3A47.670Z"],
                7: ["https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Session%207%20_%20Assessment%207.zip?t=2025-01-23T19%3A59%3A11.896Z"]
            },
            "pandas": {
                1: ["https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Pandas%201%20_%20Assessment.pdf"],
                2: ["https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Pandas-2%20Resources.zip"],
                3: ["https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/studymaterial/Pandas-3%20Resources.zip"]
            }
        }

        if course_type not in resources or session_id not in resources[course_type]:
            raise HTTPException(status_code=404, detail="Resources not found")

        zip_buffer = io.BytesIO()

        async with httpx.AsyncClient() as client:
            with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
                for url in resources[course_type][session_id]:
                    try:
                        response = await client.get(url)
                        if response.status_code == 200:
                            filename = os.path.basename(url.split("?")[0])
                            zipf.writestr(filename, response.content)
                        else:
                            logger.error(f"Failed to download resource: {url}")
                    except Exception as e:
                        logger.error(f"Error downloading resource {url}: {str(e)}")
                        continue

        zip_buffer.seek(0)

        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={
                "Content-Disposition": f'attachment; filename="{course_type.capitalize()}_{session_id}_Resources.zip"'
            },
        )

    except Exception as e:
        logger.error(f"Error serving resources: {str(e)}")
        raise HTTPException(status_code=500, detail="Error serving resources")


# @passwordReset Functions
# New route for the password reset page
@app.get("/reset-password", response_class=HTMLResponse)
async def reset_password_page(request: Request):
    """Render the password reset page"""
    try:
        return templates.TemplateResponse("forgotPass.html", {"request": request})
    except Exception as e:
        logger.error(f"Error rendering password reset page: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# New route for the update password page
@app.get("/update-password", response_class=HTMLResponse)
async def update_password_page(request: Request):
    """Render the update password page"""
    try:
        return templates.TemplateResponse("update-password.html", {"request": request})
    except Exception as e:
        logger.error(f"Error rendering update password page: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# API route to initiate password reset

@app.post("/api/reset-password")
async def reset_password(email_data: dict):
    try:
        email = email_data.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")

        try:
            # Use Supabase's password reset functionality
            reset_response = supabase.auth.reset_password_email(email)
            return {"success": True, "message": "Password reset email sent"}
        except Exception as auth_error:
            logger.error(f"Password reset failed: {auth_error}")
            raise HTTPException(
                status_code=400,
                detail="Failed to send reset email"
            )

    except HTTPException as http_error:
        raise http_error
    except Exception as e:
        logger.error(f"Error initiating password reset: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to initiate password reset"
        )
# API route to update password
import httpx

class PasswordUpdateData(BaseModel):
    token: str
    password: str

@app.post("/api/update-password")
async def update_password(password_data: PasswordUpdateData):
    try:
        # Extract access token from the full token string (which might include the URL)
        access_token = password_data.token.split('access_token=')[1].split('&')[0]

        if not access_token or not password_data.password:
            raise HTTPException(
                status_code=400,
                detail="Access token and new password are required"
            )

        # Make direct request to Supabase REST API
        headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        async with httpx.AsyncClient() as client:
            response = await client.put(
                f'{SUPABASE_URL}/auth/v1/user',
                headers=headers,
                json={'password': password_data.password}
            )

            if response.status_code == 200:
                return {
                    "success": True,
                    "message": "Password updated successfully"
                }
            else:
                logger.error(f"Password update failed: {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Failed to update password"
                )

    except HTTPException as http_error:
        raise http_error
    except Exception as e:
        logger.error(f"Error updating password: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to update password"
        )



if __name__ == "__main__":
    import uvicorn

    logger.info("Starting application...")
    uvicorn.run("main:app", host="0.0.0.0", port=8008, reload=True, log_level="debug")
