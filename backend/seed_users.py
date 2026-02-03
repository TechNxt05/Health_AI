
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import bcrypt

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    print("❌ MONGO_URI not found!")
    exit(1)

client = MongoClient(mongo_uri)
db = client['mydb']
users_collection = db['users']

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

demo_patient = {
    "name": "Demo Patient",
    "email": "demo@patient.com",
    "password": hash_password("password123"), # Hashed
    "accountType": "HEALTHSEAKER"
}

demo_doctor = {
    "name": "Demo Doctor",
    "email": "demo@doctor.com",
    "password": hash_password("password123"),
    "accountType": "DOCTOR",
    "specialization": "General Physician",
    "experience": "10 years"
}

def seed():
    print("🌱 Seeding Demo Users...")
    
    # 1. Demo Patient
    if users_collection.find_one({"email": demo_patient["email"]}):
        print("   ⚠️ Demo Patient already exists.")
    else:
        users_collection.insert_one(demo_patient)
        print("   ✅ Demo Patient created.")

    
    # 2. Demo Doctor
    doctor_collection = db['doctor'] # Matches doctor_controller.py
    if doctor_collection.find_one({"email": demo_doctor["email"]}):
        print("   ⚠️ Demo Doctor already exists.")
    else:
        doctor_collection.insert_one(demo_doctor)
        print("   ✅ Demo Doctor created in 'doctor' collection.")
        
    print("🎉 Seeding Complete!")

if __name__ == "__main__":
    seed()
