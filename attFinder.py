# # from datetime import datetime, timedelta
# # from supabase import create_client
# # import pandas as pd
# # import os
# # from dotenv import load_dotenv

# # # Load environment variables
# # load_dotenv()

# # # Supabase configuration
# # SUPABASE_URL = os.getenv('SUPABASE_URL')
# # SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# # # Initialize Supabase client
# # supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
# # def calculate_aggregate_attendance():
# #     try:
# #         # Get all attendance records
# #         response = supabase.table('attendance').select('*').execute()
# #         attendance_data = response.data

# #         if not attendance_data:
# #             return {
# #                 "success": False,
# #                 "message": "No attendance records found"
# #             }

# #         # Process data by student
# #         student_attendance = {}
# #         dates_with_sessions = set()  # To track which dates had sessions

# #         for record in attendance_data:
# #             date = record['date']
# #             student_email = record['student_email']
# #             morning = record.get('morning_session')
# #             afternoon = record.get('afternoon_session')

# #             # Initialize student record if not exists
# #             if student_email not in student_attendance:
# #                 student_attendance[student_email] = {
# #                     'present_sessions': 0,
# #                     'total_sessions': 0
# #                 }

# #             # Track this date
# #             dates_with_sessions.add(date)

# #             # Count morning session if it exists
# #             if morning is not None:
# #                 student_attendance[student_email]['total_sessions'] += 1
# #                 if morning == 'present':
# #                     student_attendance[student_email]['present_sessions'] += 1

# #             # Count afternoon session if it exists
# #             if afternoon is not None:
# #                 student_attendance[student_email]['total_sessions'] += 1
# #                 if afternoon == 'present':
# #                     student_attendance[student_email]['present_sessions'] += 1

# #         # Calculate percentages and prepare report
# #         report = {
# #             'total_students': len(student_attendance),
# #             'total_dates': len(dates_with_sessions),
# #             'student_percentages': {},
# #             'class_average': 0,
# #             'attendance_summary': {
# #                 '75_and_above': 0,
# #                 'below_75': 0
# #             }
# #         }

# #         total_percentage = 0
# #         for student, data in student_attendance.items():
# #             if data['total_sessions'] > 0:
# #                 percentage = (data['present_sessions'] / data['total_sessions']) * 100
# #                 report['student_percentages'][student] = {
# #                     'percentage': round(percentage, 2),
# #                     'present_sessions': data['present_sessions'],
# #                     'total_sessions': data['total_sessions']
# #                 }
# #                 total_percentage += percentage

# #                 # Count students above/below 75%
# #                 if percentage >= 75:
# #                     report['attendance_summary']['75_and_above'] += 1
# #                 else:
# #                     report['attendance_summary']['below_75'] += 1

# #         # Calculate class average
# #         if report['total_students'] > 0:
# #             report['class_average'] = round(total_percentage / report['total_students'], 2)

# #         return {
# #             "success": True,
# #             "data": report
# #         }

# #     except Exception as e:
# #         return {
# #             "success": False,
# #             "message": f"Error calculating attendance: {str(e)}"
# #         }

# # def print_attendance_report():
# #     result = calculate_aggregate_attendance()

# #     if not result['success']:
# #         print(f"Error: {result['message']}")
# #         return

# #     data = result['data']

# #     print("\n=== ATTENDANCE REPORT ===")
# #     print(f"\nTotal Students: {data['total_students']}")
# #     print(f"Total Days with Sessions: {data['total_dates']}")
# #     print(f"Class Average Attendance: {data['class_average']}%")

# #     print("\n--- Attendance Distribution ---")
# #     print(f"Students with ≥75% attendance: {data['attendance_summary']['75_and_above']}")
# #     print(f"Students with <75% attendance: {data['attendance_summary']['below_75']}")

# #     print("\n--- Individual Student Reports ---")
# #     sorted_students = sorted(
# #         data['student_percentages'].items(),
# #         key=lambda x: x[1]['percentage'],
# #         reverse=True
# #     )

