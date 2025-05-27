type PrettySummaryProps = { summary: any };

export function PrettySummary({ summary }: PrettySummaryProps) {
  // Handle null/undefined
  if (summary == null) return null;

  // Handle plain string
  if (typeof summary === "string") {
    return <div className="text-gray-800 whitespace-pre-line text-left">{summary}</div>;
  }

  // Handle array (rare for your summaries, but just in case)
  if (Array.isArray(summary)) {
    return (
      <ul className="list-disc pl-6 space-y-1 text-left">
        {summary.map((item, idx) => (
          <li key={idx}>
            <PrettySummary summary={item} />
          </li>
        ))}
      </ul>
    );
  }

  // Handle object
  if (typeof summary === "object") {
    return (
      <div className="space-y-4 text-left">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key}>
            <div className="font-semibold text-lg mb-1 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </div>
            {typeof value === "string" ? (
              <div className="text-gray-700 pl-2">{value}</div>
            ) : typeof value === "object" && value !== null ? (
              <ul className="list-disc pl-6 space-y-1">
                {Object.entries(value).map(([subKey, subValue]) =>
                  typeof subValue === "string" ? (
                    <li key={subKey}>
                      <span className="font-semibold">
                        {subKey.replace(/([A-Z])/g, " $1")}:{" "}
                      </span>
                      <span className="text-gray-700">{subValue}</span>
                    </li>
                  ) : typeof subValue === "object" && subValue !== null ? (
                    <li key={subKey}>
                      <span className="font-semibold">
                        {subKey.replace(/([A-Z])/g, " $1")}:
                      </span>
                      <PrettySummary summary={subValue} />
                    </li>
                  ) : (
                    <li key={subKey}>
                      <span className="font-semibold">
                        {subKey.replace(/([A-Z])/g, " $1")}:{" "}
                      </span>
                      <span className="text-gray-700">{String(subValue)}</span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <span className="text-gray-700">{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Handle other primitives (number, boolean, etc.)
  return <span className="text-gray-800 text-left">{String(summary)}</span>;
}

export default PrettySummary;
