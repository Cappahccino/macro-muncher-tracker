import { Activity, Flame, Package, Carrot, Droplet, Leaf } from "lucide-react";

interface MacronutrientSummaryProps {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export const MacronutrientSummary = ({ 
  calories = 0, 
  protein = 0, 
  carbs = 0, 
  fat = 0,
  fiber = 0
}: MacronutrientSummaryProps) => {
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-purple-500" />
        <span className="text-sm font-medium">Nutritional Information</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
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
        <div className="bg-background/50 rounded-lg p-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Leaf className="h-3 w-3" />
            <p>Fiber</p>
          </div>
          <p className="font-semibold">{Math.round(fiber)}g</p>
        </div>
      </div>
    </div>
  );
};