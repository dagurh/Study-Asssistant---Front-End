import { useState } from "react";
import { Button } from "@/components/ui/button";

// Optionally export for typing elsewhere
export type Question = { question: string; answer: string };

interface PrettifyTestsProps {
  questions: any[] | { questions: any[] };
}

export function PrettifyTests({ questions }: PrettifyTestsProps) {
  // Normalize input: if it has a 'questions' property, use that, else use questions directly
  const normalizedQuestions: Question[] =
    Array.isArray(questions)
      ? (questions as Question[])
      : Array.isArray((questions as any).questions)
        ? (questions as any).questions
        : [];

  const [revealed, setRevealed] = useState<boolean[]>(() =>
    Array(normalizedQuestions.length).fill(false)
  );

  const handleReveal = (idx: number) => {
    setRevealed(prev =>
      prev.map((val, i) => (i === idx ? !val : val))
    );
  };

  if (!Array.isArray(normalizedQuestions) || normalizedQuestions.length === 0) {
    return <div className="text-gray-500">No questions to show.</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {normalizedQuestions.map((q, idx) => (
        <div key={idx} className="border rounded-lg p-4 bg-gray-50 w-full">
          <div className="font-medium mb-2 w-full break-words">
            <span className="text-blue-700">Q{idx + 1}:</span> {q.question}
          </div>
          {revealed[idx] ? (
            <div className="mt-2 text-green-700 font-semibold w-full break-words whitespace-pre-line">{q.answer}</div>
          ) : (
            <Button
              size="sm"
              className="mt-2"
              variant="outline"
              onClick={() => handleReveal(idx)}
            >
              {revealed[idx] ? "Hide Answer" : "Show Answer"}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
