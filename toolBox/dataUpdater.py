from supabase import create_client, Client
import pandas as pd

SUPABASE_URL = "https://qqeanlpfsgowrbzukhie.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZWFubHBmc2dvd3JienVraGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5NzI3ODUsImV4cCI6MjAzNDU0ODc4NX0.qC1V67KzK6iCRh1CuuKkZSS4PbBYtBiMZ0SAY7AKQ-c"

def update_supabase_records(file_path):
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    data = pd.read_csv(file_path)
    rows = data.to_dict(orient="records")

    for row in rows:
        try:
            print(f"Updating record for: {row['name']}")
            response = (supabase.table("users")
                       .update(row)
                       .eq("name", row["name"])
                       .execute())
            print("Update successful")
        except Exception as e:
            print(f"Error updating {row['name']}: {str(e)}")

if __name__ == "__main__":
    file_path = "E:\\leaderboards\\futurense-leaderboards\\data\\pointsData.csv"
    update_supabase_records(file_path)