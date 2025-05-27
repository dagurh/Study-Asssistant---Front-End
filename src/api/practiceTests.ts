const API_URL = import.meta.env.VITE_API_URL;

export async function fetchPracticeTests(token: string, courseCode: string) {
  const response = await fetch(`${API_URL}/practicetests/?course=${courseCode}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  // Assume data is always an array, or fall back to []
  console.log("Fetched practice tests:", data);
  return Array.isArray(data) ? data : [];
}