# #     for student, stats in sorted_students:
# #         status = "GOOD" if stats['percentage'] >= 75 else "NEEDS IMPROVEMENT"
# #         print(f"\nStudent: {student}")
# #         print(f"Attendance: {stats['percentage']}% ({stats['present_sessions']}/{stats['total_sessions']} sessions)")
# #         print(f"Status: {status}")

# #     print("\n=== End of Report ===\n")

# # # Usage:
# # # print_attendance_report()
# # from openpyxl import Workbook
# # from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
# # from openpyxl.utils import get_column_letter
# # from datetime import datetime

# # from openpyxl import Workbook
# # from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
# # from openpyxl.utils import get_column_letter
# # from datetime import datetime
# # from collections import defaultdict

# # def generate_detailed_attendance_excel():
# #     try:
# #         # Get raw attendance data
# #         response = supabase.table('attendance').select('*').order('date').execute()
# #         attendance_data = response.data

# #         if not attendance_data:
# #             return {"success": False, "message": "No attendance records found"}

# #         # Create workbook and styles
# #         wb = Workbook()
# #         header_font = Font(bold=True, color="FFFFFF")
# #         header_fill = PatternFill(start_color="2C5282", end_color="2C5282", fill_type="solid")
# #         present_fill = PatternFill(start_color="C6F6D5", end_color="C6F6D5", fill_type="solid")
# #         absent_fill = PatternFill(start_color="FED7D7", end_color="FED7D7", fill_type="solid")
# #         border = Border(
# #             left=Side(style='thin'),
# #             right=Side(style='thin'),
# #             top=Side(style='thin'),
# #             bottom=Side(style='thin')
# #         )

# #         # Organize data by student and date
# #         student_data = defaultdict(lambda: defaultdict(dict))
# #         all_dates = set()

# #         for record in attendance_data:
# #             date = record['date']
# #             student = record['student_email']
# #             all_dates.add(date)

# #             student_data[student][date] = {
# #                 'morning': record.get('morning_session'),
# #                 'afternoon': record.get('afternoon_session')
# #             }

# #         # Sort dates and students
# #         all_dates = sorted(list(all_dates))
# #         all_students = sorted(list(student_data.keys()))

# #         # Create Daily Attendance Sheet
# #         daily_sheet = wb.active
# #         daily_sheet.title = "Daily Attendance"

# #         # Headers
# #         headers = ["Student Email"]
# #         for date in all_dates:
# #             headers.extend([f"{date} Morning", f"{date} Afternoon"])
# #         headers.append("Overall %")

# #         for col, header in enumerate(headers, start=1):
# #             cell = daily_sheet.cell(row=1, column=col)
# #             cell.value = header
# #             cell.font = header_font
# #             cell.fill = header_fill
# #             cell.alignment = Alignment(horizontal='center')
# #             cell.border = border

# #         # Fill student attendance data
# #         for row_idx, student in enumerate(all_students, start=2):
# #             # Student email
# #             daily_sheet.cell(row=row_idx, column=1, value=student).border = border

# #             present_count = 0
# #             total_sessions = 0

# #             # Daily attendance
# #             col_idx = 2
# #             for date in all_dates:
# #                 if date in student_data[student]:
# #                     # Morning session
# #                     morning = student_data[student][date]['morning']
# #                     if morning is not None:
# #                         cell = daily_sheet.cell(row=row_idx, column=col_idx)
# #                         cell.value = morning
# #                         cell.border = border
# #                         cell.alignment = Alignment(horizontal='center')
# #                         if morning == 'present':
# #                             cell.fill = present_fill
# #                             present_count += 1
# #                         else:
# #                             cell.fill = absent_fill
# #                         total_sessions += 1
# #                     col_idx += 1

# #                     # Afternoon session
# #                     afternoon = student_data[student][date]['afternoon']
# #                     if afternoon is not None:
# #                         cell = daily_sheet.cell(row=row_idx, column=col_idx)
# #                         cell.value = afternoon
# #                         cell.border = border
# #                         cell.alignment = Alignment(horizontal='center')
# #                         if afternoon == 'present':
# #                             cell.fill = present_fill
# #                             present_count += 1
# #                         else:
# #                             cell.fill = absent_fill
# #                         total_sessions += 1
# #                     col_idx += 1

