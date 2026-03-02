# Resume-based Interview Question Generator

A full-stack application that extracts text from a resume PDF and generates session-wise, difficulty-wise interview questions using Groq LLM and FAISS RAG.

## Project Structure

- `backend/`: Flask API, RAG logic, and LLM orchestration.
- `frontend/`: React (Vite) user interface.

## Prerequisites

- Python 3.9+
- Node.js & npm
- [Groq API Key](https://console.groq.com/)

## Getting Started

### Backend Setup

1. **Create and Activate Virtual Environment:**
   ```bash
   cd backend
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Setup:**
   - Copy `.env.example` to `.env`.
   - Add your `GROQ_API_KEY`.
   - (Optional) Adjust model names.

4. **Data Preparation:**
   - Place your dataset PDF at `backend/data/resume_and_interview_pairs_dataset.pdf`.

5. **Run Ingestion:**
   ```bash
   python rag/ingest.py
   ```

6. **Start Flask Server:**
   ```bash
   python app.py
   ```
   *Server runs on `http://127.0.0.1:5000`*

### Frontend Setup

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   *Client runs on `http://localhost:5173`*

## Usage

1. Open the frontend in your browser.
2. Select a resume PDF and click **Extract Resume Text**.
3. Once extracted, click **Generate Interview Questions**.
4. View your tailored questions categorized by session and difficulty level.
