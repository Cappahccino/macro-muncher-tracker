import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RecipeIngredientSelect } from "@/components/recipe/RecipeIngredientSelect";
import { RecipeBasicInfo } from "./form/RecipeBasicInfo";
import { IngredientsList } from "./form/IngredientsList";
import { MacroSummary } from "./form/MacroSummary";
import { FormActions } from "./form/FormActions";

interface Ingredient {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface CreateRecipeFormProps {
  onSave: (recipe: {
    title: string;
    notes: string;
    instructions: string[];
    ingredients: Ingredient[];
    macros: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
  }) => void;
}

export function CreateRecipeForm({ onSave }: CreateRecipeFormProps) {
  const [recipeName, setRecipeName] = useState("");
  const [notes, setNotes] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editWeight, setEditWeight] = useState<number>(0);

  const handleAddIngredient = (ingredient: Ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const handleDeleteIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const startEditingWeight = (index: number) => {
    setEditingIndex(index);
    setEditWeight(ingredients[index].amount);
  };

  const handleUpdateWeight = () => {
    if (editingIndex === null) return;

    const updatedIngredients = [...ingredients];
    const ingredient = updatedIngredients[editingIndex];
    const ratio = editWeight / ingredient.amount;

    updatedIngredients[editingIndex] = {
      ...ingredient,
      amount: editWeight,
      calories: ingredient.calories * ratio,
      protein: ingredient.protein * ratio,
      carbs: ingredient.carbs * ratio,
      fat: ingredient.fat * ratio,
      fiber: ingredient.fiber * ratio,
    };

    setIngredients(updatedIngredients);
    setEditingIndex(null);
  };

  const calculateTotalMacros = () => {
    return ingredients.reduce(
      (acc, curr) => ({
        calories: acc.calories + curr.calories,
        protein: acc.protein + curr.protein,
        carbs: acc.carbs + curr.carbs,
        fat: acc.fat + curr.fat,
        fiber: acc.fiber + curr.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  const handleSaveRecipe = () => {
    const totalMacros = calculateTotalMacros();
    onSave({
      title: recipeName,
      notes,
      instructions: instructions.split('\n').filter(line => line.trim() !== ''),
      ingredients,
      macros: totalMacros,
    });
    
    // Reset form
    setRecipeName("");
    setNotes("");
    setInstructions("");
    setIngredients([]);
  };

  const totalMacros = calculateTotalMacros();

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Create New Recipe</h2>
      
      <div className="space-y-4">
        <RecipeBasicInfo
          recipeName={recipeName}
          setRecipeName={setRecipeName}
          notes={notes}
          setNotes={setNotes}
          instructions={instructions}
          setInstructions={setInstructions}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add Ingredients</h3>
          <RecipeIngredientSelect onAddIngredient={handleAddIngredient} />
        </div>

        {ingredients.length > 0 && (
          <div className="space-y-4">
            <IngredientsList
              ingredients={ingredients}
              editingIndex={editingIndex}
              editWeight={editWeight}
              onDeleteIngredient={handleDeleteIngredient}
              onStartEditingWeight={startEditingWeight}
              onEditWeightChange={setEditWeight}
              onUpdateWeight={handleUpdateWeight}
            />

            <MacroSummary macros={totalMacros} />

            <FormActions
              onSave={handleSaveRecipe}
              recipe={{
                title: recipeName,
                description: notes,
                instructions: {
                  steps: instructions.split('\n').filter(line => line.trim() !== ''),
                },
                ingredients: ingredients.map(ingredient => ({
                  name: ingredient.name,
                  amount: ingredient.amount,
                  macros: {
                    calories: ingredient.calories,
                    protein: ingredient.protein,
                    carbs: ingredient.carbs,
                    fat: ingredient.fat,
                    fiber: ingredient.fiber,
                  }
                })),
                macronutrients: {
                  perServing: totalMacros,
                },
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
}