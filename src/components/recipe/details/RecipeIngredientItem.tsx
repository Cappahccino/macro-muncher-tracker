import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Ingredient {
  name: string;
  amount: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface RecipeIngredientItemProps {
  ingredient: Ingredient;
  index: number;
}

export function RecipeIngredientItem({ ingredient, index }: RecipeIngredientItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li key={index} className="text-sm">
      <div className="space-y-2">
        <div 
          className="flex items-center justify-between cursor-pointer p-2 hover:bg-muted/50 rounded-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{ingredient.name} - {Math.round(ingredient.amount)}g</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {isExpanded && ingredient.macros && (
          <div className="grid grid-cols-5 gap-2 pl-4 text-xs bg-muted/50 p-2 rounded">
            <div>
              <p className="text-muted-foreground">Calories</p>
              <p>{Math.round(ingredient.macros.calories)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Protein</p>
              <p>{Math.round(ingredient.macros.protein)}g</p>
            </div>
            <div>
              <p className="text-muted-foreground">Carbs</p>
              <p>{Math.round(ingredient.macros.carbs)}g</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fat</p>
              <p>{Math.round(ingredient.macros.fat)}g</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fiber</p>
              <p>{Math.round(ingredient.macros.fiber)}g</p>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}