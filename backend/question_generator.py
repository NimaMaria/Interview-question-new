import json
import os
from llm.groq_client import GroqClient
from rag.retrieve import retrieve

def generate_interview_questions(resume_text):
    """
    Generates interview questions based on the resume and RAG context using Groq LLM.
    """
    # 1. Retrieve relevant interview patterns/questions from dataset based on resume
    rag_context = retrieve(resume_text, k=6)
    context_text = "\n\n".join([r['text'] for r in rag_context])

    # 2. Setup prompt and LLM call
    client = GroqClient()

    system_prompt = """
    You are an expert technical interviewer. You generate high-quality, resume-specific interview questions.
    
    RULES:
    - ALWAYS return a valid JSON object.
    - Questions MUST be based STRICTLY on the provided resume.
    - If a technology is mentioned, ask questions about its concepts and application.
    - If projects/experience are mentioned, ask about implementation details, challenges, and results.
    - For metrics/claims, ask for baseline (before), measurement (how it was calculated), and proof (evidence).
    - Organize questions into 5 sessions:
      1. projects (Project-specific deep dives)
      2. experience (Past roles/responsibilities)
      3. technical (Skills/tech stack verification)
      4. verification (Deep-dive into claims/numbers)
      5. behavioral (Personality/soft skills in context of their history)
    - Each session must contain 3 difficulties: easy, medium, hard.
    """

    user_prompt = f"""
    CONTEXT FROM INTERVIEW DATASET (Use for style and patterns only):
    {context_text}

    USER RESUME TEXT:
    {resume_text}

    GENERATE QUESTIONS NOW. Return ONLY a valid JSON object with this exact structure. Each question must be a plain STRING, not an object. Example:
    {{
      "session_1_projects": {{"easy": ["What was the main objective of this project?", "Describe the technology stack"], "medium": ["..."], "hard": ["..."]}},
      "session_2_experience": {{"easy": [], "medium": [], "hard": []}},
      "session_3_technical": {{"easy": [], "medium": [], "hard": []}},
      "session_4_verification": {{"easy": [], "medium": [], "hard": []}},
      "session_5_behavioral": {{"easy": [], "medium": [], "hard": []}}
    }}
    """

    response = client.generate(user_prompt, system_prompt)
    if response:
        try:
            return json.loads(response)
        except:
            return {"error": "Failed to parse JSON response from LLM"}
    return {"error": "LLM generation failed"}
