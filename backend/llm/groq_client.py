import os
from groq import Groq
from dotenv import load_dotenv

# Load .env from backend directory (override=True to override existing env vars)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"), override=True)

class GroqClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY", "").strip()
        self.model_name = os.getenv("MODEL_NAME", "llama-3.1-8b-instant")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        # Explicitly avoiding proxies if they are causing the __init__ error
        self.client = Groq(api_key=self.api_key)

    def generate(self, prompt, system_prompt="You are a helpful interview assistant."):
        try:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2048,
                response_format={"type": "json_object"}
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            return None
