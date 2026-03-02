import React, { useState } from 'react';

const API_BASE = "http://127.0.0.1:5000";

function App() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const uploadResume = async () => {
    if (!file) return setError("Please select a PDF file first.");
    
    setLoading(true);
    setResults(null);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch(`${API_BASE}/api/upload-resume`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResumeText(data.text);
    } catch (err) {
      setError(err.message || "Failed to upload resume.");
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = async () => {
    if (!resumeText) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: resumeText }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const renderQuestions = (sessionKey, title) => {
    const session = results[sessionKey];
    if (!session) return null;

    return (
      <div className="session-card" key={sessionKey}>
        <h2 className="session-title">{title}</h2>
        {['easy', 'medium', 'hard'].map((diff) => (
          session[diff] && session[diff].length > 0 && (
            <div className="difficulty-group" key={diff}>
              <span className={`difficulty-label ${diff}`}>{diff}</span>
              {session[diff].map((q, i) => (
                <div className="question-item" key={i}>{q}</div>
              ))}
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <header>
        <h1>AI Interview Coach</h1>
        <p>Upload your resume to generate relevant interview questions</p>
      </header>

      {error && <div className="error-msg">{error}</div>}

      <section className="upload-section">
        <div className="file-input-wrapper" onClick={() => document.getElementById('fileInput').click()}>
          <input 
            type="file" 
            id="fileInput" 
            hidden 
            accept=".pdf" 
            onChange={handleFileChange} 
          />
          <p>{file ? file.name : "Click to select or drag & drop Resume PDF"}</p>
        </div>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button className="btn" onClick={uploadResume} disabled={loading || !file}>
            Extract Resume Text
          </button>
          {resumeText && (
            <button className="btn" onClick={generateQuestions} disabled={loading}>
              {loading ? "Generating..." : "Generate Interview Questions"}
            </button>
          )}
        </div>

        {resumeText && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Resume Preview</h3>
            <div className="preview-box">{resumeText}</div>
          </div>
        )}
      </section>

      {loading && <div className="loading-spinner"></div>}

      {results && (
        <section className="results-section">
          {renderQuestions("session_1_projects", "Projects Session")}
          {renderQuestions("session_2_experience", "Experience Session")}
          {renderQuestions("session_3_technical", "Technical Session")}
          {renderQuestions("session_4_verification", "Verification Session")}
          {renderQuestions("session_5_behavioral", "Behavioral Session")}
        </section>
      )}
    </div>
  );
}

export default App;
