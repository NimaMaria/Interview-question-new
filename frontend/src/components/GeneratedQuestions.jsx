import React from "react";

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

export default function GeneratedQuestions({ results }) {
  return (
    <section className="card" style={{ marginTop: 18 }}>
      <h2 className="sectionTitle">Generated Questions</h2>

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