interface RecipeInstructionsProps {
  steps: string[];
}

export function RecipeInstructions({ steps }: RecipeInstructionsProps) {
  if (!steps?.length) return null;
  
  return (
    <div className="mt-4">
      <h5 className="font-medium mb-2">Instructions:</h5>
      <ol className="list-decimal list-inside space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="text-sm">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}