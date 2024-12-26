interface MacroRatiosProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroRatios({ calories, protein, carbs, fat }: MacroRatiosProps) {
  const calculateRatio = (grams: number, caloriesPerGram: number) => {
    return Math.round((grams * caloriesPerGram / calories) * 100);
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Macronutrient Breakdown</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-sm text-blue-800">Protein Ratio</p>
          <p className="text-lg font-semibold text-blue-900">
            {calculateRatio(protein, 4)}%
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-green-800">Carbs Ratio</p>
          <p className="text-lg font-semibold text-green-900">
            {calculateRatio(carbs, 4)}%
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-sm text-red-800">Fat Ratio</p>
          <p className="text-lg font-semibold text-red-900">
            {calculateRatio(fat, 9)}%
          </p>
        </div>
      </div>
    </div>
  );
}