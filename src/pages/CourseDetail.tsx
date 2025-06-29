import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../context/AuthContext";
import { /*useEffect, */ useState } from "react";
import { createNote, fetchNotes } from "@/api/notes";
import { fetchSummaries, generateSummary } from "@/api/summaries";
import { fetchPracticeTests, generatePracticeTest } from "@/api/practiceTests";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PrettySummary } from "@/lib/prettifySummary";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { deleteItem } from "@/api/delete";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PrettifyTests } from "@/lib/prettifyTests";

type Course = {
  _id: string;
  type: "course";
  course: string;
  title: string;
  description: string;
  credits: number;
  user: string;
};

type Note = {
  _id: string;
  type: "note";
  title: string;
  course: string;
  chapter: number;
  text: string;
  user: string;
};

type PracticeTest = {
  _id: string;
  type: "practice_test";
  course: string;
  user: string;
  questions: object[];
};

type Summary = {
  _id: string;
  type: "summary";
  course: string;
  chapter: number;
  user: string;
  summary: object[];
};

function groupNotesByChapter(notes: Note[]): Record<string, Note[]> {
  return notes.reduce<Record<string, Note[]>>((acc, note) => {
    const chapter = note.chapter || "Uncategorized";
    if (!acc[chapter]) acc[chapter] = [];
    acc[chapter].push(note);
    return acc;
  }, {});
}

