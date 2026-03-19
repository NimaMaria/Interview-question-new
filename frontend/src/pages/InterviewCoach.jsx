import React, { useRef, useState } from "react";
import UploadCard from "../components/UploadCard";
import GeneratedQuestions from "../components/GeneratedQuestions";
import { uploadResume, generateQuestions } from "../api/api";

export default function InterviewCoach() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setError("");
    setResults(null);
  };

  const onGenerate = async () => {
    if (!file) {
      setError("Please upload your resume (PDF) first.");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      // 1) Upload -> extract text
      const resumeText = await uploadResume(file);

      // 2) Generate questions
      const data = await generateQuestions(resumeText);

      setResults(data);
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <h1 className="heroTitle" style={{ color: "var(--blue)" }}>Generate Interview Questions</h1>
        <p className="heroSub">
          Upload your resume to get tailored interview questions based on your profile
        </p>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        hidden
        onChange={onFileChange}
      />

      <UploadCard
        file={file}
        onPickFile={onPickFile}
        onGenerate={onGenerate}
        loading={loading}
        error={error}
      />

      <GeneratedQuestions results={results} file={file} />
    </div>
  );
}