# #             # Calculate and add overall percentage
# #             if total_sessions > 0:
# #                 percentage = round((present_count / total_sessions) * 100, 2)
# #                 cell = daily_sheet.cell(row=row_idx, column=col_idx)
# #                 cell.value = f"{percentage}%"
# #                 cell.border = border
# #                 cell.alignment = Alignment(horizontal='center')
# #                 cell.fill = present_fill if percentage >= 75 else absent_fill

# #         # Add summary row
# #         summary_row = daily_sheet.max_row + 2
# #         daily_sheet.cell(row=summary_row, column=1, value="Daily Average").font = Font(bold=True)

# #         # Calculate daily averages
# #         col_idx = 2
# #         for date in all_dates:
# #             for session in ['morning', 'afternoon']:
# #                 present_count = sum(1 for student in all_students
# #                                   if date in student_data[student]
# #                                   and student_data[student][date][session] == 'present')
# #                 total_count = sum(1 for student in all_students
# #                                 if date in student_data[student]
# #                                 and student_data[student][date][session] is not None)

# #                 if total_count > 0:
# #                     percentage = round((present_count / total_count) * 100, 2)
# #                     cell = daily_sheet.cell(row=summary_row, column=col_idx)
# #                     cell.value = f"{percentage}%"
# #                     cell.font = Font(bold=True)
# #                     cell.border = border
# #                     cell.alignment = Alignment(horizontal='center')
# #                     cell.fill = present_fill if percentage >= 75 else absent_fill
# #                 col_idx += 1

# #         # Adjust column widths
# #         for column in daily_sheet.columns:
# #             max_length = 0
# #             column_letter = get_column_letter(column[0].column)
# #             for cell in column:
# #                 try:
# #                     if len(str(cell.value)) > max_length:
# #                         max_length = len(str(cell.value))
# #                 except:
# #                     pass
# #             adjusted_width = (max_length + 2)
# #             daily_sheet.column_dimensions[column_letter].width = adjusted_width

# #         # Save workbook
# #         filename = f"detailed_attendance_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
# #         wb.save(filename)

# #         return {
# #             "success": True,
# #             "message": f"Detailed Excel report generated successfully: {filename}"
# #         }

# #     except Exception as e:
# #         return {
# #             "success": False,
# #             "message": f"Error generating Excel report: {str(e)}"
# #         }

# # # Usage:
# # result = generate_detailed_attendance_excel()
# # print(result['message'])

# # # from supabase import create_client
# # # from datetime import datetime, timedelta
# # # import pandas as pd
# # # from typing import Dict, List, Optional
# # # import pytz

# # # # Initialize Supabase client
# # # SUPABASE_URL = "https://qqeanlpfsgowrbzukhie.supabase.co"
# # # SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZWFubHBmc2dvd3JienVraGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5NzI3ODUsImV4cCI6MjAzNDU0ODc4NX0.qC1V67KzK6iCRh1CuuKkZSS4PbBYtBiMZ0SAY7AKQ-c"

# # # supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# # # class AttendanceAnalyzer:
# # #     def __init__(self):
# # #         self.attendance_data = None
# # #         self.students_data = None

# # #     def fetch_data(self, start_date: Optional[str] = None, end_date: Optional[str] = None):
# # #         """
# # #         Fetch attendance data from Supabase within the specified date range
# # #         """
# # #         try:
# # #             # Fetch attendance data
# # #             query = supabase.table("attendance").select("*")

# # #             if start_date:
# # #                 query = query.gte("date", start_date)
# # #             if end_date:
# # #                 query = query.lte("date", end_date)

# # #             attendance_response = query.execute()

# # #             # Fetch all students
# # #             students_response = supabase.table("users").select("email, name").execute()

# # #             self.attendance_data = attendance_response.data
# # #             self.students_data = students_response.data

# # #             return True
# # #         except Exception as e:
# # #             print(f"Error fetching data: {str(e)}")
# # #             return False

