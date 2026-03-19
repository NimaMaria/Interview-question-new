import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

function SessionCard({ title, session }) {
  if (!session) return null;

  const diffs = ["easy", "medium", "hard"];

  return (
    <div className="sessionCard">
      <h3 className="sessionTitle">{title}</h3>

      {diffs.map((diff) => {
        const items = session?.[diff];
        if (!items || items.length === 0) return null;

        return (
          <div className="diffBlock" key={diff}>
            <span className={`diffPill ${diff}`}>{diff}</span>
            <div className="questionsList">
              {items.map((q, i) => (
                <div className="questionItem" key={i}>
                  {q}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function GeneratedQuestions({ results, file }) {
  const contentRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!contentRef.current) return;
    setIsDownloading(true);
    const opt = {
      margin: 0.5,
      filename: 'Interview_Questions.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(contentRef.current).save().then(() => {
      setIsDownloading(false);
    });
  };

  return (
    <section className="card" style={{ marginTop: 18 }} ref={contentRef}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 className="sectionTitle" style={{ margin: 0 }}>Generated Questions</h2>
        {results && (
          <button
            className="btn btnPrimary"
            onClick={handleDownload}
            disabled={isDownloading}
            data-html2canvas-ignore="true"
            style={{ 
              padding: "8px 20px", 
              fontSize: "0.95rem", 
              width: "auto", 
              margin: 0, 
              borderRadius: "6px",
              boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
              fontWeight: "600",
              letterSpacing: "0.01em"
            }}
          >
            {isDownloading ? "Generating..." : "Download Report"}
          </button>
        )}
      </div>

      {results && file && (
        <div style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
           <h1 style={{ fontSize: "1.5rem", fontWeight: "800", margin: "0 0 4px 0", color: "var(--blue)" }}>Interview Questions Report</h1>
           <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.95rem" }}>Based on resume: <strong style={{color:"var(--text)"}}>{file.name}</strong></p>
        </div>
      )}

      {!results ? (
        <p className="muted">Your AI-generated interview questions will appear here.</p>
      ) : (
        <div className="sessionsGrid">
          <SessionCard title="Projects Session" session={results.session_1_projects} />
          <SessionCard title="Experience Session" session={results.session_2_experience} />
          <SessionCard title="Technical Session" session={results.session_3_technical} />
          <SessionCard title="Verification Session" session={results.session_4_verification} />
          <SessionCard title="Behavioral Session" session={results.session_5_behavioral} />
        </div>
      )}
    </section>
  );
}