from supabase import create_client
import pandas as pd
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    # Fetch data from Supabase
    # Replace 'your_table' with your actual table name
    # response = supabase.table('daily_activities') \
    #     .select('*') \
    #     .eq('date', '2025-01-16') \
    #     .execute()
    response = (
        supabase.table("daily_activities")
        .select("*")
        .eq("date", "2025-01-21")
        .execute()
    )

    # Convert the response data to a pandas DataFrame
    df = pd.DataFrame(response.data)

    # Define Excel file path
    excel_file = "21thDailyActivities.xlsx"

    # Write to Excel file
    df.to_excel(excel_file, index=False, sheet_name="Data")

    print(f"Data successfully exported to {excel_file}")
    print(f"Number of records exported: {len(df)}")

except Exception as e:
    print(f"An error occurred: {str(e)}")
