interface MacroSummaryProps {
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export function MacroSummary({ macros }: MacroSummaryProps) {
  return (
    <div className="pt-4 border-t">
      <h3 className="text-lg font-semibold mb-2">Total Macronutrients</h3>
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(macros).map(([key, value]) => (
          <div key={key} className="bg-muted p-2 rounded-lg">
            <p className="text-sm text-muted-foreground capitalize">{key}</p>
            <p className="font-semibold">{Math.round(value)}{key === 'calories' ? '' : 'g'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}