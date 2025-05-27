const API_URL = import.meta.env.VITE_API_URL;

export async function fetchSummaries(token: string, courseCode: string) {
  const response = await fetch(`${API_URL}/summaries/?course=${courseCode}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  // Assume data is always an array, or fall back to []
  console.log("Fetched summaries:", data.summaries);
  return Array.isArray(data.summaries) ? data.summaries : [];
}

export async function generateSummary(token: string, summary: {
  course: string;
  chapter: number;
}) {
  const response = await fetch(`${API_URL}/summaries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(summary),
  });
  if (!response.ok) throw new Error("Failed to create summary");
  return response.json();
}