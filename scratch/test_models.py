import sys, os
sys.path.insert(0, 'apps/ai-service')
from dotenv import load_dotenv
load_dotenv('apps/ai-service/.env')
from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
test_models = [
    'gemini-2.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.8-flash',
]

for m in test_models:
    print(f"Testing {m}...", flush=True)
    try:
        res = client.models.generate_content(
            model=m,
            contents='Return JSON array: [{"test": 1}]',
            config=types.GenerateContentConfig(response_mime_type='application/json')
        )
        print(f"SUCCESS: {m} -> {res.text.strip()}", flush=True)
    except Exception as e:
        print(f"FAIL {m}: {type(e).__name__} - {e}", flush=True)
