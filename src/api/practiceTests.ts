const API_URL = import.meta.env.VITE_API_URL;

export async function fetchPracticeTests(token: string, courseCode: string) {
  const response = await fetch(`${API_URL}/practicetests/?course=${courseCode}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  // Assume data is always an array, or fall back to []
  console.log("Fetched practice tests:", data);
  return Array.isArray(data.practicetests) ? data.practicetests : [];
}

export async function generatePracticeTest(token: string, course: string, nrQs: string) {
  const response = await fetch(`${API_URL}/practicetests?num_questions=${nrQs}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ course })
  });
  
  if (!response.ok) throw new Error("Failed to create practice test");
  
  return response.json();
}