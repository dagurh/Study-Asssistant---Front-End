export default function About() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">The tech stack</h1>
      <p className="text-lg text-slate-700 max-w-2xl mb-8">
        Study Assistant is a web application built to help students organize study materials, generate summaries, and create practice tests efficiently.
      </p>
      <div className="space-y-4 text-left max-w-xl">
      <p className="mb-2">
        The frontend is developed using <strong>Vite</strong>, <strong>React</strong>, and <strong>TypeScript</strong>, styled with <strong>shadcn/ui</strong>.
        The frontend code is available on <a href="https://github.com/dagurh/Study-Asssistant---Front-End" target="_blank" className="text-blue-600 underline">
          GitHub
        </a>.
      </p>
      <p className="mb-2">
        The backend is powered by <strong>Python</strong> with <strong>FastAPI</strong>, using <strong>MongoDB</strong> for data storage.
        The backend code is available on <a href="https://github.com/dagurh/studyAssistant" target="_blank" className="text-blue-600 underline">
           GitHub
        </a>.
      </p>
      <p>
        Both the frontend and backend are deployed on <strong>Render</strong>, ensuring reliable and scalable hosting.
      </p>
      </div>
    </div>
  );
}
