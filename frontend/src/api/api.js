const API_BASE = "http://127.0.0.1:5000";

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_BASE}/api/upload-resume`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || data?.error) {
    throw new Error(data?.error || "Failed to upload resume.");
  }

  if (!data?.text) {
    throw new Error("No text extracted from resume. Please upload a text-based PDF (not scanned).");
  }

  return data.text;
}

export async function generateQuestions(resumeText) {
  const res = await fetch(`${API_BASE}/api/generate-questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text: resumeText }),
  });

  const data = await res.json();
  if (!res.ok || data?.error) {
    throw new Error(data?.error || "Failed to generate questions.");
  }

  return data;
}