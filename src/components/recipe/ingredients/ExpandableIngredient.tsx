import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface IngredientMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ExpandableIngredientProps {
  name: string;
  amount: number;
  macros?: IngredientMacros;
}

export function ExpandableIngredient({ name, amount, macros }: ExpandableIngredientProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <div 
        className="flex items-center justify-between cursor-pointer p-2 hover:bg-muted/50 rounded-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-sm">{name} - {Math.round(amount)}g</span>
        {isExpanded ? (
          <Minus className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </div>
      
      {isExpanded && macros && (
        <div className="grid grid-cols-4 gap-2 pl-4 text-xs bg-muted/50 p-2 rounded">
          <div>
            <p className="text-muted-foreground">Calories</p>
            <p>{Math.round(macros.calories)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Protein</p>
            <p>{Math.round(macros.protein)}g</p>
          </div>
          <div>
            <p className="text-muted-foreground">Carbs</p>
            <p>{Math.round(macros.carbs)}g</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fat</p>
            <p>{Math.round(macros.fat)}g</p>
          </div>
        </div>
      )}
    </div>
  );
}