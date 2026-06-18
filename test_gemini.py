import os
from dotenv import load_dotenv
load_dotenv(dotenv_path="creditflow-ai/.env")

print("Checking API key...")
api_key = os.environ.get("GEMINI_API_KEY")
print("Key starts with:", api_key[:10] if api_key else "None")

try:
    import google.generativeai as genai
    genai.configure(api_key=api_key)
    print("Listing models with google-generativeai:")
    for m in genai.list_models():
        print(m.name)
except Exception as e:
    print("Error listing models:", e)
