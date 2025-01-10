from supabase import create_client, Client
import pandas as pd
SUPABASE_URL = "https://qqeanlpfsgowrbzukhie.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZWFubHBmc2dvd3JienVraGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5NzI3ODUsImV4cCI6MjAzNDU0ODc4NX0.qC1V67KzK6iCRh1CuuKkZSS4PbBYtBiMZ0SAY7AKQ-c"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
file_path = "E:\\leaderboards\\data\\pointsData.csv"
data = pd.read_csv(file_path)


rows = data.to_dict(orient="records")
for row in rows:
    print(f"Inserting row: {row}")
    response = supabase.table("users").insert(row).execute()
