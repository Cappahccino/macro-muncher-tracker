import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { RecipeHeader } from "./details/RecipeHeader";
import { ServingInfo } from "./details/ServingInfo";
import { MacronutrientSummary } from "./details/MacronutrientSummary";
import { IngredientsList } from "./details/IngredientsList";
import { InstructionsList } from "./details/InstructionsList";
import { DietaryTags } from "./details/DietaryTags";
import { useState } from "react";
import { EditIngredientWeightDialog } from "./EditIngredientWeightDialog";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: {
    steps?: string[];
    servingSize?: {
      servings: number;
      gramsPerServing: number;
    };
  } | null;
  created_at: string;
  dietary_tags?: string[];
  ingredients?: Array<{
    recipe_ingredient_id: string;
    name: string;
    amount: number;
    quantity_g: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    ingredient_id?: string;
  }>;
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_fiber?: number;
}

interface RecipeDetailsDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetailsDialog({ recipe, isOpen, onClose }: RecipeDetailsDialogProps) {
  const [editingIngredient, setEditingIngredient] = useState<{
    index: number;
    ingredient: NonNullable<Recipe['ingredients']>[0];
  } | null>(null);

  if (!recipe) return null;

  const servingInfo = recipe.instructions?.servingSize;
  const steps = recipe.instructions?.steps || [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
          <RecipeHeader
            title={recipe.title}
            createdAt={recipe.created_at}
            description={recipe.description}
          />
          
          <div className="mt-6 space-y-6">
            {servingInfo && (
              <ServingInfo
                servings={servingInfo.servings}
                gramsPerServing={servingInfo.gramsPerServing}
              />
            )}

            <MacronutrientSummary
              calories={recipe.total_calories}
              protein={recipe.total_protein}
              carbs={recipe.total_carbs}
              fat={recipe.total_fat}
              fiber={recipe.total_fiber}
            />

            <IngredientsList 
              ingredients={recipe.ingredients || []} 
              onEdit={(index, ingredient) => setEditingIngredient({ index, ingredient })}
            />

            <InstructionsList steps={steps} />

            {recipe.dietary_tags && (
              <DietaryTags tags={recipe.dietary_tags} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <EditIngredientWeightDialog
        open={editingIngredient !== null}
        onOpenChange={(open) => !open && setEditingIngredient(null)}
        ingredient={editingIngredient?.ingredient}
        onSave={(updatedWeight) => {
          // Handle weight update logic here
          console.log('Updated weight:', updatedWeight);
          setEditingIngredient(null);
        }}
      />
    </>
  );
}