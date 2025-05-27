import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchCourses, createCourse } from "../api/courses";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Course = {
  _id: string;
  type: "course";
  course: string;
  title: string;
  description: string;
  credits: number;
  user: string;
};


export default function Courses() {
  const { token, mode } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (mode !== "user" || !token) return;
    setLoading(true);
    fetchCourses(token)
      .then(data => {
        console.log("Courses from API: ", data);
        setCourses(data.courses);
      })
      .catch(() => setError("Failed to load courses"))
      .finally(() => setLoading(false));
  }, [token, mode]);

  //TODOTODODODODODODDODOODODODODODOOD
  async function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);
    try {
      const newCourse = await createCourse(token!, {
        type: "course",
        course: courseCode,
        title,
        description,
        credits,
      });
      setCourses(prev => [...prev, newCourse]);
      setCourseCode("");
      setTitle("");
      setDescription("");
      setCredits(0);
      setOpen(false);
    } catch (err) {
      setCreateError("Failed to create course.");
    }
    setCreating(false);
  }

  if (mode !== "user") {
    return (
      <div className="p-8">
        <p>Please log in to view your courses.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">Courses</h2>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && courses.length === 0 && <p>No courses found.</p>}
      <ul className="space-y-2">
        {courses.map(course => (
          <li key={course._id} className="p-2 border rounded">
            <Link to={`/courses/${course._id}`} state={{ course }} className="font-semibold hover:underline">
              {course.title} ({course.course})
            </Link>
            <div className="text-sm text-gray-600">{course.description}</div>
            <div className="text-xs text-gray-500">Credits: {course.credits}</div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button onClick={() => setOpen(true)}>Create New Course</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">Create a new course</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="text-sm text-gray-600 mb-1">Course Code</div>
              <Input
                type="text"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                required
              />
              <div className="text-sm text-gray-600 mb-1">Course Title</div>
              <Input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
              <div className="text-sm text-gray-600 mb-1">Description</div>
              <Input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
              <div className="text-sm text-gray-600 mb-1">Credits</div>
              <Input
                type="number"
                value={credits}
                onChange={e => setCredits(Number(e.target.value))}
                required
              />
              {createError && <div className="text-red-500 text-sm">{createError}</div>}
              <DialogFooter>
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Course"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
