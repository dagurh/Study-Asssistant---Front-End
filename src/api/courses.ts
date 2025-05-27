export async function fetchCourses(token: string) {
  const API_URL = import.meta.env.VITE_API_URL; // Use your .env!
  const response = await fetch(`${API_URL}/courses/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json(); // Should return array of courses
}

export async function createCourse(
  token: string,
  data: {
    type: "course";
    course: string;
    title: string;
    description: string;
    credits: number;
  }
) {
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create course");
  }
  return response.json();
}