# # #     def get_student_attendance_summary(self) -> Dict:
# # #         """
# # #         Generate a summary of attendance for each student
# # #         """
# # #         if not self.attendance_data or not self.students_data:
# # #             return {}

# # #         summary = {}

# # #         for student in self.students_data:
# # #             email = student['email']
# # #             name = student.get('name', email)

# # #             # Initialize student summary
# # #             student_records = [
# # #                 record for record in self.attendance_data
# # #                 if record['student_email'] == email
# # #             ]

# # #             # Count only valid sessions (where attendance was taken)
# # #             valid_morning_sessions = sum(
# # #                 1 for record in student_records
# # #                 if record.get('morning_session') in ['present', 'absent']
# # #             )
# # #             valid_afternoon_sessions = sum(
# # #                 1 for record in student_records
# # #                 if record.get('afternoon_session') in ['present', 'absent']
# # #             )

# # #             total_sessions = valid_morning_sessions + valid_afternoon_sessions
# # #             present_count = sum(
# # #                 1 for record in student_records
# # #                 if record.get('morning_session') == 'present'
# # #             ) + sum(
# # #                 1 for record in student_records
# # #                 if record.get('afternoon_session') == 'present'
# # #             )

# # #             absent_count = total_sessions - present_count

# # #             attendance_percentage = (present_count / total_sessions * 100) if total_sessions > 0 else 0

# # #             summary[email] = {
# # #                 'name': name,
# # #                 'total_sessions': total_sessions,
# # #                 'present_count': present_count,
# # #                 'absent_count': absent_count,
# # #                 'attendance_percentage': round(attendance_percentage, 2),
# # #                 'daily_records': []
# # #             }

# # #             # Add daily attendance details
# # #             for record in student_records:
# # #                 date = record['date']
# # #                 morning = record.get('morning_session', 'NA')
# # #                 afternoon = record.get('afternoon_session', 'NA')

# # #                 summary[email]['daily_records'].append({
# # #                     'date': date,
# # #                     'morning_session': morning,
# # #                     'afternoon_session': afternoon
# # #                 })

# # #         return summary

# # #     def get_date_wise_attendance(self) -> Dict:
# # #         """
# # #         Generate a summary of attendance for each date
# # #         """
# # #         if not self.attendance_data:
# # #             return {}

# # #         date_summary = {}

# # #         for record in self.attendance_data:
# # #             date = record['date']

# # #             if date not in date_summary:
# # #                 date_summary[date] = {
# # #                     'morning': {'present': 0, 'absent': 0, 'NA': 0},
# # #                     'afternoon': {'present': 0, 'absent': 0, 'NA': 0},
# # #                     'students': []
# # #                 }

# # #             # Count morning session
# # #             morning_status = record.get('morning_session')
# # #             morning_status = morning_status if morning_status in ['present', 'absent'] else 'NA'
# # #             date_summary[date]['morning'][morning_status] += 1

# # #             # Count afternoon session
# # #             afternoon_status = record.get('afternoon_session')
# # #             afternoon_status = afternoon_status if afternoon_status in ['present', 'absent'] else 'NA'
# # #             date_summary[date]['afternoon'][afternoon_status] += 1

# # #             # Add student detail
# # #             date_summary[date]['students'].append({
# # #                 'email': record['student_email'],
# # #                 'name': record.get('student_name', record['student_email']),
# # #                 'morning': morning_status,
# # #                 'afternoon': afternoon_status
# # #             })

# # #         return date_summary

# # #     def export_to_excel(self, filename: str = 'attendance_report.xlsx'):
# # #         """
# # #         Export attendance data to Excel with multiple sheets
# # #         """
# # #         try:
# # #             with pd.ExcelWriter(filename, engine='xlsxwriter') as writer:
# # #                 # Student-wise summary
# # #                 student_summary = self.get_student_attendance_summary()
# # #                 summary_data = []
# # #                 daily_records = []

