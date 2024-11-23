from supabase import create_client, Client

import pandas as pd
SUPABASE_URL = "https://qqeanlpfsgowrbzukhie.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZWFubHBmc2dvd3JienVraGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5NzI3ODUsImV4cCI6MjAzNDU0ODc4NX0.qC1V67KzK6iCRh1CuuKkZSS4PbBYtBiMZ0SAY7AKQ-c"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

filePath = 'E:\\leaderboards\\data\\userData.xlsx'
df = pd.read_excel(filePath)


def create_user(email, password):
   response = supabase.auth.sign_up({"email": email, "password": password})



for index, row in df.iterrows():
    email = row['email']
    password = row['password']
    create_user(email, password)