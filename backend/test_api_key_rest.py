
import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

print(f"--- REST API TEST ---")
if not api_key:
    print("❌ GOOGLE_API_KEY not found!")
    exit(1)

models_to_test = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-pro", "gemini-pro"]

for model in models_to_test:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{
            "parts": [{"text": "Hello"}]
        }]
    }

    try:
        print(f"\n👉 Testing {model}...")
        response = requests.post(url, headers=headers, json=data, timeout=10)
        
        if response.status_code == 200:
            print(f"   ✅ SUCCESS! {model} works.")
            print(f"   Response: {response.json().get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')[:20]}...")
            # If one works, that's great, but let's see which ones work.
        else:
            print(f"   ❌ FAILED. Status: {response.status_code}")
            # print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ EXCEPTION: {e}")

print(f"\n--- TEST END ---")