# # #                 for email, data in student_summary.items():
# # #                     summary_data.append({
# # #                         'Email': email,
# # #                         'Name': data['name'],
# # #                         'Total Sessions': data['total_sessions'],
# # #                         'Present Count': data['present_count'],
# # #                         'Absent Count': data['absent_count'],
# # #                         'Attendance %': data['attendance_percentage']
# # #                     })

# # #                     for record in data['daily_records']:
# # #                         daily_records.append({
# # #                             'Email': email,
# # #                             'Name': data['name'],
# # #                             'Date': record['date'],
# # #                             'Morning Session': record['morning_session'],
# # #                             'Afternoon Session': record['afternoon_session']
# # #                         })

# # #                 # Create DataFrames
# # #                 summary_df = pd.DataFrame(summary_data)
# # #                 daily_df = pd.DataFrame(daily_records)

# # #                 # Write to Excel
# # #                 summary_df.to_excel(writer, sheet_name='Student Summary', index=False)
# # #                 daily_df.to_excel(writer, sheet_name='Daily Records', index=False)

# # #                 # Date-wise summary
# # #                 date_summary = self.get_date_wise_attendance()
# # #                 date_data = []

# # #                 for date, data in date_summary.items():
# # #                     date_data.append({
# # #                         'Date': date,
# # #                         'Morning Present': data['morning']['present'],
# # #                         'Morning Absent': data['morning']['absent'],
# # #                         'Morning NA': data['morning']['NA'],
# # #                         'Afternoon Present': data['afternoon']['present'],
# # #                         'Afternoon Absent': data['afternoon']['absent'],
# # #                         'Afternoon NA': data['afternoon']['NA']
# # #                     })

# # #                 date_df = pd.DataFrame(date_data)
# # #                 date_df.to_excel(writer, sheet_name='Date Summary', index=False)

# # #                 return True
# # #         except Exception as e:
# # #             print(f"Error exporting to Excel: {str(e)}")
# # #             return False

# # # # Example usage
# # # if __name__ == "__main__":
# # #     analyzer = AttendanceAnalyzer()

# # #     # Fetch data for a specific date range
# # #     start_date = "2025-01-13"  # Example start date
# # #     end_date = "2025-01-27"    # Example end date

# # #     if analyzer.fetch_data(start_date, end_date):
# # #         # Get student-wise summary
# # #         student_summary = analyzer.get_student_attendance_summary()
# # #         for email, data in student_summary.items():
# # #             print(f"\nStudent: {data['name']} ({email})")
# # #             print(f"Attendance: {data['attendance_percentage']}%")
# # #             print(f"Present: {data['present_count']}/{data['total_sessions']}")

# # #         # Get date-wise summary
# # #         date_summary = analyzer.get_date_wise_attendance()
# # #         for date, data in date_summary.items():
# # #             print(f"\nDate: {date}")
# # #             print(f"Morning - Present: {data['morning']['present']}, "
# # #                   f"Absent: {data['morning']['absent']}")
# # #             print(f"Afternoon - Present: {data['afternoon']['present']}, "
# # #                   f"Absent: {data['afternoon']['absent']}")

# # #         # Export to Excel
# # #         analyzer.export_to_excel('attendance_report.xlsx')

# import os
# from supabase import create_client, Client
# import pandas as pd
# import os
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # Supabase configuration
# SUPABASE_URL = os.getenv('SUPABASE_URL')
# SUPABASE_KEY = os.getenv('SUPABASE_KEY')
# # Initialize Supabase client
# def initialize_supabase(url: str, key: str) -> Client:
#     return create_client(url, key)

# # Fetch attendance data for all students
# def fetch_attendance_data(supabase: Client):
#     response = supabase.table('attendance').select('*').execute()
#     return response['data']

# # Calculate daily average and total percentage
# def calculate_attendance(attendance_data):
#     # Convert the attendance data to a pandas DataFrame
#     df = pd.DataFrame(attendance_data)

#     # Make sure the columns are in the correct format
#     df['date'] = pd.to_datetime(df['date'])

#     # Pivot the table so that we have separate columns for morning and afternoon sessions
#     df_pivoted = df.pivot_table(index=['student_name', 'date'], columns='session', values='status', aggfunc='first')

