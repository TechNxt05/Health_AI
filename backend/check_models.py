import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                f.write(f"{m.name}\n")
    print("Models written to models_list.txt")
except Exception as e:
    print(f"Error listing models: {e}")
