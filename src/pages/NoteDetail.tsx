import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchNotes } from "@/api/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateNote } from "@/api/notes";
import { useQueryClient } from "@tanstack/react-query";

type Note = {
  _id: string;
  type: "note";
  title: string;
  course: string;
  chapter: number;
  text: string;
  user: string;
};

export default function NoteDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const passedNote = location.state?.note as Note | undefined;
  const passedCourse = location.state?.course as { title: string } | undefined;
  const [note, setNote] = useState<Note | null>(passedNote ?? null);
  const [loading, setLoading] = useState(!passedNote);

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(note?.title || "");
  const [editChapter, setEditChapter] = useState(note?.chapter || "");
  const [editText, setEditText] = useState(note?.text || "");

  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note || !id || !token) return;
    setLoading(true);

    fetchNotes(token, "")
      .then(notesArr => {
        const found = notesArr.find((n: Note) => n._id === id);
        setNote(found || null);
      })
      .finally(() => setLoading(false));
  }, [id, note, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!note) return <div className="p-8 text-red-600">Note not found.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      { passedCourse && (
        <div className="mb-4 text-gray-600">
          <b>{passedCourse.title}</b>
        </div>
      )}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>
      {!editMode && (
        <>
        <h2 className="text-2xl font-bold mb-2 ml-1 text-left">{note.title}</h2>
        <div className="text-gray-500 mb-3 ml-1 text-left">Chapter: {note.chapter}</div>
        <div className="bg-gray-50 rounded p-4 whitespace-pre-line text-left">
          {note.text}
        </div>
        <Button className="mt-4 flex ml-1" onClick={() => {
          setEditMode(true);
          setEditTitle(note.title);
          setEditChapter(note.chapter?.toString() ?? "");
          setEditText(note.text);
        }}>
          Edit Note
        </Button>
        </>
      )}
      {editMode && (
        <form
          className="flex flex-col gap-4 mt-6"
          onSubmit={async e => {
            e.preventDefault();
            setSaving(true);
            setEditError(null);
            try {
              await updateNote(token!, note._id, {
                title: editTitle,
                chapter: parseInt(editChapter.toString(), 10),
                text: editText,
              });
              setEditMode(false);
              queryClient.invalidateQueries({ queryKey: ["notes", note.course] });
              setNote({
                ...note,
                title: editTitle,
                chapter: parseInt(editChapter.toString(), 10),
                text: editText,
              });
            } catch (err) {
              setEditError("Failed to save changes. Please try again.");
            }
            setSaving(false);
          }}
        >
          <Input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="Note title"
            required
          />
          <Input
            value={editChapter}
            onChange={e => setEditChapter(e.target.value)}
            placeholder="Chapter number"
            required
          />
          <Textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            placeholder="Write your note here..."
            required
            className="w-full min-h-[350px] max-w-full overflow-x-auto"
            style= {{ resize: "vertical", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
          />
          {editError && <div className="text-red-500 text-sm">{editError}</div>}
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditMode(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