#     # Calculate the daily average for each student (1 for present, 0 for absent)
#     df_pivoted['daily_average'] = df_pivoted.mean(axis=1)

#     # Group by student and calculate the total percentage
#     student_totals = df_pivoted.groupby('student_name').agg(
#         total_present=pd.NamedAgg(column='daily_average', aggfunc='sum'),
#         total_days=pd.NamedAgg(column='daily_average', aggfunc='count')
#     )

#     # Calculate the percentage for each student
#     student_totals['percentage'] = (student_totals['total_present'] / student_totals['total_days']) * 100

#     return df_pivoted, student_totals

# # Function to display attendance report
# def display_report(daily_attendance, total_percentages):
#     print("\nDaily Attendance (Morning & Afternoon Sessions):")
#     print(daily_attendance)
#     print("\nTotal Percentage for Each Student:")
#     print(total_percentages)

# if __name__ == "__main__":
#     # Initialize Supabase client
#     supabase = initialize_supabase(SUPABASE_URL, SUPABASE_KEY)

#     # Fetch attendance data from Supabase
#     attendance_data = fetch_attendance_data(supabase)

#     # Calculate daily average and total percentage
#     daily_attendance, total_percentages = calculate_attendance(attendance_data)

#     # Display the attendance report
#     display_report(daily_attendance, total_percentages)
from supabase import create_client
import pandas as pd
from datetime import datetime
import numpy as np

# Initialize Supabase client
SUPABASE_URL = "https://qqeanlpfsgowrbzukhie.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZWFubHBmc2dvd3JienVraGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5NzI3ODUsImV4cCI6MjAzNDU0ODc4NX0.qC1V67KzK6iCRh1CuuKkZSS4PbBYtBiMZ0SAY7AKQ-c"

