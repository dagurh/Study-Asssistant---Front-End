export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-slate-800">Welcome to Your Study Assistant!</h1>
      <p className="text-lg text-slate-700 max-w-2xl mb-8">
        Elevate your learning experience. This tool is designed to help you organize notes, generate insightful summaries, and create practice tests to master your course material.
      </p>
      <div className="space-y-4 text-left max-w-xl">
        <h2 className="text-2xl font-semibold text-slate-700 mb-3 text-center">Key Features:</h2>
        <p className="text-md text-slate-600"><strong className="text-slate-700">📝 Organized Note-Taking:</strong> Easily create and categorize notes by chapter for each of your courses.</p>
        <p className="text-md text-slate-600"><strong className="text-slate-700">💡 Smart Summaries:</strong> Generate concise summaries from your notes on a chapter-by-chapter basis to quickly review key concepts.</p>
        <p className="text-md text-slate-600"><strong className="text-slate-700">✍️ Practice Tests:</strong> Create comprehensive practice tests drawing from all notes within a course to effectively prepare for exams.</p>
      </div>
      <p className="mt-10 text-md text-slate-600">Get started by navigating to your <a href="/courses" className="text-blue-600 hover:underline font-semibold">Courses</a>!</p>
    </div>
  );
}