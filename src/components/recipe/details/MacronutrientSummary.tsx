import { MacroNutrient } from "@/components/meal/MacroNutrient";

interface MacronutrientSummaryProps {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export function MacronutrientSummary({ 
  calories, 
  protein, 
  carbs, 
  fat, 
  fiber 
}: MacronutrientSummaryProps) {
  if (!calories && !protein && !carbs && !fat && !fiber) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Total Nutrition
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-800/50 rounded-lg p-4">
        <MacroNutrient label="Calories" value={calories || 0} unit="" />
        <MacroNutrient label="Protein" value={protein || 0} unit="g" />
        <MacroNutrient label="Carbs" value={carbs || 0} unit="g" />
        <MacroNutrient label="Fat" value={fat || 0} unit="g" />
        <MacroNutrient label="Fiber" value={fiber || 0} unit="g" />
      </div>
    </div>
  );
}