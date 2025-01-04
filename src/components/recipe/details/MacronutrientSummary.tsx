import { Activity, Flame, Package, Carrot, Droplet } from "lucide-react";
import { MacroRatios } from "@/components/meal/MacroRatios";

interface MacronutrientSummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const MacronutrientSummary = ({ 
  calories, 
  protein, 
  carbs, 
  fat 
}: MacronutrientSummaryProps) => {
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-purple-500" />
        <span className="text-sm font-medium">Nutritional Information</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        <div className="bg-background/50 rounded-lg p-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Flame className="h-3 w-3" />
            <p>Calories</p>
          </div>
          <p className="font-semibold">{Math.round(calories)}</p>
        </div>
        <div className="bg-background/50 rounded-lg p-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-3 w-3" />
            <p>Protein</p>
          </div>
          <p className="font-semibold">{Math.round(protein)}g</p>
        </div>
        <div className="bg-background/50 rounded-lg p-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Carrot className="h-3 w-3" />
            <p>Carbs</p>
          </div>
          <p className="font-semibold">{Math.round(carbs)}g</p>
        </div>
        <div className="bg-background/50 rounded-lg p-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Droplet className="h-3 w-3" />
            <p>Fat</p>
          </div>
          <p className="font-semibold">{Math.round(fat)}g</p>
        </div>
      </div>
      
      {calories > 0 && (
        <MacroRatios
          calories={calories}
          protein={protein}
          carbs={carbs}
          fat={fat}
        />
      )}
    </div>
  );
};