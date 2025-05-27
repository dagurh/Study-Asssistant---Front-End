const API_URL = import.meta.env.VITE_API_URL;

export async function createNote(token: string, note: {
  title: string;
  course: string;
  chapter: number;
  text: string;
}) {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Failed to create note");
  return response.json();
}

export async function fetchNotes(token: string, courseCode: string) {
  const response = await fetch(`${API_URL}/notes/?course=${courseCode}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  // Assume data is always an array, or fall back to []
  return Array.isArray(data.notes) ? data.notes : [];
}

export async function updateNote(token: string, id: string, updates: {
  title: string;
  chapter: number;
  text: string;
}) {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update note");
  return true;
}