class DetailedAttendanceReport:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.attendance_data = None
        self.students_data = None

    def fetch_data(self, start_date=None, end_date=None):
        """Fetch attendance and student data from Supabase"""
        try:
            # Fetch attendance data with date range filter if provided
            query = self.supabase.table("attendance").select("*")
            if start_date:
                query = query.gte("date", start_date)
            if end_date:
                query = query.lte("date", end_date)
            attendance_response = query.execute()

            # Fetch student data
            students_response = self.supabase.table("users").select("email, name").execute()

            self.attendance_data = attendance_response.data
            self.students_data = students_response.data

            return True
        except Exception as e:
            print(f"Error fetching data: {str(e)}")
            return False

    def create_attendance_matrix(self):
        """Create a detailed attendance matrix"""
        if not self.attendance_data or not self.students_data:
            return None

        # Create a dictionary of student names keyed by email
        student_names = {student['email']: student.get('name', student['email'])
                        for student in self.students_data}

        # Get all unique dates
        dates = sorted(list(set(record['date'] for record in self.attendance_data)))

        # Initialize the data structure for our DataFrame
        data = []

        # Process each student's attendance
        for student_email, student_name in student_names.items():
            student_records = {
                'Student Name': student_name,
            }

            # Initialize counters for overall attendance
            total_present = 0
            total_sessions = 0

            # Process each date
            for date in dates:
                # Find the record for this student on this date
                record = next((r for r in self.attendance_data
                             if r['student_email'] == student_email and r['date'] == date), None)

                if record:
                    # Morning session
                    morning = record.get('morning_session')
                    if morning in ['present', 'absent']:
                        student_records[f"{date} (Morning)"] = morning
                        total_sessions += 1
                        if morning == 'present':
                            total_present += 1
                    else:
                        student_records[f"{date} (Morning)"] = 'NA'

                    # Afternoon session
                    afternoon = record.get('afternoon_session')
                    if afternoon in ['present', 'absent']:
                        student_records[f"{date} (Afternoon)"] = afternoon
                        total_sessions += 1
                        if afternoon == 'present':
                            total_present += 1
                    else:
                        student_records[f"{date} (Afternoon)"] = 'NA'
                else:
                    student_records[f"{date} (Morning)"] = 'NA'
                    student_records[f"{date} (Afternoon)"] = 'NA'

            # Calculate overall attendance percentage
            attendance_percentage = (total_present / total_sessions * 100) if total_sessions > 0 else 0
            student_records['Overall Attendance %'] = f"{attendance_percentage:.2f}%"

            data.append(student_records)

        # Create DataFrame
        df = pd.DataFrame(data)

        # Calculate daily averages
        for date in dates:
            # Morning average
            morning_col = f"{date} (Morning)"
            morning_present = (df[morning_col] == 'present').sum()
            morning_total = df[morning_col].isin(['present', 'absent']).sum()
            morning_avg = (morning_present / morning_total * 100) if morning_total > 0 else 0

            # Afternoon average
            afternoon_col = f"{date} (Afternoon)"
            afternoon_present = (df[afternoon_col] == 'present').sum()
            afternoon_total = df[afternoon_col].isin(['present', 'absent']).sum()
            afternoon_avg = (afternoon_present / afternoon_total * 100) if afternoon_total > 0 else 0

            # Add daily averages row
            df.loc['Daily Average', morning_col] = f"{morning_avg:.2f}%"
            df.loc['Daily Average', afternoon_col] = f"{afternoon_avg:.2f}%"

        return df

    def generate_report(self, output_file='attendance_report.xlsx'):
        """Generate and save the attendance report"""
        try:
            print("Starting report generation...")
            print("Creating attendance matrix...")
            # Create attendance matrix
            df = self.create_attendance_matrix()
            if df is None:
                return False

            # Create Excel writer
            with pd.ExcelWriter(output_file, engine='xlsxwriter') as writer:
                # Write the DataFrame to Excel without index
                df.to_excel(writer, sheet_name='Detailed Attendance', index=False)

                # Get the workbook and worksheet objects
                workbook = writer.book
                worksheet = writer.sheets['Detailed Attendance']

                # Define formats
                header_format = workbook.add_format({
                    'bold': True,
                    'bg_color': '#366092',
                    'font_color': 'white',
                    'border': 1
                })

                present_format = workbook.add_format({
                    'bg_color': '#C6EFCE',
                    'font_color': '#006100'
                })

                absent_format = workbook.add_format({
                    'bg_color': '#FFC7CE',
                    'font_color': '#9C0006'
                })

                na_format = workbook.add_format({
                    'bg_color': '#FFEB9C',
                    'font_color': '#9C6500'
                })

                percentage_format = workbook.add_format({
                    'num_format': '0.00%',
                    'bg_color': '#B8CCE4'
                })

                # Apply formats
                for col_num, value in enumerate(df.columns.values):
                    worksheet.write(0, col_num, value, header_format)

                # Set column widths
                worksheet.set_column(0, 0, 30)  # Student Name column
                worksheet.set_column(1, len(df.columns), 15)  # Date columns

                # Apply conditional formatting
                for row in range(len(df)):
                    for col in range(len(df.columns)):
                        cell_value = df.iloc[row, col]
                        if isinstance(cell_value, str):
                            if cell_value.lower() == 'present':
                                worksheet.write(row + 1, col, cell_value, present_format)
                            elif cell_value.lower() == 'absent':
                                worksheet.write(row + 1, col, cell_value, absent_format)
                            elif cell_value.upper() == 'NA':
                                worksheet.write(row + 1, col, cell_value, na_format)
                            elif '%' in cell_value:
                                try:
                                    percentage_value = float(cell_value.strip('%'))/100
                                    worksheet.write(row + 1, col, percentage_value, percentage_format)
                                except ValueError:
                                    worksheet.write(row + 1, col, cell_value)

            return True

        except Exception as e:
            print(f"Error generating report: {str(e)}")
            return False

# Example usage
if __name__ == "__main__":
    report = DetailedAttendanceReport()

    # Fetch data for specific date range
    start_date = "2025-01-13"
    end_date = "2025-01-27"

    if report.fetch_data(start_date, end_date):
        if report.generate_report('attendanceReport-PlacementTraining.xlsx'):
            print("Report generated successfully!")
        else:
            print("Error generating report")
    else:
        print("Error fetching data")