export default function CourseDetail() {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const passedCourse = location.state?.course as Course;

  const [course] = useState<Course>(passedCourse);
  const [tab, setTab] = useState("notes");
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  const [noteChapter, setNoteChapter] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [noteLoading, setNoteLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generateSummaryError, setGenerateSummaryError] = useState<string | null>(null);

  const [confirmDeleteTestOpen, setConfirmDeleteTestOpen] = useState(false);
  const [deletingTestId, setDeletingTestId] = useState<string | null>(null);
  const [deletingTest, setDeletingTest] = useState(false);
  const [deletingTestError, setDeletingTestError] = useState<string | null>(null);
  const [practiceTestDialogOpen, setPracticeTestDialogOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [generatingPracticeTest, setGeneratingPracticeTest] = useState(false);
  const [generatePracticeTestError, setGeneratePracticeTestError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deletingError, setDeletingError] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [selectedNumber, setSelectedNumber] = useState("5")



  const { 
    data: notes = [], 
    isLoading: notesLoading, 
    error: notesError, 
    refetch: refetchNotes 
  } = useQuery({
    queryKey: ["notes", course.course],
    queryFn: () => fetchNotes(token as string, course.course),
    enabled: !!token && !!course.course,
  });

  const { 
    data: summaries = [], 
    isLoading: summariesLoading, 
    error: summariesError, 
    refetch: refetchSummaries  
  } = useQuery({
    queryKey: ["summaries", course.course],
    queryFn: () => fetchSummaries(token as string, course.course),
    enabled: !!token && !!course.course,
  });

  const {
    data: practiceTests = [],
    isLoading: testsLoading,
    error: testsError,
    refetch: refetchTests,
  } = useQuery({
    queryKey: ["practiceTests", course.course],
    queryFn: () => fetchPracticeTests(token as string, course.course),
    enabled: !!token && !!course.course,
  });

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    setNoteError(null);
    setNoteLoading(true);

    try {
      await createNote(token!, {
        title: noteTitle,
        course: course.course,
        chapter: parseInt(noteChapter, 10),
        text: noteContent,
      });
      setNoteTitle("");
      setNoteChapter("");
      setNoteContent("");
      queryClient.invalidateQueries({ queryKey: ["notes", course.course] });
    } catch (err) {
      setNoteError("Failed to create note. Please try again.");
    }
    setNoteLoading(false);
  }

  const notesByChapter = groupNotesByChapter(notes);
  const chapterNumbers = Object.keys(notesByChapter).sort((a, b) => +a - +b);

  const selectedSummary = (summaries as Summary[]).find((s) => s._id === selectedId || null);
  const selectedPracticeTest = (practiceTests as PracticeTest[]).find(pt => pt._id === selectedTestId) || null;
  

  if (!course) return <div className="p-8 text-red-600">Course not found.</div>;

  console.log("Practice test object:", selectedPracticeTest);
  if (selectedPracticeTest) {
    console.log("Practice test questions:", selectedPracticeTest.questions);
  }


  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">{course.title} <span className="text-base text-gray-500">({course.course})</span></h2>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="summaries">Summaries</TabsTrigger>
          <TabsTrigger value="tests">Practice Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          {notesLoading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <div className="ml-4 text-gray-500">Loading notes...</div>
            </div>
          ) : notesError ? (
            <div className="text-red-600">
              Failed to load notes.
              <Button onClick={() => refetchNotes()} variant="outline" size="sm">Retry</Button>
            </div>
          ) : (
          <div className="flex w-full gap-8 min-h-[400px]">
            <div className="w-[75%] min-w-0">
              <h3 className="text-xl font-semibold mb-4">Create a Note</h3>
              <form onSubmit={handleCreateNote} className="flex flex-col gap-4 overflow-hidden">
                <Input
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  placeholder="Note title"
                  required
                />
                <Input
                  value={noteChapter}
                  onChange={e => setNoteChapter(e.target.value)}
                  placeholder="Note chapter"
                  required
                />
                <Textarea
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Write your note here..."
                  rows={18}
                  required
                  className="w-full min-h-[350px] max-w-full overflow-x-auto"
                  style= {{ resize: "vertical", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
                />
                {noteError && <div className="text-red-500 text-sm">{noteError}</div>}
                <Button type="submit" disabled={noteLoading} className="w-fit">
                  {noteLoading ? "Adding..." : "Create Note"}
                </Button>
              </form>
            </div>
            <aside className="w-1/5 flex flex-col gap-2">
              <h4 className="text-lg font-semibold">Your Notes</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  expandedChapters.length < chapterNumbers.length
                    ? setExpandedChapters(chapterNumbers)
                    : setExpandedChapters([])
                }
              >
                {expandedChapters.length < chapterNumbers.length ? "Expand All" : "Collapse All"}
              </Button>
              {chapterNumbers.length === 0 ? (
                <div className="text-gray-500">No notes yet</div>
              ) : (
                <Accordion type="multiple" className="w-full" value={expandedChapters} onValueChange={setExpandedChapters}>
                  {chapterNumbers.map(chapter => (
                    <AccordionItem key={chapter} value={chapter}>
                      <AccordionTrigger>Chapter {chapter}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {notesByChapter[chapter].map(note => (
                            <li 
                              key={note._id} 
                              onClick={() => navigate(`/notes/${note._id}`, { state: { note, course: { title: course.title} } })} 
                              className="p-1.5 bg-gray-100 rounded cursor-pointer hover:bg-blue-100"
                            >
                              <div className="font-semibold truncate">{note.title}</div>
                              {/* Add more note info here if you want */}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </aside>
          </div>
          )}
        </TabsContent>

        <TabsContent value="summaries">
          <div className="flex flex-col h-full">
            {/* Top bar with button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold ml-2">Summaries</h3>
              <Button variant="outline" onClick={() => setDialogOpen(true)}>
                Generate Summary
              </Button>
            </div>
            {/* Main content: left list, right details */}
            <div className="flex gap-6 min-h-[150px]">
              {/* Summaries list */}
              <aside className="w-[15%] self-start bg-gray-50 rounded-lg p-2 flex flex-col gap-1">
                {summariesLoading ? (
                  <div className="text-gray-400 p-4">Loading summaries...</div>
                ) : summariesError ? (
                  <div className="text-red-500 p-4">
                    Failed to load summaries.
                    <Button size="sm" variant="ghost" onClick={() => refetchSummaries()}>Retry</Button>
                  </div>
                ) : summaries.length === 0 ? (
                  <div className="text-gray-500 p-4">No summaries yet</div>
                ) : (
                  <ul>
                    {(summaries as Summary[])
                    .slice()
                    .sort((a, b) => a.chapter - b.chapter)
                    .map(summary => (
                      <li
                        key={summary._id}
                        className={`cursor-pointer rounded px-1 py-2 mb-1 transition text-sm
                          ${selectedId === summary._id
                            ? "bg-blue-300 text-white font-semibold text-sm"
                            : "hover:bg-blue-100"}`}
                        onClick={() => setSelectedId(summary._id)}
                      >
                        Chapter {summary.chapter}
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
              {/* Summary details */}
              <section className="flex flex-col w-full bg-white rounded-lg p-6 shadow justify-between">
                {summariesLoading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : selectedSummary ? (
                  <>
                    <div className="mb-2 text-lg font-bold">
                      Chapter {selectedSummary.chapter}
                    </div>
                    <PrettySummary summary={selectedSummary.summary} />
                    <button
                      type="button"
                      className="ml-2 text-red-400 hover:text-red-700 mt-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingId(selectedSummary._id);
                        setConfirmDeleteOpen(true)}}
                      aria-label="Delete summary"
                    >
                      Delete Summary
                    </button>
                  </>
                ) : (
                  <div className="text-gray-400">Select a summary to view details.</div>
                )}
              </section>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="ml-1">Generate Summary</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1">
                  <label className="font-medium ml-1">Select Chapter</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" tabIndex={-1} className="p-0.5 text-gray-500 hover:text-blue-500 focus:outline-none">
                          <Info className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <span>
                          Select what chapter to generate a summary from. A summary will be generated from all the notes within the selected chapter.
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={selectedChapter ?? ""}
                  onValueChange={setSelectedChapter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter..." />
                  </SelectTrigger>
                  <SelectContent>
                    {chapterNumbers.map((chapter) => (
                      <SelectItem key={chapter} value={chapter.toString()}>
                        Chapter {chapter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {generateSummaryError && <div className="text-red-500 text-sm">{generateSummaryError}</div>}
              </div>
              <DialogFooter>
                <Button
                  onClick={async () => {
                    setGenerateSummaryError(null);
                    if (!selectedChapter) {
                      setGenerateSummaryError("Please select a chapter.");
                      return;
                    }
                    setGeneratingSummary(true);
                    try {
                      await generateSummary(token as string, { course: course.course, chapter: Number(selectedChapter)});
                      setDialogOpen(false);
                      setSelectedChapter(null);
                      await refetchSummaries();
                    } catch (e) {
                      setGenerateSummaryError("Failed to generate summary.");
                    }
                    setGeneratingSummary(false);
                  }}
                  disabled={!selectedChapter || generatingSummary}
                >
                  {generatingSummary ? "Generating..." : "Generate"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={generatingSummary}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Summary</DialogTitle>
              </DialogHeader>
              <div>
                Are you sure you want to delete? This action cannot be undone.
              </div>
              {deletingError && <div className="text-red-500 text-sm">{deletingError}</div>}
              <DialogFooter>
                <Button
                  variant="destructive"
                  disabled={deleting}
                  onClick={async () => {
                    setDeleting(true);
                    setDeletingError(null);
                    try {
                      if (deletingId) {
                        await deleteItem(token as string, deletingId);
                        await refetchSummaries();
                        if (selectedId === deletingId) setSelectedId(null);
                        setConfirmDeleteOpen(false);
                      }
                    } catch {
                      setDeletingError("Failed to delete summary.");
                    }
                    setDeleting(false);
                  }}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmDeleteOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </TabsContent>

        <TabsContent value="tests">
          <div className="flex flex-col h-full">
            {/* Top bar with button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold ml-2">Practice Tests</h3>
              <Button variant="outline" onClick={() => setPracticeTestDialogOpen(true)}>
                Generate Practice Test
              </Button>
            </div>
            {/* Main content: left list, right details */}
            <div className="flex gap-6 min-h-[150px]">
              {/* Practice Test list */}
              <aside className="w-[15%] self-start bg-gray-50 rounded-lg p-2 flex flex-col gap-1">
                {testsLoading ? (
                  <div className="text-gray-400 p-4">Loading practice tests...</div>
                ) : testsError ? (
                  <div className="text-red-500 p-4">
                    Failed to load practice tests.
                    <Button size="sm" variant="ghost" onClick={() => refetchTests()}>Retry</Button>
                  </div>
                ) : practiceTests.length === 0 ? (
                  <div className="text-gray-500 p-4">No practice tests yet</div>
                ) : (
                  <ul>
                    {(practiceTests as PracticeTest[])
                      .slice()
                      .map(test => (
                        <li
                          key={test._id}
                          className={`cursor-pointer rounded px-1 py-2 mb-1 transition text-sm
                            ${selectedTestId === test._id
                              ? "bg-blue-300 text-white font-semibold"
                              : "hover:bg-blue-100"}`}
                          onClick={() => setSelectedTestId(test._id)}
                        >
                          {test.course !== undefined
                            ? `${test.course}`
                            : `Test ${test._id.slice(-4)}`} {/* fallback */}
                        </li>
                      ))}
                  </ul>
                )}
              </aside>
              {/* Practice Test details */}
              <section className="w-[85%] bg-white rounded-lg p-6 shadow justify-between">
                {testsLoading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : selectedPracticeTest ? (
                  <>
                    <div className="mb-2 text-lg font-bold">
                      {selectedPracticeTest.course !== undefined
                        ? `${selectedPracticeTest.course}`
                        : `Practice Test`}
                    </div>
                    {/* Display your practice test details here */}
                    <div className="bg-gray-50 p-2 rounded text-sm w-full">
                      <PrettifyTests key={selectedTestId} questions={selectedPracticeTest.questions} />
                    </div>
                    <button
                      type="button"
                      className="ml-2 text-red-400 hover:text-red-700 mt-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingTestId(selectedPracticeTest._id);
                        setConfirmDeleteTestOpen(true);
                      }}
                      aria-label="Delete practice test"
                    >
                      Delete Practice Test
                    </button>
                  </>
                ) : (
                  <div className="text-gray-400">Select a test to view details.</div>
                )}
              </section>
            </div>
          </div>
          {/* Generate Practice Test Dialog (optional) */}
          <Dialog open={practiceTestDialogOpen} onOpenChange={setPracticeTestDialogOpen}>
            <DialogContent className="min-w-[400px]">
              <DialogHeader>
                <DialogTitle className="ml-1">Generate Practice Test</DialogTitle>
              </DialogHeader>
              {/* ...your content for generating practice test... */}
              <DialogFooter className="mt-4">
                <div className="text-gray-600 mb-2 ml-1">
                  Number of questions to generate:
                </div>
              <Select value={selectedNumber} onValueChange={setSelectedNumber}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a number..." />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                <Button 
                  onClick={async () => {
                    setGeneratePracticeTestError(null);
                    setGeneratingPracticeTest(true);
                    try {
                      await generatePracticeTest(token as string, course.course, selectedNumber)
                      setPracticeTestDialogOpen(false);
                      await refetchTests()
                    } catch (e) {
                      setGeneratePracticeTestError("Failed to generate practice test.");
                    }
                    setGeneratingPracticeTest(false);
                   }
                  }
                  disabled={generatingPracticeTest}
                  >{generatingPracticeTest ? "Generating..." : "Generate"}
                  </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setPracticeTestDialogOpen(false)}
                  disabled={generatingPracticeTest}
                  >Cancel</Button>
                  {generatePracticeTestError && <div className="text-red-500 text-sm">{generatePracticeTestError}</div>}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={confirmDeleteTestOpen} onOpenChange={setConfirmDeleteTestOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Practice Test</DialogTitle>
              </DialogHeader>
              <div>
                Are you sure you want to delete this practice test? This action cannot be undone.
              </div>
              {deletingTestError && <div className="text-red-500 text-sm">{deletingTestError}</div>}
              <DialogFooter>
                <Button
                  variant="destructive"
                  disabled={deletingTest}
                  onClick={async () => {
                    setDeletingTest(true);
                    setDeletingTestError(null);
                    try {
                      if (deletingTestId) {
                        await deleteItem(token as string, deletingTestId);
                        await refetchTests();
                        if (selectedTestId === deletingTestId) setSelectedTestId(null);
                        setConfirmDeleteTestOpen(false);
                      }
                    } catch {
                      setDeletingTestError("Failed to delete practice test.");
                    }
                    setDeletingTest(false);
                  }}
                >
                  {deletingTest ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmDeleteTestOpen(false)}
                  disabled={deletingTest}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

      </Tabs>
    </div>
  );
}
