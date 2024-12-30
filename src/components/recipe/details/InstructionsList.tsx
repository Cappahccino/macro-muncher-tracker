interface InstructionsListProps {
  steps: string[];
}

export function InstructionsList({ steps }: InstructionsListProps) {
  if (!steps?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Instructions
      </h3>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <ol className="space-y-2 list-decimal list-inside">
          {steps.map((step, index) => (
            <li key={index} className="text-gray-200">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}