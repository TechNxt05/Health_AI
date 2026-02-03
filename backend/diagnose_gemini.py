
import google.generativeai as genai
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import sys

# Explicitly load from the .env file we just saw
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
mongo_uri = os.getenv("MONGO_URI")

print(f"--- DIAGNOSTIC START ---")

# 1. Check MongoDB
print(f"\n[1/2] Checking MongoDB Connection...")
if not mongo_uri:
    print("❌ MONGO_URI not found in environment!")
else:
    try:
        client = MongoClient(mongo_uri)
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
        print("✅ MongoDB Connection Successful!")
        # Optional: List database names to confirm access
        dbs = client.list_database_names()
        print(f"   Databases found: {dbs}")
    except Exception as e:
        print(f"❌ MongoDB Connection Failed: {e}")

# 2. Check Gemini Models
print(f"\n[2/2] Checking Google Gemini Models...")
if not api_key:
    print("❌ GOOGLE_API_KEY not found in environment!")
else:
    try:
        genai.configure(api_key=api_key)
        print(f"   Using API Key: {api_key[:5]}...{api_key[-5:]}")
        
        print("   Listing Available Models:")
        available_models = []
        for m in genai.list_models():
            # We care about generateContent methods
            if 'generateContent' in m.supported_generation_methods:
                print(f"   - {m.name}")
                available_models.append(m.name)
        
        if not available_models:
            print("   ⚠️ No models found with 'generateContent' capability.")
        else:
            print(f"   ✅ Found {len(available_models)} usable models.")
            
        # Try a test generation with the first likely candidate
        candidates = ["models/gemini-1.5-flash", "models/gemini-pro", "models/gemini-1.5-flash-001", "models/gemini-1.0-pro"]
        test_model_name = None
        
        # Find the first candidate that exists in available_models
        for cand in candidates:
            if cand in available_models:
                test_model_name = cand
                break
        
        # If none of our candidates match exactly, just pick the first available one
        if not test_model_name and available_models:
            test_model_name = available_models[0]
            
        if test_model_name:
            print(f"\n   Testing generation with: {test_model_name}")
            try:
                model = genai.GenerativeModel(test_model_name)
                response = model.generate_content("Hello, satisfy my check.")
                if response.text:
                    print(f"   ✅ Test generation successful! Response: {response.text.strip()}")
                else:
                    print("   ⚠️ Generation returned empty text.")
            except Exception as ge:
                print(f"   ❌ Test generation failed: {ge}")
        else:
            print("   ❌ Could not select a model to test.")

    except Exception as e:
        print(f"❌ Gemini Configuration/Listing Failed: {e}")

print(f"\n--- DIAGNOSTIC END ---")
