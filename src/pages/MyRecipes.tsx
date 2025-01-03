import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FoodSelect } from "@/components/FoodSelect";
import { Trash, Pencil, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SaveToVaultButton } from "@/components/meal/SaveToVaultButton";

interface Ingredient {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface Recipe {
  title: string;
  description: string;
  instructions: {
    steps: string[];
    servingSize?: {
      servings: number;
      gramsPerServing: number;
    };
  };
  ingredients: Ingredient[];
  macronutrients: {
    perServing: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
  };
}

const MyRecipes = () => {
  const { toast } = useToast();
  const [recipeName, setRecipeName] = useState("");
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
    if (!recipeName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a recipe name",
        variant: "destructive",
      });
      return;
    }

    if (ingredients.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    const totalMacros = calculateTotalMacros();

    const recipe: Recipe = {
      title: recipeName,
      description: "",
      instructions: {
        steps: [],
      },
      ingredients,
      macronutrients: {
        perServing: totalMacros,
      },
    };

    // Save to localStorage for now
    const savedRecipes = JSON.parse(localStorage.getItem("myRecipes") || "[]");
    savedRecipes.push(recipe);
    localStorage.setItem("myRecipes", JSON.stringify(savedRecipes));

    toast({
      title: "Success",
      description: "Recipe saved successfully",
    });

    // Reset form
    setRecipeName("");
    setIngredients([]);
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      
      <Card className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Create New Recipe</h2>
        
        <div className="space-y-4">
          <Input
            placeholder="Recipe Name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add Ingredients</h3>
            <FoodSelect onAddComponent={handleAddIngredient} />
          </div>

          {ingredients.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ingredients List</h3>
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{ingredient.name}</p>
                      {editingIndex === index ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number"
                            value={editWeight}
                            onChange={(e) => setEditWeight(Number(e.target.value))}
                            className="w-24"
                          />
                          <Button size="sm" onClick={handleUpdateWeight}>
                            Update
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Weight: {ingredient.amount}g | 
                          Calories: {Math.round(ingredient.calories)} | 
                          P: {Math.round(ingredient.protein)}g | 
                          C: {Math.round(ingredient.carbs)}g | 
                          F: {Math.round(ingredient.fat)}g |
                          Fiber: {Math.round(ingredient.fiber)}g
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditingWeight(index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteIngredient(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Total Macronutrients</h3>
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(calculateTotalMacros()).map(([key, value]) => (
                    <div key={key} className="bg-muted p-2 rounded-lg">
                      <p className="text-sm text-muted-foreground capitalize">{key}</p>
                      <p className="font-semibold">{Math.round(value)}{key === 'calories' ? '' : 'g'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button onClick={handleSaveRecipe} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Recipe
                </Button>
                <SaveToVaultButton
                  meal={{
                    title: recipeName,
                    description: "",
                    instructions: {
                      steps: [],
                    },
                    ingredients,
                    macronutrients: {
                      perServing: calculateTotalMacros(),
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MyRecipes;