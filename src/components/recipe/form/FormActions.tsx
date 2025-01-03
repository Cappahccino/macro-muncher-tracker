import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { SaveToVaultButton } from "@/components/meal/SaveToVaultButton";

interface FormActionsProps {
  onSave: () => void;
  recipe: {
    title: string;
    description: string;
    instructions: {
      steps: string[];
    };
    ingredients: {
      name: string;
      amount: number;
      macros: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
      };
    }[];
    macronutrients: {
      perServing: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
      };
    };
  };
}

export function FormActions({ onSave, recipe }: FormActionsProps) {
  return (
    <div className="flex items-center gap-4 pt-4">
      <Button onClick={onSave} className="flex items-center gap-2">
        <Save className="h-4 w-4" />
        Save Recipe
      </Button>
      <SaveToVaultButton meal={recipe} existingInstructions={recipe.instructions.steps} />
    </div>
  );
}