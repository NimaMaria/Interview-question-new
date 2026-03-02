import React from "react";

export default function UploadCard({ file, onPickFile, onGenerate, loading, error }) {
  return (
    <section className="card">
      <div
        className="uploadBox"
        onClick={onPickFile}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onPickFile();
        }}
      >
        <div className="uploadIcon" aria-hidden="true">☁️</div>

        <h2 className="uploadTitle">Upload Your Resume</h2>
        <p className="uploadHint">Drag and drop your PDF file here, or click to browse</p>
        <p className="uploadSubHint">
          {file
            ? `Selected: ${file.name}`
            : "For best results, use a text-based PDF resume (not scanned images)."}
        </p>

        <button
          type="button"
          className="btn btnSecondary"
          onClick={(e) => {
            e.stopPropagation();
            onPickFile();
          }}
          disabled={loading}
        >
          Choose File
        </button>
      </div>

      {error ? <div className="error">{error}</div> : null}

      <button
        className="btn btnPrimary"
        onClick={onGenerate}
        disabled={loading || !file}
      >
        {loading ? "Generating..." : "⚡ Generate Interview Questions"}
      </button>

      {loading ? <div className="spinner" /> : null}
    </section>
  );
}