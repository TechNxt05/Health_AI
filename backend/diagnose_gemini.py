
import google.generativeai as genai
import os
from dotenv import load_dotenv
import time

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

FALLBACK_MODELS = ["gemini-pro", "gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.0-pro"]

print(f"--- DIAGNOSTIC START ---")
if not api_key:
    print("❌ GOOGLE_API_KEY not found!")
else:
    genai.configure(api_key=api_key)
    print(f"🔑 API Key configured: {api_key[:5]}...")

    print("\n[Testing Fallback Sequence]")
    
    success = False
    for model_name in FALLBACK_MODELS:
        print(f"\n👉 Testing Model: {model_name}")
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hello, this is a test.")
            
            if response and response.text:
                print(f"   ✅ SUCCESS! Response: {response.text.strip()[:50]}...")
                success = True
                break
            else:
                 print(f"   ⚠️ Generation empty.")
        except Exception as e:
            print(f"   ❌ FAILED: {e}")
            
    if not success:
        print("\n❌ ALL MODELS FAILED. Critical Issue.")
    else:
        print("\n✅ At least one model is working.")

print(f"\n--- DIAGNOSTIC END ---")
