import os
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"), override=True)
key = os.getenv("GROQ_API_KEY", "").strip()

print("Loaded:", bool(key), "len:", len(key), "start:", key[:4], "end:", key[-4:])

r = requests.get(
    "https://api.groq.com/openai/v1/models",
    headers={"Authorization": f"Bearer {key}"}
)

print("Status:", r.status_code)
print("Body:", r.text[:400])